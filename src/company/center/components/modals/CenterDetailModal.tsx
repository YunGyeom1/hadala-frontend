import React, { useEffect } from 'react';
import { useCenter } from '../../hooks/useCenter';
import { useCenterForm } from '../../hooks/useCenterForm';
import { CenterFormFields } from '../forms/CenterFormFields';
import { Center, CenterUpdateRequest } from '../../types';

interface CenterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  center: Center | null;
  onSuccess: () => void;
}

const CenterDetailModal: React.FC<CenterDetailModalProps> = ({
  isOpen,
  onClose,
  center,
  onSuccess,
}) => {
  const { updateCenter, loading, error } = useCenter(center?.id);
  const { formData, errors, handleChange, handleBlur, validateForm, resetForm, setFormDataFromCenter } = useCenterForm();

  useEffect(() => {
    if (center) {
      setFormDataFromCenter(center);
    }
  }, [center, setFormDataFromCenter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!center?.id) return;

    if (!validateForm()) {
      return;
    }

    try {
      const updateData: CenterUpdateRequest = {
        name: formData.name || undefined,
        address: formData.address || undefined,
        region: formData.region || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        phone: formData.phone || undefined,
        operating_start: formData.operating_start || undefined,
        operating_end: formData.operating_end || undefined,
        is_operational: formData.is_operational,
      };

      await updateCenter(updateData);
      onSuccess();
      onClose();
    } catch (err) {
      // 에러는 useCenter 훅에서 처리됨
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !center) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">센터 정보 수정</h2>
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
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CenterDetailModal; 