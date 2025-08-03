import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import ContractBasicInfo from './components/ContractBasicInfo';
import ContractParties from './components/ContractParties';
import ContractCenters from './components/ContractCenters';
import ContractItems from './components/ContractItems';
import { contractService } from './services/contractService';
import { companyService } from '../../company/company/services/companyService';
import { Company } from '../../company/company/types';
import { Profile } from '../../profile/types';
import { Center } from '../../company/center/types';
import { ContractStatus, PaymentStatus, ProductQuality } from '../common/types';
import { ContractItem, ContractFormData } from './types';

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
            payment_status: contract.payment_status as PaymentStatus,
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
          console.error('Failed to fetch contract information:', error);
        }
      };
      fetchContract();
    }
  }, [id]);

  // Track formData state changes
  useEffect(() => {
    console.log('formData updated:', formData);
  }, [formData]);

  // Track selectedSupplierCompany state changes
  useEffect(() => {
    console.log('selectedSupplierCompany updated:', selectedSupplierCompany);
  }, [selectedSupplierCompany]);

  // Track selectedReceiverCompany state changes
  useEffect(() => {
    console.log('selectedReceiverCompany updated:', selectedReceiverCompany);
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
          payment_status: formData.payment_status as PaymentStatus,
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
        console.error('Contract save failed:', error);
        alert('Failed to save contract.');
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
    console.log('Supplier selected:', profile);
    setSelectedSupplier(profile);
    
    // Clear previously selected company and center
    setSelectedSupplierCompany(null);
    setSelectedDepartureCenter(null);
    setFormData(prev => ({
      ...prev,
      supplier_person_id: profile.id || '',
      supplier_company_id: '',
      departure_center_id: ''
    }));
    
    // Auto-set company when user is selected using company_id
    if (profile.company_id) {
      console.log('Supplier company ID:', profile.company_id);
      try {
        const companies = await companyService.getCompanies();
        const company = companies.find((c: Company) => c.id === profile.company_id);
        if (company) {
          console.log('Supplier company found:', company);
          setSelectedSupplierCompany(company);
          setFormData(prev => ({
            ...prev,
            supplier_company_id: profile.company_id
          }));
        }
      } catch (error) {
        console.error('Failed to fetch company information:', error);
      }
    } else {
      console.log('Supplier user only (no company ID)');
    }
  };

  const handleReceiverSelect = async (profile: Profile) => {
    console.log('Receiver selected:', profile);
    setSelectedReceiver(profile);
    
    // Clear previously selected company and center
    setSelectedReceiverCompany(null);
    setSelectedArrivalCenter(null);
    setFormData(prev => ({
      ...prev,
      receiver_person_id: profile.id || '',
      receiver_company_id: '',
      arrival_center_id: ''
    }));
    
    // Auto-set company when user is selected using company_id
    if (profile.company_id) {
      console.log('Receiver company ID:', profile.company_id);
      try {
        const companies = await companyService.getCompanies();
        const company = companies.find((c: Company) => c.id === profile.company_id);
        if (company) {
          console.log('Receiver company found:', company);
          setSelectedReceiverCompany(company);
          setFormData(prev => ({
            ...prev,
            receiver_company_id: profile.company_id
          }));
        }
      } catch (error) {
        console.error('Failed to fetch company information:', error);
      }
    } else {
      console.log('Receiver user only (no company ID)');
    }
  };

  const handleSupplierCompanySelect = (company: Company) => {
    // Only allow company selection when user is not selected
    if (!selectedSupplier) {
      setSelectedSupplierCompany(company);
      setFormData({ ...formData, supplier_company_id: company.id });
    }
  };

  const handleReceiverCompanySelect = (company: Company) => {
    // Only allow company selection when user is not selected
    if (!selectedReceiver) {
      setSelectedReceiverCompany(company);
      setFormData({ ...formData, receiver_company_id: company.id });
    }
  };

  const handleDeliveryDateChange = (value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev, delivery_datetime: value };
      
      // Auto-set payment due date to last day of month when delivery date is set
      if (value) {
        const deliveryDate = new Date(value);
        const lastDayOfMonth = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth() + 1, 0);
        const paymentDueDate = format(lastDayOfMonth, 'yyyy-MM-dd');
        newFormData.payment_due_date = paymentDueDate;
      }
      
      return newFormData;
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Contract' : 'Create Contract'}</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/contracts')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
        {/* Contract Basic Information */}
        <ContractBasicInfo
          title={formData.title}
          contract_datetime={formData.contract_datetime}
          delivery_datetime={formData.delivery_datetime}
          payment_due_date={formData.payment_due_date || ''}
          contract_status={formData.contract_status}
          payment_status={formData.payment_status}
          onTitleChange={(value) => setFormData({ ...formData, title: value })}
          onContractDateChange={(value) => setFormData({ ...formData, contract_datetime: value })}
          onDeliveryDateChange={handleDeliveryDateChange}
          onPaymentDueDateChange={(value) => setFormData({ ...formData, payment_due_date: value })}
          onContractStatusChange={(value) => setFormData({ ...formData, contract_status: value })}
          onPaymentStatusChange={(value) => setFormData({ ...formData, payment_status: value })}
        />

        {/* Contract Parties Information */}
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

        {/* Center Information */}
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

        {/* Contract Items */}
        <ContractItems
          items={formData.items}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />

        {/* Notes */}
        <div className="mt-8">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/wholesaler/transactions/contracts')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractForm; 