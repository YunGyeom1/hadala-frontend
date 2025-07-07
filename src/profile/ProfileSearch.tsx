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
  placeholder = "Search by name or username...",
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

      console.log('Search started:', searchTerm);
      setIsLoading(true);
      try {
        // Actual API call
        const profiles = await profileService.searchProfiles({
          username: searchTerm,
          limit: 10
        });
        console.log('API response:', profiles);
        console.log('Search result count:', profiles.length);
        console.log('Search result details:', JSON.stringify(profiles, null, 2));
        setSearchResults(profiles);
      } catch (error) {
        console.error('Profile search failed:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Hide search results when clicking elsewhere
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
    console.log('ProfileSearch handleSelect called:', profile);
    setSearchTerm(''); // Clear search input
    setSearchResults([]);
    console.log('Before onSelect call');
    onSelect?.(profile);
    console.log('After onSelect call');
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
    // Do nothing on click
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
            
            {/* Create new profile option */}
            <div
              onClick={handleCreateNew}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-t border-gray-200 bg-blue-25"
            >
              <div className="flex items-center text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">Create new profile "{searchTerm}"</span>
              </div>
            </div>
          </div>
        )}

        {/* Create new profile option when no search results */}
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
                <span className="font-medium">Create new profile "{searchTerm}"</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">No search results found. Create a new profile.</p>
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