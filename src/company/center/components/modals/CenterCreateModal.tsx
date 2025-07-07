import React from 'react';
import { useCenters } from '../../hooks/useCenters';
import { useCenterForm } from '../../hooks/useCenterForm';
import { CenterFormFields } from '../forms/CenterFormFields';
import { CenterCreateRequest } from '../../types';

interface CenterCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: string;
}

const CenterCreateModal: React.FC<CenterCreateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  companyId 
}) => {
  const { createCenter, loading, error } = useCenters(companyId);
  const { formData, errors, handleChange, handleBlur, validateForm, resetForm } = useCenterForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const centerData: CenterCreateRequest = {
        name: formData.name,
        address: formData.address || undefined,
        region: formData.region || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        phone: formData.phone || undefined,
        operating_start: formData.operating_start || undefined,
        operating_end: formData.operating_end || undefined,
        is_operational: formData.is_operational,
      };

      await createCenter(centerData);
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      // Error is handled in useCenters hook
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Center</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CenterFormFields
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
          />

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CenterCreateModal; 