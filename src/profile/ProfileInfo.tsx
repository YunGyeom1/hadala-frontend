import React from 'react';
import { Profile, ProfileType } from './types';

interface ProfileInfoProps {
  profile: Profile;
  onUpdate?: (profile: Profile) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, onUpdate }) => {
  const getProfileTypeLabel = (type: ProfileType) => {
    switch (type) {
      case ProfileType.FARMER:
        return '농부';
      case ProfileType.RETAILER:
        return '소매상';
      case ProfileType.WHOLESALER:
        return '도매상';
      case ProfileType.TESTER:
        return '테스터';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">프로필 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">사용자명</p>
              <p className="font-medium">{profile.username}</p>
            </div>
            <div>
              <p className="text-gray-600">계정 유형</p>
              <p className="font-medium">{getProfileTypeLabel(profile.type)}</p>
            </div>
            <div>
              <p className="text-gray-600">생성일</p>
              <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">마지막 수정일</p>
              <p className="font-medium">{new Date(profile.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo; 