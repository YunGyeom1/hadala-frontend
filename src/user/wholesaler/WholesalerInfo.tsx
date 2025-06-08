import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import type { Wholesaler } from './wholesaler';

interface WholesalerInfoProps {
  wholesaler: Wholesaler;
  onUpdate: (updatedWholesaler: Wholesaler) => void;
}

const WholesalerInfo = ({ wholesaler, onUpdate }: WholesalerInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWholesaler, setEditedWholesaler] = useState<Wholesaler>(wholesaler);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedWholesaler);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedWholesaler(wholesaler);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedWholesaler(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8 sm:px-8 bg-green-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <span className="text-2xl">🏢</span>
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedWholesaler.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-white bg-transparent border-b border-white/30 focus:border-white outline-none"
                />
              ) : (
                <h3 className="text-2xl font-bold text-white">
                  {wholesaler.name}
                </h3>
              )}
              <p className="mt-1 text-green-100">
                도매업체
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
                value={editedWholesaler.address || ''}
                onChange={handleChange}
                className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-green-500 outline-none"
              />
            ) : (
              <p className="text-gray-900">{wholesaler.address || 'No address provided'}</p>
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
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
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

export default WholesalerInfo; 