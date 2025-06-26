import React, { useState, useEffect } from 'react';
import { companyUserService } from '../../services/companyUserService';
import { Profile, ProfileRole } from '@/profile/types';
import ProfileSearch from '@/profile/ProfileSearch';

interface CompanyUserListProps {
  companyId: string;
}

const CompanyUserList: React.FC<CompanyUserListProps> = ({
  companyId
}) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [editingRoles, setEditingRoles] = useState<Set<string>>(new Set());
  const [roleUpdates, setRoleUpdates] = useState<Record<string, ProfileRole>>({});
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUserForAdd, setSelectedUserForAdd] = useState<Profile | null>(null);
  const [selectedRoleForAdd, setSelectedRoleForAdd] = useState<ProfileRole>(ProfileRole.MEMBER);
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await companyUserService.getCompanyUsers(companyId);
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '사용자 목록을 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchUsers();
    }
  }, [companyId]);

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'owner':
        return '소유자';
      case 'manager':
        return '관리자';
      case 'member':
        return '멤버';
      default:
        return '역할 없음';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'wholesaler':
        return '도매상';
      case 'retailer':
        return '소매상';
      case 'farmer':
        return '농가';
      default:
        return type;
    }
  };

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const startRoleEdit = (userId: string) => {
    const newEditing = new Set(editingRoles);
    newEditing.add(userId);
    setEditingRoles(newEditing);
  };

  const cancelRoleEdit = (userId: string) => {
    const newEditing = new Set(editingRoles);
    newEditing.delete(userId);
    setEditingRoles(newEditing);
    
    const newRoleUpdates = { ...roleUpdates };
    delete newRoleUpdates[userId];
    setRoleUpdates(newRoleUpdates);
  };

  const saveRoleEdit = async (userId: string) => {
    const newRole = roleUpdates[userId];
    if (!newRole) return;

    try {
      await companyUserService.updateUserRole(userId, newRole);
      
      // 사용자 목록 업데이트
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // 편집 상태 초기화
      const newEditing = new Set(editingRoles);
      newEditing.delete(userId);
      setEditingRoles(newEditing);
      
      const newRoleUpdates = { ...roleUpdates };
      delete newRoleUpdates[userId];
      setRoleUpdates(newRoleUpdates);
      
    } catch (error) {
      console.error('역할 수정 실패:', error);
      alert('역할 수정에 실패했습니다.');
    }
  };

  const handleRoleChange = (userId: string, newRole: ProfileRole) => {
    setRoleUpdates(prev => ({
      ...prev,
      [userId]: newRole
    }));
  };

  const handleAddUser = async () => {
    if (!selectedUserForAdd) return;

    setAddingUser(true);
    try {
      await companyUserService.addCompanyUser(companyId, selectedUserForAdd.id, selectedRoleForAdd);
      
      // 사용자 목록 새로고침
      const updatedUsers = await companyUserService.getCompanyUsers(companyId);
      setUsers(updatedUsers);
      
      // 모달 닫기
      setShowAddUser(false);
      setSelectedUserForAdd(null);
      setSelectedRoleForAdd(ProfileRole.MEMBER);
      
      alert('사용자가 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('사용자 추가 실패:', error);
      alert('사용자 추가에 실패했습니다.');
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('정말로 이 사용자를 회사에서 제거하시겠습니까?')) return;

    try {
      await companyUserService.removeCompanyUser(companyId, userId);
      
      // 사용자 목록 새로고침
      const updatedUsers = await companyUserService.getCompanyUsers(companyId);
      setUsers(updatedUsers);
      
      alert('사용자가 성공적으로 제거되었습니다.');
    } catch (error) {
      console.error('사용자 제거 실패:', error);
      alert('사용자 제거에 실패했습니다.');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? '활성' : '비활성';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        등록된 사용자가 없습니다
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">회사 사용자 목록</h3>
            <p className="text-sm text-gray-500 mt-1">총 {users.length}명의 사용자</p>
          </div>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showAddUser ? '취소' : '사용자 추가'}
          </button>
        </div>
      </div>
      
      {/* 사용자 추가 섹션 - 드롭다운 형태 */}
      {showAddUser && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">사용자 추가</h4>
            
            {/* 사용자 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자 선택
              </label>
              {selectedUserForAdd ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{selectedUserForAdd.name || selectedUserForAdd.username}</p>
                      <p className="text-sm text-gray-500">{selectedUserForAdd.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{selectedUserForAdd.company_name || '-'}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedUserForAdd(null)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        변경
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <ProfileSearch onSelect={setSelectedUserForAdd} />
              )}
            </div>

            {/* 역할 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                역할 선택
              </label>
              <select
                value={selectedRoleForAdd}
                onChange={(e) => setSelectedRoleForAdd(e.target.value as ProfileRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={ProfileRole.MEMBER}>멤버</option>
                <option value={ProfileRole.MANAGER}>관리자</option>
                <option value={ProfileRole.OWNER}>소유자</option>
              </select>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddUser(false);
                  setSelectedUserForAdd(null);
                  setSelectedRoleForAdd(ProfileRole.MEMBER);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={addingUser}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleAddUser}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={addingUser || !selectedUserForAdd}
              >
                {addingUser ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {users.map((user) => {
          const isExpanded = expandedUsers.has(user.id);
          const isEditingRole = editingRoles.has(user.id);
          const currentRole = roleUpdates[user.id] || user.role;
          
          return (
            <div key={user.id} className="bg-white">
              {/* 사용자 기본 정보 */}
              <div
                onClick={() => toggleUserExpansion(user.id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {user.username}
                        </h4>
                        {user.role && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {getRoleLabel(user.role)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.name}</p>
                      {user.email && (
                        <p className="text-sm text-gray-500">{user.email}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {getTypeLabel(user.type)}
                        </span>
                        <span className="text-xs text-gray-400">
                          가입일: {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-400">
                    <svg 
                      className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 확장된 사용자 상세 정보 */}
              {isExpanded && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                  <div className="pt-4 space-y-4">
                    {/* 사용자 상세 정보 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">사용자명:</span>
                        <p className="mt-1">{user.username}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">이름:</span>
                        <p className="mt-1">{user.name || '-'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">이메일:</span>
                        <p className="mt-1">{user.email || '-'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">타입:</span>
                        <p className="mt-1">{getTypeLabel(user.type)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">가입일:</span>
                        <p className="mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">수정일:</span>
                        <p className="mt-1">{new Date(user.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* 역할 수정 섹션 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">역할 관리</h5>
                        <div className="flex space-x-2">
                          {!isEditingRole ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startRoleEdit(user.id);
                              }}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              역할 수정
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveRoleEdit(user.id);
                                }}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                              >
                                저장
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelRoleEdit(user.id);
                                }}
                                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                              >
                                취소
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUser(user.id);
                            }}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            제거
                          </button>
                        </div>
                      </div>
                      
                      {isEditingRole ? (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">역할 선택</label>
                          <select
                            value={currentRole}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as ProfileRole)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value={ProfileRole.MEMBER}>멤버</option>
                            <option value={ProfileRole.MANAGER}>관리자</option>
                            <option value={ProfileRole.OWNER}>소유자</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700">현재 역할:</span>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyUserList; 