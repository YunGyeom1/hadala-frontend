import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Profile, ProfileRole } from '@/profile/types';
import ProfileSearch from '@/profile/ProfileSearch';
import { companyUserService } from './services/companyUserService';
import { profileService } from '@/profile/profile';

interface CompanyUserListProps {
  companyId: string;
}

const CompanyUserList: React.FC<CompanyUserListProps> = ({ companyId }) => {
  const queryClient = useQueryClient();
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 현재 로그인한 프로필 정보
  const currentProfileId = localStorage.getItem('profile_id');
  const currentProfile = localStorage.getItem('current_profile') ? 
    JSON.parse(localStorage.getItem('current_profile')!) : null;

  // 회사 유저 목록 조회
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['company-users', companyId],
    queryFn: () => companyUserService.getCompanyUsers(companyId),
    enabled: !!companyId,
  });

  // 현재 사용자가 owner인지 확인 (회사 유저 목록에서 확인)
  const currentUserInCompany = users.find(user => user.id === currentProfileId);
  const isCurrentUserOwner = currentUserInCompany?.role === ProfileRole.OWNER;

  // 유저 추가 뮤테이션
  const addUserMutation = useMutation({
    mutationFn: ({ profileId, role }: { profileId: string; role: string }) =>
      companyUserService.addCompanyUser(companyId, profileId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-users', companyId] });
      setIsSearching(false);
      // 에러 상태 초기화
      addUserMutation.reset();
    },
  });

  // 유저 제거 뮤테이션
  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => companyUserService.removeCompanyUser(companyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-users', companyId] });
      // 에러 상태 초기화
      removeUserMutation.reset();
    },
  });

  // 역할 변경 뮤테이션
  const updateRoleMutation = useMutation({
    mutationFn: ({ profileId, role }: { profileId: string; role: string }) =>
      profileService.updateProfileRole(profileId, role as 'owner' | 'manager' | 'member'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-users', companyId] });
      // 에러 상태 초기화
      updateRoleMutation.reset();
    },
  });

  const getRoleLabel = (role: ProfileRole) => {
    switch (role) {
      case ProfileRole.OWNER:
        return '사장';
      case ProfileRole.MANAGER:
        return '매니저';
      case ProfileRole.MEMBER:
        return '멤버';
      default:
        return role;
    }
  };

  const handleAddUser = (profile: Profile) => {
    addUserMutation.mutate({
      profileId: profile.id,
      role: ProfileRole.MEMBER, // 백엔드에서 요구하는 대문자 값
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('정말로 이 유저를 제거하시겠습니까?')) {
      removeUserMutation.mutate(userId);
    }
  };

  const handleRoleChange = (profileId: string, newRole: string) => {
    updateRoleMutation.mutate({ profileId, role: newRole });
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    // 에러 상태 초기화
    addUserMutation.reset();
    removeUserMutation.reset();
    updateRoleMutation.reset();
  };

  const handleToggleEditing = () => {
    setIsEditing(!isEditing);
    // 편집 모드 종료 시 에러 상태 초기화
    if (isEditing) {
      addUserMutation.reset();
      removeUserMutation.reset();
      updateRoleMutation.reset();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>회사 유저 목록을 불러오는데 실패했습니다.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">회사 유저 관리</h3>
        <div className="flex gap-2">
          {!isSearching && (
            <button
              onClick={handleToggleEditing}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isEditing
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditing ? '편집 완료' : '유저 편집'}
            </button>
          )}
          {!isSearching && !isEditing && (
            <button
              onClick={() => setIsSearching(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              유저 추가
            </button>
          )}
        </div>
      </div>

      {isSearching ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-medium">유저 검색</h4>
            <button
              onClick={handleCancelSearch}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
          </div>
          <ProfileSearch
            onSelect={handleAddUser}
            placeholder="이름 또는 사용자명으로 검색..."
          />
        </div>
      ) : (
        <div>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{user.phone}</p>
                      {isEditing ? (
                        <select
                          value={user.role || ProfileRole.MEMBER}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                          disabled={updateRoleMutation.isPending || !isCurrentUserOwner}
                        >
                          <option value={ProfileRole.MEMBER}>멤버</option>
                          <option value={ProfileRole.MANAGER}>매니저</option>
                          <option value={ProfileRole.OWNER}>사장</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-500">{getRoleLabel(user.role || ProfileRole.MEMBER)}</p>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="삭제"
                        disabled={removeUserMutation.isPending}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>등록된 유저가 없습니다.</p>
              <p className="text-sm mt-1">유저 추가 버튼을 클릭하여 새 유저를 등록하세요.</p>
            </div>
          )}
        </div>
      )}

      {(addUserMutation.isError || removeUserMutation.isError || updateRoleMutation.isError) && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {addUserMutation.error?.message || removeUserMutation.error?.message || updateRoleMutation.error?.message}
        </div>
      )}
    </div>
  );
};

export default CompanyUserList; 