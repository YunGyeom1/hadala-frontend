import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockContracts } from '@/transactions/contract/mock';
import { ContractResponse } from '@/transactions/contract/types';
import { ContractStatus } from '@/transactions/common/types';
import { format } from 'date-fns';
import ProfileSearch from '@/profile/ProfileSearch';
import CompanySearch from '@/company/company/CompanySearch';
import CenterSearch from '@/company/center/CenterSearch';
// import { mockProfiles } from '@/profile/mockData';
// import { mockCompanies } from '@/company/company/mockData';
import { mockProfiles } from '@/profile/mockData';
import { mockCompanies } from '@/company/company/mockData';
import { mockCenters } from '@/company/center/mockData';

interface ContractFormData {
  title: string;
  contract_datetime: string;
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
    unit_price: number;
  }[];
}

const ContractForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<ContractFormData>({
    title: '',
    contract_datetime: format(new Date(), 'yyyy-MM-dd'),
    delivery_datetime: '',
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
        unit_price: 0,
      },
    ],
  });

  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
  const [selectedSupplierCompany, setSelectedSupplierCompany] = useState<any>(null);
  const [selectedReceiverCompany, setSelectedReceiverCompany] = useState<any>(null);
  const [selectedDepartureCenter, setSelectedDepartureCenter] = useState<any>(null);
  const [selectedArrivalCenter, setSelectedArrivalCenter] = useState<any>(null);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      // TODO: API 연동 시 실제 API 호출로 변경
      const contract = mockContracts.find(c => c.id === id);
      if (contract) {
        setFormData({
          title: contract.title,
          contract_datetime: contract.contract_datetime
            ? format(new Date(contract.contract_datetime), 'yyyy-MM-dd')
            : '',
          delivery_datetime: contract.delivery_datetime
            ? format(new Date(contract.delivery_datetime), 'yyyy-MM-dd')
            : '',
          supplier_company_id: contract.supplier_company_id,
          receiver_company_id: contract.receiver_company_id,
          departure_center_id: contract.departure_center_id,
          arrival_center_id: contract.arrival_center_id,
          notes: contract.notes || '',
          items: contract.items.map(item => ({
            product_id: item.product_id,
            quality: item.quality,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        });
      }
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log('Form submitted:', formData);
    navigate('/wholesaler/transactions/contracts');
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product_id: '',
          quality: '',
          quantity: 0,
          unit_price: 0,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? '계약 수정' : '계약 생성'}</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/contracts')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
        {/* 계약 기본 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">계약 기본 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">계약 제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">계약일</label>
              <input
                type="date"
                value={formData.contract_datetime}
                onChange={(e) => setFormData({ ...formData, contract_datetime: e.target.value })}
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

        {/* 계약 당사자 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">계약 당사자</h2>
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

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">계약 품목</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              품목 추가
            </button>
          </div>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">품목</label>
                  <select
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">선택하세요</option>
                    {/* TODO: API 연동 시 실제 데이터로 변경 */}
                    <option value="1">사과</option>
                    <option value="2">배</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">품질</label>
                  <input
                    type="text"
                    value={item.quality}
                    onChange={(e) => handleItemChange(index, 'quality', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">수량</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">단가</label>
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            비고
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="mt-8 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/wholesaler/transactions/contracts')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEdit ? '수정' : '생성'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractForm; 