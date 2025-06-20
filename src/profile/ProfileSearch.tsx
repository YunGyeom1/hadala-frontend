import React, { useState, useEffect } from 'react';
import { Profile, ProfileRole, ProfileType } from './types';
import { profileService, Profile as ProfileServiceProfile } from './profile';

interface ProfileSearchProps {
  onSelect?: (profile: Profile) => void;
  placeholder?: string;
  className?: string;
}

const ProfileSearch: React.FC<ProfileSearchProps> = ({ 
  onSelect,
  placeholder = "이름 또는 사용자명으로 검색...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const searchProfiles = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      console.log('검색 시작:', searchTerm);
      setIsLoading(true);
      try {
        // 실제 API 호출
        const profiles = await profileService.searchProfiles({
          username: searchTerm,
          limit: 10
        });
        console.log('API 응답:', profiles);
        
        // ProfileServiceProfile을 Profile로 변환
        const convertedProfiles: Profile[] = profiles.map((p: ProfileServiceProfile) => ({
          id: p.id,
          type: p.type === 'farmer' ? ProfileType.FARMER :
                p.type === 'retailer' ? ProfileType.RETAILER :
                p.type === 'wholesaler' ? ProfileType.WHOLESALER :
                ProfileType.WHOLESALER, // 기본값
          username: p.username,
          name: p.name,
          phone: p.phone,
          email: p.email,
          company_id: undefined,
          company_name: p.company_name,
          role: p.role === 'owner' ? ProfileRole.OWNER : 
                p.role === 'member' ? ProfileRole.MEMBER : 
                ProfileRole.MANAGER,
          created_at: p.created_at,
          updated_at: p.updated_at,
        }));
        console.log('변환된 프로필:', convertedProfiles);
        setSearchResults(convertedProfiles);
      } catch (error) {
        console.error('프로필 검색 실패:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setSearchTerm(profile.name || profile.username);
    setSearchResults([]);
    onSelect?.(profile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (selectedProfile) {
      setSelectedProfile(null);
    }
  };

  const handleInputClick = () => {
    if (selectedProfile) {
      setSearchTerm('');
      setSelectedProfile(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
          </div>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleSelect(profile)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{profile.name || '-'}</p>
                  <p className="text-sm text-gray-500">{profile.username}</p>
                </div>
                <p className="text-sm text-gray-500">{profile.company_name || '-'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSearch; 