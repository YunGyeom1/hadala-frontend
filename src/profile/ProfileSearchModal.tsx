import React, { useState, useEffect } from 'react';
import { Profile, ProfileRole, ProfileType } from './types';
import { profileService, Profile as ProfileServiceProfile } from './profile';

interface ProfileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (profile: Profile) => void;
  title?: string;
}

const ProfileSearchModal: React.FC<ProfileSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = '프로필 검색'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchProfiles = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // 실제 API 호출
        const profiles = await profileService.searchProfiles({
          username: searchTerm,
          limit: 10
        });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름 또는 사용자명으로 검색..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => {
                    onSelect(profile);
                    onClose();
                  }}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
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
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center text-gray-500 py-4">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              검색어를 입력해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSearchModal; 