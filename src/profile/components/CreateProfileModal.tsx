import React, { useState, useEffect } from 'react';
import { Profile, ProfileType } from '../types';
import { profileService, ExternalProfileCreateRequest } from '../profile';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: Profile) => void;
  searchTerm?: string;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
  searchTerm = ''
}) => {
  const [formData, setFormData] = useState({
    username: searchTerm || '',
    name: searchTerm || '',
    type: ProfileType.FARMER as ProfileType,
    phone: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Update formData when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      setFormData(prev => ({
        ...prev,
        username: searchTerm,
        name: searchTerm,
      }));
    }
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('CreateProfileModal handleSubmit started');
    console.log('formData:', formData);
    
    if (!formData.username.trim()) {
      setError('Please enter a username.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter a name.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const profileData: ExternalProfileCreateRequest = {
        username: formData.username.trim(),
        name: formData.name.trim(),
        type: formData.type,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
      };

      console.log('API call profileData:', profileData);
      console.log('API endpoint: /profile/public');

      const newProfile = await profileService.createExternalProfile(profileData);
      
      console.log('API response success:', newProfile);
      
      onProfileCreated(newProfile);
      onClose();
    } catch (error: any) {
      console.error('Profile creation failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(error.message || 'Failed to create profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error message on input
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create New Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={ProfileType.FARMER}>Farmer</option>
              <option value={ProfileType.RETAILER}>Retailer</option>
              <option value={ProfileType.WHOLESALER}>Wholesaler</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileModal; 