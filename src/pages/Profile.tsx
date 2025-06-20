import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProfileCard from '@/profile/ProfileCard';
import { profileService, type Profile, type ProfileCreateRequest } from '@/profile/profile';

const Profile = () => {
  const queryClient = useQueryClient();

  // 내 프로필 목록 조회
  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['myProfiles'],
    queryFn: profileService.getMyProfiles,
  });

  // 프로필 생성 뮤테이션
  const createProfileMutation = useMutation({
    mutationFn: (newProfile: ProfileCreateRequest) => profileService.createProfile(newProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfiles'] });
    },
  });

  // 프로필 수정 뮤테이션
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileService.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfiles'] });
    },
  });

  const handleUpdateProfile = (updatedProfile: Profile) => {
    updateProfileMutation.mutate({
      id: updatedProfile.id,
      data: {
        username: updatedProfile.username,
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        email: updatedProfile.email,
      },
    });
  };

  const handleCreateProfile = (newProfile: ProfileCreateRequest) => {
    createProfileMutation.mutate(newProfile);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          프로필을 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // 프로필 타입별로 그룹화
  const profilesByType = {
    farmer: profiles.find(p => p.type === 'farmer'),
    retailer: profiles.find(p => p.type === 'retailer'),
    wholesaler: profiles.find(p => p.type === 'wholesaler'),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">프로필 관리</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileCard
          type="farmer"
          profile={profilesByType.farmer}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={profiles}
          isLoading={createProfileMutation.isPending}
        />
        <ProfileCard
          type="wholesaler"
          profile={profilesByType.wholesaler}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={profiles}
          isLoading={createProfileMutation.isPending}
        />
        <ProfileCard
          type="retailer"
          profile={profilesByType.retailer}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={profiles}
          isLoading={createProfileMutation.isPending}
        />
      </div>
    </div>
  );
};

export default Profile;
