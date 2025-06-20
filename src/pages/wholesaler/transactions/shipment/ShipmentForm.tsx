import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import ProfileSearch from '@/profile/ProfileSearch';
import CompanySearch from '@/company/company/CompanySearch';
import CenterSearch from '@/company/center/CenterSearch';
interface ShipmentFormData {
  title: string;
  shipment_datetime: string;
  delivery_datetime: string;
  supplier_person_id?: string;
  receiver_person_id?: string;
  supplier_company_id: string;
  receiver_company_id: string;
  departure_center_id: string;
  arrival_center_id: string;
  notes: string;
  items: {
    product_id: string;
    quality: string;
    quantity: number;
  }[];
}

const ShipmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<ShipmentFormData>({
    title: '',
    shipment_datetime: format(new Date(), 'yyyy-MM-dd'),
    delivery_datetime: format(new Date(), 'yyyy-MM-dd'),
    supplier_company_id: '',
    receiver_company_id: '',
    departure_center_id: '',
    arrival_center_id: '',
    notes: '',
    items: [
      {
        product_id: '',
        quality: '',
        quantity: 0,
      },
    ],
  });

  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
  const [selectedSupplierCompany, setSelectedSupplierCompany] = useState<any>(null);
  const [selectedReceiverCompany, setSelectedReceiverCompany] = useState<any>(null);
  const [selectedDepartureCenter, setSelectedDepartureCenter] = useState<any>(null);
  const [selectedArrivalCenter, setSelectedArrivalCenter] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log('Submit:', formData);
    navigate('/wholesaler/transactions/shipments');
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product_id: '',
          quality: '',
          quantity: 0,
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? '출하 수정' : '출하 생성'}</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/shipments')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
        {/* 출하 기본 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">출하 기본 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">출하 제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">출하일</label>
              <input
                type="date"
                value={formData.shipment_datetime}
                onChange={(e) => setFormData({ ...formData, shipment_datetime: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">납기일</label>
              <input
                type="date"
                value={formData.delivery_datetime}
                onChange={(e) => setFormData({ ...formData, delivery_datetime: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
        </div>

        {/* 출하 당사자 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">출하 당사자</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">공급자(유저)</label>
              <ProfileSearch
                onSelect={(profile) => {
                  setSelectedSupplier(profile);
                  setFormData({ ...formData, supplier_person_id: profile.id });
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">수신자(유저)</label>
              <ProfileSearch
                onSelect={(profile) => {
                  setSelectedReceiver(profile);
                  setFormData({ ...formData, receiver_person_id: profile.id });
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">공급 회사</label>
              <CompanySearch
                onSelect={(company) => {
                  setSelectedSupplierCompany(company);
                  setFormData({ ...formData, supplier_company_id: company.id });
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">수신 회사</label>
              <CompanySearch
                onSelect={(company) => {
                  setSelectedReceiverCompany(company);
                  setFormData({ ...formData, receiver_company_id: company.id });
                }}
              />
            </div>
          </div>
        </div>

        {/* 센터 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">센터 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">출발 센터</label>
              <CenterSearch
                onSelect={(center) => {
                  setSelectedDepartureCenter(center);
                  setFormData({ ...formData, departure_center_id: center.id });
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">도착 센터</label>
              <CenterSearch
                onSelect={(center) => {
                  setSelectedArrivalCenter(center);
                  setFormData({ ...formData, arrival_center_id: center.id });
                }}
              />
            </div>
          </div>
        </div>

        {/* 출하 품목 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">출하 품목</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              품목 추가
            </button>
          </div>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">품목</label>
                  <input
                    type="text"
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">등급</label>
                  <input
                    type="text"
                    value={item.quality}
                    onChange={(e) => handleItemChange(index, 'quality', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">수량</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 비고 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">비고</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEdit ? '수정' : '생성'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentForm; 