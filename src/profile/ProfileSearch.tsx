import React, { useState, useEffect, useRef } from 'react';
import { Profile } from './types';
import { profileService } from './profile';
import CreateProfileModal from './components/CreateProfileModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        console.log('검색 결과 개수:', profiles.length);
        console.log('검색 결과 상세:', JSON.stringify(profiles, null, 2));
        setSearchResults(profiles);
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

  // 다른 곳 클릭 시 검색 결과 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (profile: Profile) => {
    console.log('ProfileSearch handleSelect 호출됨:', profile);
    setSearchTerm(''); // 검색창 초기화
    setSearchResults([]);
    console.log('onSelect 호출 전');
    onSelect?.(profile);
    console.log('onSelect 호출 후');
  };

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleProfileCreated = (newProfile: Profile) => {
    handleSelect(newProfile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputClick = () => {
    // 클릭 시 아무것도 안 함
  };

  return (
    <>
      <div className={`relative ${className}`} ref={containerRef}>
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
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
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
            
            {/* 새 프로필 생성 옵션 */}
            <div
              onClick={handleCreateNew}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-t border-gray-200 bg-blue-25"
            >
              <div className="flex items-center text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">"{searchTerm}" 새 프로필 생성</span>
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과가 없을 때 새 프로필 생성 옵션 */}
        {searchTerm.trim() && searchResults.length === 0 && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div
              onClick={handleCreateNew}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
            >
              <div className="flex items-center text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">"{searchTerm}" 새 프로필 생성</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">검색 결과가 없습니다. 새 프로필을 생성하세요.</p>
            </div>
          </div>
        )}
      </div>

      <CreateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProfileCreated={handleProfileCreated}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default ProfileSearch;