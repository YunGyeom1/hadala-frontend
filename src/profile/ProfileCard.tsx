import React, { useState } from 'react';
import { Profile, ProfileType } from './types';
import { ProfileCreateRequest } from './profile';

interface ProfileCardProps {
  profile?: Profile;
  type: ProfileType;
  onUpdate?: (profile: Profile) => void;
  onCreate?: (profile: ProfileCreateRequest) => void;
  existingProfiles?: Profile[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  type, 
  onUpdate, 
  onCreate, 
  existingProfiles = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | ProfileCreateRequest>(
    profile || {
      type,
      username: '',
      name: '',
      phone: '',
      email: '',
    }
  );

  const [errors, setErrors] = useState<{
    username?: string;
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  const validateUsername = (username: string): boolean => {
    if (!username) {
      setErrors(prev => ({ ...prev, username: 'Username is required.' }));
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setErrors(prev => ({ ...prev, username: 'Only letters and numbers are allowed.' }));
      return false;
    }
    if (existingProfiles.some(p => p.username === username && (!profile || p.id !== profile.id))) {
      setErrors(prev => ({ ...prev, username: 'Username is already in use.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, username: undefined }));
    return true;
  };

  const validateName = (name: string): boolean => {
    if (!name) return true; // Optional
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setErrors(prev => ({ ...prev, name: 'Only letters are allowed.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional
    if (!/^\d+$/.test(phone)) {
      setErrors(prev => ({ ...prev, phone: 'Only numbers are allowed.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: undefined }));
    return true;
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  };

  const validateForm = (): boolean => {
    const isUsernameValid = validateUsername(editedProfile.username);
    const isNameValid = validateName(editedProfile.name || '');
    const isPhoneValid = validatePhone(editedProfile.phone || '');
    const isEmailValid = validateEmail(editedProfile.email || '');
    return isUsernameValid && isNameValid && isPhoneValid && isEmailValid;
  };

  const getProfileTypeLabel = (type: ProfileType) => {
    switch (type) {
      case ProfileType.FARMER:
        return 'Farmer';
      case ProfileType.RETAILER:
        return 'Retailer';
      case ProfileType.WHOLESALER:
        return 'Wholesaler';
      default:
        return 'Unknown';
    }
  };

  const getHeaderColor = (type: ProfileType) => {
    switch (type) {
      case ProfileType.FARMER:
        return 'bg-green-600';
      case ProfileType.RETAILER:
        return 'bg-purple-600';
      case ProfileType.WHOLESALER:
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };



  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (profile && onUpdate) {
      onUpdate(editedProfile as Profile);
    } else if (onCreate) {
      onCreate(editedProfile as ProfileCreateRequest);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile(profile);
    } else {
      setEditedProfile({
        type,
        username: '',
        name: '',
        phone: '',
        email: '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const renderHeader = () => (
    <div className={`${getHeaderColor(type)} px-6 py-4 rounded-t-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          <p className="text-white/80 mt-1">{getProfileTypeLabel(type)}</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
          >
            {profile ? 'Edit' : 'Create'}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Username <span className="text-red-500">*</span></p>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedProfile.username}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, username: e.target.value});
                    validateUsername(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.username || '-'}</p>
            )}
          </div>
          <div>
            <p className="text-gray-600">Name</p>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedProfile.name || ''}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, name: e.target.value});
                    validateName(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.name || '-'}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Phone Number</p>
            {isEditing ? (
              <div>
                <input
                  type="tel"
                  value={editedProfile.phone || ''}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, phone: e.target.value});
                    validatePhone(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.phone || '-'}</p>
            )}
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            {isEditing ? (
              <div>
                <input
                  type="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, email: e.target.value});
                    validateEmail(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.email || '-'}</p>
            )}
          </div>
        </div>
        
        {/* Company selection section */}
        <div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Company Name</p>
              <p className="font-medium">{profile?.company_name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Role</p>
              <p className="font-medium">{profile?.role || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default ProfileCard;