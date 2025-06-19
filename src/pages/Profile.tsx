import React, { useState } from 'react';
import { mockProfiles } from '../profile/mockData';
import ProfileCard from '../profile/ProfileCard';
import type { Profile, ProfileCreateRequest } from '../profile/types';
import { ProfileType, ProfileRole } from '../profile/types';

const Profile = () => {
  const [profiles, setProfiles] = useState<Record<ProfileType, Profile>>({} as Record<ProfileType, Profile>);

  const handleUpdateProfile = (updatedProfile: Profile) => {
    setProfiles(prev => ({
      ...prev,
      [updatedProfile.type]: updatedProfile
    }));
  };

  const handleCreateProfile = (newProfile: ProfileCreateRequest) => {
    // 실제 API 연동 시에는 여기서 API 호출
    const createdProfile: Profile = {
      ...newProfile,
      id: `profile_${Date.now()}`, // 임시 ID 생성
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: ProfileRole.NONE // 소속 없는 상태로 설정
    };
    
    setProfiles(prev => ({
      ...prev,
      [createdProfile.type]: createdProfile
    }));
  };

  const getProfileTypeName = (type: ProfileType): string => {
    switch (type) {
      case ProfileType.FARMER:
        return '농가';
      case ProfileType.RETAILER:
        return '소매상';
      case ProfileType.WHOLESALER:
        return '도매상';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">프로필 관리</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileCard
          type={ProfileType.FARMER}
          profile={profiles[ProfileType.FARMER]}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={Object.values(profiles)}
        />
        <ProfileCard
          type={ProfileType.RETAILER}
          profile={profiles[ProfileType.RETAILER]}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={Object.values(profiles)}
        />
        <ProfileCard
          type={ProfileType.WHOLESALER}
          profile={profiles[ProfileType.WHOLESALER]}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={Object.values(profiles)}
        />
      </div>
    </div>
  );
};

export default Profile;
