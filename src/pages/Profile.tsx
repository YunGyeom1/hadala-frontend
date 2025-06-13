import React, { useState } from 'react';
import { mockProfiles } from '../profile/mockData';
import ProfileInfo from '../profile/ProfileInfo';
import type { Profile } from '../profile/types';
import { ProfileType } from '../profile/types';

const Profile = () => {
  const [profiles, setProfiles] = useState<Record<ProfileType, Profile>>(mockProfiles);

  const handleUpdateProfile = (updatedProfile: Profile) => {
    setProfiles(prev => ({
      ...prev,
      [updatedProfile.type]: updatedProfile
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <ProfileInfo 
                profile={profiles[ProfileType.FARMER]} 
                onUpdate={handleUpdateProfile} 
              />
            </div>
          </div>
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <ProfileInfo 
                profile={profiles[ProfileType.RETAILER]} 
                onUpdate={handleUpdateProfile} 
              />
            </div>
          </div>
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <ProfileInfo 
                profile={profiles[ProfileType.WHOLESALER]} 
                onUpdate={handleUpdateProfile} 
              />
            </div>
          </div>
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <ProfileInfo 
                profile={profiles[ProfileType.TESTER]} 
                onUpdate={handleUpdateProfile} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
