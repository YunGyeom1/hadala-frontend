import React, { useState } from 'react';
import { mockCompanyUsers } from './mockData';
import { Profile } from '@/profile/types';
import { mockProfiles } from '@/profile/mockData';
import ProfileSearchList from '@/profile/ProfileSearchList';

interface CompanyUser {
  id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE';
}

interface CompanyUserListProps {
  companyId: string;
}

const CompanyUserList: React.FC<CompanyUserListProps> = ({ companyId }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // TODO: API 연동 시 실제 API 호출로 변경
  const [users, setUsers] = useState<CompanyUser[]>(
    mockCompanyUsers.filter(user => user.company_id === companyId) as CompanyUser[]
  );

  const getRoleLabel = (role: CompanyUser['role']) => {
    switch (role) {
      case 'OWNER':
        return '사장';
      case 'MANAGER':
        return '매니저';
      case 'STAFF':
        return '직원';
      default:
        return role;
    }
  };

  const handleAddUser = (profile: Profile) => {
    // TODO: API 연동 시 실제 API 호출로 변경
    console.log('Add user:', profile);
    setIsSearching(false);
  };

  const handleDeleteUser = (userId: string) => {
    // TODO: API 연동 시 실제 API 호출로 변경
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="bg-white rounded-lg shadow h-[600px]">
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-medium">회사 유저 목록</h4>
          <div className="flex gap-2">
            {!isSearching && (
              <button
                onClick={() => setIsEditing(!isEditing)}
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
          <ProfileSearchList
            profiles={mockProfiles}
            onSelect={handleAddUser}
            onCancel={() => setIsSearching(false)}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
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
                        <p className="text-sm text-gray-500">{getRoleLabel(user.role)}</p>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="삭제"
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
              <div className="text-center text-gray-500 py-4">
                등록된 유저가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyUserList; 