import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import type { Retailer } from './retailer';

interface RetailerInfoProps {
  retailer: Retailer;
  onUpdate: (updatedRetailer: Retailer) => void;
}

const RetailerInfo = ({ retailer, onUpdate }: RetailerInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRetailer, setEditedRetailer] = useState<Retailer>(retailer);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedRetailer);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRetailer(retailer);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRetailer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8 sm:px-8 bg-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <span className="text-2xl">🏪</span>
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedRetailer.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-white bg-transparent border-b border-white/30 focus:border-white outline-none"
                />
              ) : (
                <h3 className="text-2xl font-bold text-white">
                  {retailer.name}
                </h3>
              )}
              <p className="mt-1 text-indigo-100">
                소매업체
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
                value={editedRetailer.address || ''}
                onChange={handleChange}
                className="w-full text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
              />
            ) : (
              <p className="text-gray-900">{retailer.address || 'No address provided'}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>
            {isEditing ? (
              <textarea
                name="description"
                value={editedRetailer.description || ''}
                onChange={handleChange}
                className="w-full text-gray-900 bg-transparent border border-gray-300 rounded-lg focus:border-indigo-500 outline-none p-2"
                rows={3}
              />
            ) : (
              <p className="text-gray-900">{retailer.description || 'No description provided'}</p>
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
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
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

export default RetailerInfo; 