import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import type { UserProfile } from './user';

interface ProfileInfoProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

const ProfileInfo = ({ user, onUpdate }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Profile Header */}
      <div className="px-6 py-8 sm:px-8 bg-blue-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm overflow-hidden">
              {user.picture_url ? (
                <img 
                  src={user.picture_url} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-white bg-transparent border-b border-white/30 focus:border-white outline-none"
                />
              ) : (
                <h3 className="text-2xl font-bold text-white">
                  {user.name}
                </h3>
              )}
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  className="mt-1 text-indigo-100 bg-transparent border-b border-white/30 focus:border-white outline-none"
                />
              ) : (
                <p className="mt-1 text-indigo-100">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            {isEditing ? (
              <span className="text-sm font-medium">Save</span>
            ) : (
              <FiEdit2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Personal Information */}
          <div className="p-6 rounded-xl bg-gray-50">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Personal Information
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="p-6 rounded-xl bg-gray-50">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Profile Settings
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  Profile Picture
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="picture_url"
                    value={editedUser.picture_url || ''}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.picture_url ? 'Custom Avatar' : 'Default Avatar'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo; 