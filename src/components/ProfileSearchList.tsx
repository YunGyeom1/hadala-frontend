import React from 'react';
import { Profile } from '@/profile/types';
import SearchList from '@/shared/components/SearchList';

interface ProfileSearchListProps {
  profiles: Profile[];
  onSelect: (profile: Profile) => void;
  onCancel: () => void;
}

const ProfileSearchList: React.FC<ProfileSearchListProps> = ({
  profiles,
  onSelect,
  onCancel,
}) => {
  return (
    <SearchList
      items={profiles}
      onSelect={onSelect}
      onCancel={onCancel}
      searchFields={(profile) => [
        profile.name || '',
        profile.username,
        profile.company_name || '',
        profile.type
      ]}
      renderItem={(profile) => (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{profile.name || '-'}</p>
            <p className="text-sm text-gray-500">{profile.username}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{profile.company_name || '-'}</p>
            <p className="text-sm text-gray-500">{profile.type}</p>
          </div>
        </div>
      )}
      placeholder="이름 또는 사용자명으로 검색..."
    />
  );
};

export default ProfileSearchList; 