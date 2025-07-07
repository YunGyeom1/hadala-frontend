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

  // Get profile data only (independent of route)
  const refreshProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const profiles = await profileService.getMyProfiles();
      console.log('Profile loading completed:', profiles);
      setAllProfiles(profiles);
    } catch (error) {
      console.error('Failed to get profile information:', error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  const handleSetCurrentProfile = useCallback((profile: Profile) => {
    console.log('Profile changed:', profile);
    setCurrentProfile(profile);
    localStorage.setItem('profile_id', profile.id);
  }, []);

  // Get profiles only on initial load
  useEffect(() => {
    if (!isInitialized) {
      refreshProfiles();
    }
  }, [isInitialized, refreshProfiles]);

  // Select profile from memory on route change (no API call)
  useEffect(() => {
    if (isInitialized && allProfiles.length > 0) {
      console.log('Route change detected:', location.pathname);
      console.log('Current profile:', currentProfile);
      console.log('Available profiles:', allProfiles);
      
      let targetProfile: Profile | null = null;
      
      if (location.pathname.startsWith('/farmer/')) {
        targetProfile = allProfiles.find(p => p.type === ProfileType.FARMER) || null;
      } else if (location.pathname.startsWith('/wholesaler/')) {
        targetProfile = allProfiles.find(p => p.type === ProfileType.WHOLESALER) || null;
      } else if (location.pathname.startsWith('/retailer/')) {
        targetProfile = allProfiles.find(p => p.type === ProfileType.RETAILER) || null;
      }
      
      console.log('Selected target profile:', targetProfile);
      
      if (targetProfile && targetProfile.id !== currentProfile?.id) {
        console.log('Executing profile change:', targetProfile);
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