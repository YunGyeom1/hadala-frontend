import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Profile, ProfileType } from './types';
import { profileService } from './profile';

interface ProfileContextType {
  currentProfile: Profile | null;
  allProfiles: Profile[];
  setCurrentProfile: (profile: Profile) => void;
  refreshProfiles: () => Promise<void>;
  isLoading: boolean;
  getProfileByType: (type: string) => Profile | null;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  const getProfileByType = useCallback((type: string): Profile | null => {
    return allProfiles.find(p => p.type === type) || null;
  }, [allProfiles]);

  // 프로필 데이터만 가져오기 (경로와 무관)
  const refreshProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const profiles = await profileService.getMyProfiles();
      console.log('프로필 로드 완료:', profiles);
      setAllProfiles(profiles);
    } catch (error) {
      console.error('프로필 정보를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  const handleSetCurrentProfile = useCallback((profile: Profile) => {
    console.log('프로필 변경:', profile);
    setCurrentProfile(profile);
    localStorage.setItem('profile_id', profile.id);
  }, []);

  // 초기 로드 시에만 프로필 가져오기
  useEffect(() => {
    if (!isInitialized) {
      refreshProfiles();
    }
  }, [isInitialized, refreshProfiles]);

  // 경로 변경 시 메모리에서 프로필 선택 (API 호출 없음)
  useEffect(() => {
    if (isInitialized && allProfiles.length > 0) {
      console.log('경로 변경 감지:', location.pathname);
      console.log('현재 프로필:', currentProfile);
      console.log('사용 가능한 프로필:', allProfiles);
      
      let targetProfile: Profile | null = null;
      
      if (location.pathname.startsWith('/farmer/')) {
        targetProfile = allProfiles.find(p => p.type === ProfileType.FARMER) || null;
      } else if (location.pathname.startsWith('/wholesaler/')) {
        targetProfile = allProfiles.find(p => p.type === ProfileType.WHOLESALER) || null;
      } else if (location.pathname.startsWith('/retailer/')) {
        targetProfile = allProfiles.find(p => p.type === ProfileType.RETAILER) || null;
      }
      
      console.log('선택된 타겟 프로필:', targetProfile);
      
      if (targetProfile && targetProfile.id !== currentProfile?.id) {
        console.log('프로필 변경 실행:', targetProfile);
        setCurrentProfile(targetProfile);
        localStorage.setItem('profile_id', targetProfile.id);
      }
    }
  }, [location.pathname, isInitialized, allProfiles, currentProfile?.id]);

  const value: ProfileContextType = {
    currentProfile,
    allProfiles,
    setCurrentProfile: handleSetCurrentProfile,
    refreshProfiles,
    isLoading,
    getProfileByType,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}; 