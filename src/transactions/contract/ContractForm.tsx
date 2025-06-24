import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContractStatus, ProductQuality } from '@/transactions/common/types';
import { format } from 'date-fns';
import { companyService } from '@/company/company/services/companyService';
import { contractService } from '@/transactions/contract/services/contractService';
import { ContractFormData, Profile, Company, Center, ContractItem } from './types';
import ContractBasicInfo from './components/ContractBasicInfo';
import ContractParties from './components/ContractParties';
import ContractCenters from './components/ContractCenters';
import ContractItems from './components/ContractItems';

const ContractForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<ContractFormData>({
    title: '',
    contract_datetime: format(new Date(), 'yyyy-MM-dd'),
    delivery_datetime: '',
    payment_due_date: '',
    contract_status: 'draft',
    payment_status: 'unpaid',
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

  const [selectedSupplier, setSelectedSupplier] = useState<Profile | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<Profile | null>(null);
  const [selectedSupplierCompany, setSelectedSupplierCompany] = useState<Company | null>(null);
  const [selectedReceiverCompany, setSelectedReceiverCompany] = useState<Company | null>(null);
  const [selectedDepartureCenter, setSelectedDepartureCenter] = useState<Center | null>(null);
  const [selectedArrivalCenter, setSelectedArrivalCenter] = useState<Center | null>(null);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchContract = async () => {
        try {
          const contract = await contractService.getContract(id);
          setFormData({
            title: contract.title,
            contract_datetime: contract.contract_datetime
              ? format(new Date(contract.contract_datetime), 'yyyy-MM-dd')
              : '',
            delivery_datetime: contract.delivery_datetime
              ? format(new Date(contract.delivery_datetime), 'yyyy-MM-dd')
              : '',
            payment_due_date: contract.payment_due_date
              ? format(new Date(contract.payment_due_date), 'yyyy-MM-dd')
              : '',
            contract_status: contract.contract_status as ContractStatus,
            payment_status: contract.payment_status as ContractStatus,
            supplier_person_id: contract.supplier_contractor_id || '',
            supplier_company_id: contract.supplier_company_id || '',
            receiver_person_id: contract.receiver_contractor_id || '',
            receiver_company_id: contract.receiver_company_id || '',
            departure_center_id: contract.departure_center_id || '',
            arrival_center_id: contract.arrival_center_id || '',
            notes: contract.notes || '',
            items: contract.items.map((item: any) => ({
              product_id: item.product_name,
              quality: item.quality,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.total_price,
            })),
          });

          // 관계 데이터 설정
          if (contract.supplier_contractor) {
            setSelectedSupplier(contract.supplier_contractor);
          }
          if (contract.supplier_company) {
            setSelectedSupplierCompany(contract.supplier_company);
          }
          if (contract.receiver_contractor) {
            setSelectedReceiver(contract.receiver_contractor);
          }
          if (contract.receiver_company) {
            setSelectedReceiverCompany(contract.receiver_company);
          }
          if (contract.departure_center) {
            setSelectedDepartureCenter(contract.departure_center);
          }
          if (contract.arrival_center) {
            setSelectedArrivalCenter(contract.arrival_center);
          }
        } catch (error) {
          console.error('계약 정보 조회 실패:', error);
        }
      };
      fetchContract();
    }
  }, [id]);

  // formData 상태 변화 추적
  useEffect(() => {
    console.log('formData 업데이트됨:', formData);
  }, [formData]);

  // selectedSupplierCompany 상태 변화 추적
  useEffect(() => {
    console.log('selectedSupplierCompany 업데이트됨:', selectedSupplierCompany);
  }, [selectedSupplierCompany]);

  // selectedReceiverCompany 상태 변화 추적
  useEffect(() => {
    console.log('selectedReceiverCompany 업데이트됨:', selectedReceiverCompany);
  }, [selectedReceiverCompany]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        // 계약 수정
        await contractService.updateContract(id!, {
          title: formData.title,
          contract_datetime: formData.contract_datetime,
          delivery_datetime: formData.delivery_datetime,
          supplier_contractor_id: formData.supplier_person_id,
          supplier_company_id: formData.supplier_company_id,
          receiver_contractor_id: formData.receiver_person_id,
          receiver_company_id: formData.receiver_company_id,
          departure_center_id: formData.departure_center_id,
          arrival_center_id: formData.arrival_center_id,
          notes: formData.notes,
          items: formData.items.map(item => ({
            product_name: item.product_id,
            quality: item.quality as ProductQuality,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price || item.unit_price * item.quantity,
          })),
        });
      } else {
        // 계약 생성
        await contractService.createContract({
          title: formData.title,
          notes: formData.notes,
          supplier_contractor_id: formData.supplier_person_id || undefined,
          supplier_company_id: formData.supplier_company_id || undefined,
          receiver_contractor_id: formData.receiver_person_id || undefined,
          receiver_company_id: formData.receiver_company_id || undefined,
          departure_center_id: formData.departure_center_id || undefined,
          arrival_center_id: formData.arrival_center_id || undefined,
          contract_datetime: formData.contract_datetime ? new Date(formData.contract_datetime).toISOString() : undefined,
          delivery_datetime: formData.delivery_datetime ? new Date(formData.delivery_datetime).toISOString() : undefined,
          payment_due_date: formData.payment_due_date ? new Date(formData.payment_due_date).toISOString() : undefined,
          contract_status: formData.contract_status as ContractStatus,
          payment_status: formData.payment_status || 'unpaid',
          items: formData.items.map(item => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unit_price) || 0;
            return {
              product_name: item.product_id,
              quality: String(item.quality),
              quantity: quantity,
              unit_price: unitPrice,
              total_price: quantity * unitPrice,
              // Remove contract_id as it will be generated by backend
            };
          }),
        });
      }
      
      navigate('/wholesaler/transactions/contracts');
    } catch (error) {
      console.error('계약 저장 실패:', error);
      alert('계약 저장에 실패했습니다.');
    }
  };

  const handleItemChange = (index: number, field: keyof ContractItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      const itemToUpdate = { ...newItems[index] };

      // 1. 사용자가 변경한 값을 먼저 반영
      itemToUpdate[field] = value as never; // 타입스크립트 에러 우회

      // 2. 숫자형으로 변환 (계산을 위해)
      const quantity = Number(itemToUpdate.quantity) || 0;
      const unitPrice = Number(itemToUpdate.unit_price) || 0;
      
      // 3. 어떤 필드가 변경되었는지에 따라 자동계산 수행
      if (field === 'quantity' || field === 'unit_price') {
        // 수량 또는 단가가 변경되면 총액을 계산
        itemToUpdate.total_price = quantity * unitPrice;
      } else if (field === 'total_price') {
        // 총액이 변경되면 단가를 계산 (수량이 0이 아닐 때만)
        if (quantity > 0) {
          itemToUpdate.unit_price = (Number(itemToUpdate.total_price) || 0) / quantity;
        }
      }

      newItems[index] = itemToUpdate;
      return { ...prev, items: newItems };
    });
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

  const handleSupplierSelect = async (profile: Profile) => {
    console.log('공급자 선택됨:', profile);
    setSelectedSupplier(profile);
    
    // 기존 선택된 회사와 센터 초기화
    setSelectedSupplierCompany(null);
    setSelectedDepartureCenter(null);
    setFormData(prev => ({
      ...prev,
      supplier_person_id: profile.id || '',
      supplier_company_id: '',
      departure_center_id: ''
    }));
    
    // 유저가 선택되면 자동으로 소속 회사 설정
    if (profile.company_id) {
      console.log('공급자 회사 ID:', profile.company_id);
      // 회사 정보도 설정
      try {
        const companies = await companyService.getCompanies();
        const company = companies.find((c: Company) => c.id === profile.company_id);
        if (company) {
          console.log('공급자 회사 찾음:', company);
          setSelectedSupplierCompany(company);
          setFormData(prev => ({
            ...prev,
            supplier_company_id: profile.company_id
          }));
        }
      } catch (error) {
        console.error('회사 정보 조회 실패:', error);
      }
      console.log('공급자 formData 업데이트 완료');
    } else {
      console.log('공급자 유저만 설정 (회사 없음)');
    }
  };

  const handleReceiverSelect = async (profile: Profile) => {
    console.log('수신자 선택됨:', profile);
    setSelectedReceiver(profile);
    
    // 기존 선택된 회사와 센터 초기화
    setSelectedReceiverCompany(null);
    setSelectedArrivalCenter(null);
    setFormData(prev => ({
      ...prev,
      receiver_person_id: profile.id || '',
      receiver_company_id: '',
      arrival_center_id: ''
    }));
    
    // 유저가 선택되면 자동으로 소속 회사 설정
    if (profile.company_id) {
      console.log('수신자 회사 ID:', profile.company_id);
      // 회사 정보도 설정
      try {
        const companies = await companyService.getCompanies();
        const company = companies.find((c: Company) => c.id === profile.company_id);
        if (company) {
          console.log('수신자 회사 찾음:', company);
          setSelectedReceiverCompany(company);
          setFormData(prev => ({
            ...prev,
            receiver_company_id: profile.company_id
          }));
        }
      } catch (error) {
        console.error('회사 정보 조회 실패:', error);
      }
      console.log('수신자 formData 업데이트 완료');
    } else {
      console.log('수신자 유저만 설정 (회사 없음)');
    }
  };

  const handleSupplierCompanySelect = (company: Company) => {
    // 유저가 선택되지 않았을 때만 회사 선택 가능
    if (!selectedSupplier) {
      setSelectedSupplierCompany(company);
      setFormData({ ...formData, supplier_company_id: company.id });
    }
  };

  const handleReceiverCompanySelect = (company: Company) => {
    // 유저가 선택되지 않았을 때만 회사 선택 가능
    if (!selectedReceiver) {
      setSelectedReceiverCompany(company);
      setFormData({ ...formData, receiver_company_id: company.id });
    }
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
        <ContractBasicInfo
          title={formData.title}
          contract_datetime={formData.contract_datetime}
          delivery_datetime={formData.delivery_datetime}
          payment_due_date={formData.payment_due_date || ''}
          contract_status={formData.contract_status}
          payment_status={formData.payment_status}
          onTitleChange={(value) => setFormData({ ...formData, title: value })}
          onContractDateChange={(value) => setFormData({ ...formData, contract_datetime: value })}
          onDeliveryDateChange={(value) => setFormData({ ...formData, delivery_datetime: value })}
          onPaymentDueDateChange={(value) => setFormData({ ...formData, payment_due_date: value })}
          onContractStatusChange={(value) => setFormData({ ...formData, contract_status: value })}
          onPaymentStatusChange={(value) => setFormData({ ...formData, payment_status: value })}
        />

        {/* 계약 당사자 정보 */}
        <ContractParties
          selectedSupplier={selectedSupplier}
          selectedReceiver={selectedReceiver}
          selectedSupplierCompany={selectedSupplierCompany}
          selectedReceiverCompany={selectedReceiverCompany}
          onSupplierSelect={handleSupplierSelect}
          onReceiverSelect={handleReceiverSelect}
          onSupplierCompanySelect={handleSupplierCompanySelect}
          onReceiverCompanySelect={handleReceiverCompanySelect}
          onSupplierRemove={() => {
            setSelectedSupplier(null);
            setFormData(prev => ({ ...prev, supplier_person_id: '', supplier_company_id: '' }));
          }}
          onReceiverRemove={() => {
            setSelectedReceiver(null);
            setFormData(prev => ({ ...prev, receiver_person_id: '', receiver_company_id: '' }));
          }}
          onSupplierCompanyRemove={() => {
            setSelectedSupplierCompany(null);
            setFormData(prev => ({ ...prev, supplier_company_id: '' }));
          }}
          onReceiverCompanyRemove={() => {
            setSelectedReceiverCompany(null);
            setFormData(prev => ({ ...prev, receiver_company_id: '' }));
          }}
        />

        {/* 센터 정보 */}
        <ContractCenters
          selectedDepartureCenter={selectedDepartureCenter}
          selectedArrivalCenter={selectedArrivalCenter}
          selectedSupplierCompany={selectedSupplierCompany}
          selectedReceiverCompany={selectedReceiverCompany}
          onDepartureCenterSelect={(center) => {
            setSelectedDepartureCenter(center);
            setFormData({ ...formData, departure_center_id: center.id });
          }}
          onArrivalCenterSelect={(center) => {
            setSelectedArrivalCenter(center);
            setFormData({ ...formData, arrival_center_id: center.id });
          }}
          onDepartureCenterRemove={() => {
            setSelectedDepartureCenter(null);
            setFormData(prev => ({ ...prev, departure_center_id: '' }));
          }}
          onArrivalCenterRemove={() => {
            setSelectedArrivalCenter(null);
            setFormData(prev => ({ ...prev, arrival_center_id: '' }));
          }}
        />

        {/* 계약 품목 */}
        <ContractItems
          items={formData.items}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />

        {/* 비고 */}
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

        {/* 버튼 */}
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