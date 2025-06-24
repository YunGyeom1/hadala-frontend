import React, { useState, useEffect } from 'react';
import { WholesaleCompanyDetail } from '../../services/companyService';
import { companyService } from '../../services/companyService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface WholesaleCompanyDetailCardProps {
  companyId: string;
  onDetailUpdate?: (detail: WholesaleCompanyDetail) => void;
}

const WholesaleCompanyDetailCard: React.FC<WholesaleCompanyDetailCardProps> = ({
  companyId,
  onDetailUpdate
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<WholesaleCompanyDetail>>({});

  // 도매 회사 상세 정보 조회
  const { data: detail, error: detailError } = useQuery({
    queryKey: ['wholesaleCompanyDetail', companyId],
    queryFn: () => companyService.getWholesaleCompanyDetail(companyId),
    enabled: !!companyId,
  });

  useEffect(() => {
    if (detail) {
      setEditForm({
        address: detail.address || undefined,
        phone: detail.phone || undefined,
        email: detail.email || undefined,
        representative: detail.representative || undefined,
        business_registration_number: detail.business_registration_number || undefined,
        established_year: detail.established_year || undefined,
        description: detail.description || undefined,
        region: detail.region || undefined,
        monthly_transaction_volume: detail.monthly_transaction_volume || undefined,
        daily_transport_capacity: detail.daily_transport_capacity || undefined,
        main_products: detail.main_products || undefined,
        has_cold_storage: detail.has_cold_storage || false,
        number_of_vehicles: detail.number_of_vehicles || undefined
      });
    }
  }, [detail]);

  const updateDetailMutation = useMutation({
    mutationFn: (data: Partial<WholesaleCompanyDetail>) => 
      companyService.upsertWholesaleCompanyDetail({ ...data, company_id: companyId }),
    onSuccess: (updatedDetail) => {
      queryClient.invalidateQueries({ queryKey: ['wholesaleCompanyDetail', companyId] });
      setIsEditing(false);
      if (onDetailUpdate) {
        onDetailUpdate(updatedDetail);
      }
    },
    onError: (error) => {
      console.error('상세 정보 수정 실패:', error);
    }
  });

  const handleSave = () => {
    updateDetailMutation.mutate(editForm);
  };

  const handleCancel = () => {
    if (detail) {
      setEditForm({
        address: detail.address || undefined,
        phone: detail.phone || undefined,
        email: detail.email || undefined,
        representative: detail.representative || undefined,
        business_registration_number: detail.business_registration_number || undefined,
        established_year: detail.established_year || undefined,
        description: detail.description || undefined,
        region: detail.region || undefined,
        monthly_transaction_volume: detail.monthly_transaction_volume || undefined,
        daily_transport_capacity: detail.daily_transport_capacity || undefined,
        main_products: detail.main_products || undefined,
        has_cold_storage: detail.has_cold_storage || false,
        number_of_vehicles: detail.number_of_vehicles || undefined
      });
    }
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof WholesaleCompanyDetail, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (detailError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">도매 회사 상세 정보</h3>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          상세 정보 로드 실패: {detailError.message}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">도매 회사 상세 정보</h3>
        </div>
        <p className="text-gray-500">상세 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">도매 회사 상세 정보</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            수정
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={updateDetailMutation.isPending}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={updateDetailMutation.isPending}
            >
              {updateDetailMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.business_registration_number || ''}
              onChange={(e) => handleFieldChange('business_registration_number', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.business_registration_number || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">주소</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.address || ''}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.address || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">전화번호</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.phone || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          {isEditing ? (
            <input
              type="email"
              value={editForm.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.email || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">대표자</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.representative || ''}
              onChange={(e) => handleFieldChange('representative', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.representative || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">설립년도</label>
          {isEditing ? (
            <input
              type="number"
              value={editForm.established_year || ''}
              onChange={(e) => handleFieldChange('established_year', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.established_year || '-'}</p>
          )}
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">설명</label>
          {isEditing ? (
            <textarea
              value={editForm.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.description || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">지역</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.region || ''}
              onChange={(e) => handleFieldChange('region', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.region || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">월 거래량 (톤)</label>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              value={editForm.monthly_transaction_volume || ''}
              onChange={(e) => handleFieldChange('monthly_transaction_volume', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.monthly_transaction_volume || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">일일 운송 능력 (톤)</label>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              value={editForm.daily_transport_capacity || ''}
              onChange={(e) => handleFieldChange('daily_transport_capacity', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.daily_transport_capacity || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">주요 상품</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.main_products || ''}
              onChange={(e) => handleFieldChange('main_products', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.main_products || '-'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">냉장고 보유</label>
          {isEditing ? (
            <input
              type="checkbox"
              checked={editForm.has_cold_storage || false}
              onChange={(e) => handleFieldChange('has_cold_storage', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.has_cold_storage ? '예' : '아니오'}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">차량 수</label>
          {isEditing ? (
            <input
              type="number"
              value={editForm.number_of_vehicles || ''}
              onChange={(e) => handleFieldChange('number_of_vehicles', parseInt(e.target.value) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{detail.number_of_vehicles || '-'}</p>
          )}
        </div>
      </div>
      
      {updateDetailMutation.isError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          상세 정보 수정 실패: {updateDetailMutation.error?.message}
        </div>
      )}
    </div>
  );
};

export default WholesaleCompanyDetailCard; 