import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import type { Farmer } from './farmer';

interface FarmerInfoProps {
  farmer: Farmer;
  onUpdate: (updatedFarmer: Farmer) => void;
}

const FarmerInfo = ({ farmer, onUpdate }: FarmerInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFarmer, setEditedFarmer] = useState<Farmer>(farmer);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedFarmer);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedFarmer(farmer);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFarmer(prev => ({
      ...prev,
      [name]: name === 'farm_size_m2' || name === 'annual_output_kg' || name === 'farm_members'
        ? value ? Number(value) : null
        : value
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8 sm:px-8 bg-yellow-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedFarmer.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-white bg-transparent border-b border-white/30 focus:border-white outline-none"
                />
              ) : (
                <h3 className="text-2xl font-bold text-white">
                  {farmer.name}
                </h3>
              )}
              <p className="mt-1 text-yellow-100">
                농가
              </p>
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

      <div className="px-6 py-8 sm:px-8">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Address</p>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editedFarmer.address || ''}
                onChange={handleChange}
                className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none"
              />
            ) : (
              <p className="text-gray-900">{farmer.address || 'No address provided'}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Farm Size (m²)</p>
            {isEditing ? (
              <input
                type="number"
                name="farm_size_m2"
                value={editedFarmer.farm_size_m2 || ''}
                onChange={handleChange}
                className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none"
              />
            ) : (
              <p className="text-gray-900">{farmer.farm_size_m2 ? `${farmer.farm_size_m2} m²` : 'Not specified'}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Annual Output (kg)</p>
            {isEditing ? (
              <input
                type="number"
                name="annual_output_kg"
                value={editedFarmer.annual_output_kg || ''}
                onChange={handleChange}
                className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none"
              />
            ) : (
              <p className="text-gray-900">{farmer.annual_output_kg ? `${farmer.annual_output_kg} kg` : 'Not specified'}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Farm Members</p>
            {isEditing ? (
              <input
                type="number"
                name="farm_members"
                value={editedFarmer.farm_members || ''}
                onChange={handleChange}
                className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none"
              />
            ) : (
              <p className="text-gray-900">{farmer.farm_members ? `${farmer.farm_members} members` : 'Not specified'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerInfo; 