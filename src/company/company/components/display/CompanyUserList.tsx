import React, { useState, useEffect } from 'react';
import { companyUserService } from '../../services/companyUserService';
import { Profile } from '@/profile/types';

interface CompanyUserListProps {
  companyId: string;
  onUserSelect?: (user: Profile | null) => void;
  selectedUserId?: string;
}

const CompanyUserList: React.FC<CompanyUserListProps> = ({
  companyId,
  onUserSelect,
  selectedUserId
}) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        활성
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        비활성
      </span>
    );
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
        <h3 className="text-lg font-medium text-gray-900">회사 사용자 목록</h3>
        <p className="text-sm text-gray-500 mt-1">총 {users.length}명의 사용자</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              if (selectedUserId === user.id) {
                // 이미 선택된 사용자를 다시 클릭하면 선택 해제
                onUserSelect?.(null);
              } else {
                // 새로운 사용자 선택
                onUserSelect?.(user);
              }
            }}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedUserId === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyUserList; 