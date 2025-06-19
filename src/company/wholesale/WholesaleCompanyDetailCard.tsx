import React from 'react';
import { WholesaleCompanyDetail } from './types';

interface WholesaleCompanyDetailCardProps {
  detail: WholesaleCompanyDetail;
  onUpdate?: (detail: WholesaleCompanyDetail) => void;
}

const WholesaleCompanyDetailCard: React.FC<WholesaleCompanyDetailCardProps> = ({ detail, onUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">도매회사 상세 정보</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">주소</label>
            <p className="mt-1 text-sm text-gray-900">{detail.address || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">지역</label>
            <p className="mt-1 text-sm text-gray-900">{detail.region || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">연락처</label>
            <p className="mt-1 text-sm text-gray-900">{detail.phone || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <p className="mt-1 text-sm text-gray-900">{detail.email || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">대표자</label>
            <p className="mt-1 text-sm text-gray-900">{detail.representative || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
            <p className="mt-1 text-sm text-gray-900">{detail.business_registration_number || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">설립년도</label>
            <p className="mt-1 text-sm text-gray-900">{detail.established_year || '-'}</p>
          </div>
        </div>

        {/* 도매회사 특화 정보 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">월 거래량</label>
            <p className="mt-1 text-sm text-gray-900">
              {detail.monthly_transaction_volume ? `${detail.monthly_transaction_volume.toLocaleString()} 톤` : '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">일 운송가능량</label>
            <p className="mt-1 text-sm text-gray-900">
              {detail.daily_transport_capacity ? `${detail.daily_transport_capacity.toLocaleString()} 톤` : '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">주요 상품</label>
            <p className="mt-1 text-sm text-gray-900">
              {detail.main_products ? detail.main_products.split(',').join(', ') : '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">냉장 시설</label>
            <p className="mt-1 text-sm text-gray-900">
              {detail.has_cold_storage ? '보유' : '미보유'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">보유 차량 수</label>
            <p className="mt-1 text-sm text-gray-900">
              {detail.number_of_vehicles ? `${detail.number_of_vehicles}대` : '-'}
            </p>
          </div>
        </div>
      </div>

      {onUpdate && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onUpdate(detail)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            정보 수정
          </button>
        </div>
      )}
    </div>
  );
};

export default WholesaleCompanyDetailCard; 