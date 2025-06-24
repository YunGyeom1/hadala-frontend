import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

// Services
import { shipmentService } from './services/shipmentService';
import { contractService } from '../contract/services/contractService';
import { profileService } from '@/profile/profile';

// Child Components
import ShipmentBasicInfo from './components/ShipmentBasicInfo';
import ShipmentParties from './components/ShipmentParties';
import ShipmentCenters from './components/ShipmentCenters';
import ShipmentItems from './components/ShipmentItems';

// Types
import { ShipmentFormData, ShipmentItem } from './types';
import { ShipmentStatus, ProductQuality } from '../common/types';
import { ContractResponse } from '../contract/types';
import { Company } from '@/company/company/types';
import { Center } from '@/company/center/types';
import { Profile } from '@/profile/types';

// Default values
const defaultItem: ShipmentItem = {
  product_name: '',
  quality: ProductQuality.A,
  quantity: 0,
  unit_price: 0,
  total_price: 0,
};

const defaultForm: ShipmentFormData = {
  title: '',
  contract_id: '',
  shipment_datetime: format(new Date(), 'yyyy-MM-dd'),
  shipment_status: ShipmentStatus.PENDING,
  supplier_person_id: '',
  supplier_company_id: '',
  receiver_person_id: '',
  receiver_company_id: '',
  departure_center_id: '',
  arrival_center_id: '',
  notes: '',
  items: [{ ...defaultItem }],
};

/**
 * ContractForm의 컴포넌트 기반 구조를 완벽하게 모방한 최종 ShipmentForm.
 * 각 섹션이 하위 컴포넌트로 분리되어 있으며, 데이터 흐름과 상태 관리가 중앙에서 이루어집니다.
 */
const ShipmentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- State Management ---
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShipmentFormData>(defaultForm);
  const [allContracts, setAllContracts] = useState<ContractResponse[]>([]);

  // State for displaying selected entity objects (mirroring ContractForm structure)
  const [selectedSupplierCompany, setSelectedSupplierCompany] = useState<Company | null>(null);
  const [selectedReceiverCompany, setSelectedReceiverCompany] = useState<Company | null>(null);
  const [selectedDepartureCenter, setSelectedDepartureCenter] = useState<Center | null>(null);
  const [selectedArrivalCenter, setSelectedArrivalCenter] = useState<Center | null>(null);
  const [selectedSupplierPerson, setSelectedSupplierPerson] = useState<Profile | null>(null);
  const [selectedReceiverPerson, setSelectedReceiverPerson] = useState<Profile | null>(null);

  // --- Data Loading ---

  // Initial data loading for Edit mode
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      setLoading(true);
      const fetchShipmentAndRelatedData = async () => {
        try {
          const shipment = await shipmentService.getShipment(id);
          const contract = await contractService.getContract(shipment.contract_id);
          const [supplier, receiver] = await Promise.all([
            shipment.supplier_person_id ? profileService.getProfile(shipment.supplier_person_id) : Promise.resolve(null),
            shipment.receiver_person_id ? profileService.getProfile(shipment.receiver_person_id) : Promise.resolve(null)
          ]);
          
          setFormData({
            ...shipment,
            notes: shipment.notes || '', 
            shipment_datetime: shipment.shipment_datetime.slice(0, 10),
          });
          setSelectedSupplierCompany(contract.supplier_company || null);
          setSelectedReceiverCompany(contract.receiver_company || null);
          setSelectedDepartureCenter(contract.departure_center || null);
          setSelectedArrivalCenter(contract.arrival_center || null);
          setSelectedSupplierPerson(supplier);
          setSelectedReceiverPerson(receiver);

        } catch (error) {
          console.error("출하 및 관련 정보 로딩 실패:", error);
          alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };
      fetchShipmentAndRelatedData();
    }
  }, [id]);

  // Load all contracts for the dropdown
  useEffect(() => {
    if (!isEdit) {
      contractService.getContracts().then(setAllContracts);
    }
  }, [isEdit]);

  // --- Event Handlers ---

  const handleContractChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const contractId = e.target.value;
    if (!contractId) {
      setFormData(defaultForm);
      setSelectedSupplierCompany(null);
      setSelectedReceiverCompany(null);
      setSelectedDepartureCenter(null);
      setSelectedArrivalCenter(null);
      setSelectedSupplierPerson(null);
      setSelectedReceiverPerson(null);
      return;
    }

    try {
      setLoading(true);
      const contract = await contractService.getContract(contractId);
      
      setSelectedSupplierCompany(contract.supplier_company || null);
      setSelectedReceiverCompany(contract.receiver_company || null);
      setSelectedDepartureCenter(contract.departure_center || null);
      setSelectedArrivalCenter(contract.arrival_center || null);
      setSelectedSupplierPerson(contract.supplier_contractor || null);
      setSelectedReceiverPerson(contract.receiver_contractor || null);

      setFormData(prev => ({
        ...prev,
        title: prev.title || `${contract.title} - 출하`,
        contract_id: contract.id,
        supplier_person_id: contract.supplier_contractor_id || '',
        supplier_company_id: contract.supplier_company_id || '',
        receiver_person_id: contract.receiver_contractor_id || '',
        receiver_company_id: contract.receiver_company_id || '',
        departure_center_id: contract.departure_center_id || '',
        arrival_center_id: contract.arrival_center_id || '',
        items: contract.items.length > 0 ? contract.items.map(item => ({
          product_name: item.product_name,
          quality: item.quality as ProductQuality,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })) : [{ ...defaultItem }],
      }));
    } catch (error) {
      console.error("계약 정보 로딩 실패:", error);
      alert("선택한 계약 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleItemChange = (index: number, field: keyof ShipmentItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      const itemToUpdate = { ...newItems[index] };
      itemToUpdate[field] = value as never;

      const quantity = Number(itemToUpdate.quantity) || 0;
      const unitPrice = Number(itemToUpdate.unit_price) || 0;
      itemToUpdate.total_price = quantity * unitPrice;
      
      newItems[index] = itemToUpdate;
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { ...defaultItem }] }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contract_id) {
        alert('연결된 계약을 선택해주세요.');
        return;
    }
    setLoading(true);

    const shipmentPayload = {
      ...formData,
      shipment_datetime: new Date(formData.shipment_datetime).toISOString(),
      items: formData.items.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        unit_price: Number(item.unit_price) || 0,
        total_price: (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
      })),
    };

    try {
      if (isEdit && id) {
        await shipmentService.updateShipment(id, shipmentPayload);
      } else {
        await shipmentService.createShipment(shipmentPayload);
      }
      navigate('/wholesaler/transactions/shipments');
    } catch (error: any) {
      console.error("출하 저장 실패:", error);
      alert(`저장에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  if (loading && isEdit) {
    return <div className="p-8">데이터를 불러오는 중...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{isEdit ? '출하 수정' : '출하 생성'}</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/shipments')}
          className="btn btn-ghost"
        >
          목록으로
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <ShipmentBasicInfo
          title={formData.title}
          shipment_datetime={formData.shipment_datetime}
          contractId={formData.contract_id}
          allContracts={allContracts}
          isEditMode={isEdit}
          onTitleChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
          onShipmentDateChange={(value) => setFormData(prev => ({...prev, shipment_datetime: value}))}
          onContractChange={handleContractChange}
        />

        <ShipmentParties 
          selectedSupplierCompany={selectedSupplierCompany}
          selectedReceiverCompany={selectedReceiverCompany}
          selectedSupplierPerson={selectedSupplierPerson}
          selectedReceiverPerson={selectedReceiverPerson}
          onSupplierPersonSelect={(profile) => {
            setSelectedSupplierPerson(profile);
            setFormData(prev => ({ ...prev, supplier_person_id: profile.id }));
          }}
          onReceiverPersonSelect={(profile) => {
            setSelectedReceiverPerson(profile);
            setFormData(prev => ({ ...prev, receiver_person_id: profile.id }));
          }}
          onSupplierPersonRemove={() => setSelectedSupplierPerson(null)}
          onReceiverPersonRemove={() => setSelectedReceiverPerson(null)}
        />
        
        <ShipmentCenters
            selectedDepartureCenter={selectedDepartureCenter}
            selectedArrivalCenter={selectedArrivalCenter}
        />

        <ShipmentItems 
          items={formData.items}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />

        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">비고</h2>
            <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="textarea textarea-bordered w-full h-24"
                placeholder="출하 관련 특이사항을 입력하세요."
            />
        </div>

        <div className="flex justify-end gap-x-4 pt-4">
          <button type="button" onClick={() => navigate('/wholesaler/transactions/shipments')} className="btn btn-ghost">취소</button>
          {isEdit && (
            <button
              type="button"
              className="btn btn-error"
              onClick={async () => {
                if (window.confirm('정말로 이 출하 정보를 삭제하시겠습니까?')) {
                  try {
                    await shipmentService.deleteShipment(id!);
                    alert('출하 정보가 삭제되었습니다.');
                    navigate('/wholesaler/transactions/shipments');
                  } catch (error: any) {
                    alert(error.message || '삭제에 실패했습니다.');
                  }
                }
              }}
            >
              삭제
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '저장 중...' : (isEdit ? '출하 정보 수정' : '출하 생성')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentForm; 