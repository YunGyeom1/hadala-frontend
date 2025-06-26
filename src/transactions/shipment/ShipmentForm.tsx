import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

// Services
import { shipmentService } from './services/shipmentService';
import { contractService } from '../contract/services/contractService';
import { profileService } from '@/profile/profile';
import { companyService } from '@/company/company/services/companyService';

// Child Components
import ShipmentBasicInfo from './components/ShipmentBasicInfo';
import ShipmentParties from './components/ShipmentParties';
import ShipmentCenters from './components/ShipmentCenters';
import ShipmentItems from './components/ShipmentItems';

// Types
import { ShipmentFormData, ShipmentItem } from './types';
import { ShipmentStatus, ProductQuality, ContractStatus, PaymentStatus } from '../common/types';
import { ContractResponse, ContractCreate } from '../contract/types';
import { Company } from '@/company/company/types';
import { Center } from '@/company/center/types';
import { Profile } from '@/profile/types';

// Default values
const defaultItem: ShipmentItem = {
  product_name: '',
  quality: '',
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
  const [createNewContract, setCreateNewContract] = useState(false);

  // State for displaying selected entity objects (mirroring ContractForm structure)
  const [selectedSupplierCompany, setSelectedSupplierCompany] = useState<Company | null>(null);
  const [selectedReceiverCompany, setSelectedReceiverCompany] = useState<Company | null>(null);
  const [selectedDepartureCenter, setSelectedDepartureCenter] = useState<Center | null>(null);
  const [selectedArrivalCenter, setSelectedArrivalCenter] = useState<Center | null>(null);
  const [selectedSupplierPerson, setSelectedSupplierPerson] = useState<Profile | null>(null);
  const [selectedReceiverPerson, setSelectedReceiverPerson] = useState<Profile | null>(null);
  const [selectedContract, setSelectedContract] = useState<ContractResponse | null>(null);

  // --- Utility Functions ---
  
  // 월말 날짜 계산 함수
  const getMonthEndDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return format(new Date(year, month, lastDay), 'yyyy-MM-dd');
  };

  // 총 가격 계산 함수
  const calculateTotalPrice = (items: ShipmentItem[]): number => {
    return items.reduce((total, item) => total + (item.total_price || 0), 0);
  };

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
          setSelectedContract(contract);
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

  // 새로운 contract 생성 모드가 변경될 때 form 데이터 초기화
  useEffect(() => {
    if (createNewContract) {
      setFormData(prev => ({
        ...prev,
        contract_id: '',
      }));
      setSelectedContract(null);
      setSelectedSupplierCompany(null);
      setSelectedReceiverCompany(null);
      setSelectedDepartureCenter(null);
      setSelectedArrivalCenter(null);
      setSelectedSupplierPerson(null);
      setSelectedReceiverPerson(null);
    }
  }, [createNewContract]);

  // --- Event Handlers ---

  const handleContractSelect = async (contract: ContractResponse) => {
    try {
      setLoading(true);
      
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
          product_name: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createNewContract && !formData.contract_id) {
        alert('연결된 계약을 선택해주세요.');
        return;
    }

    // 새로운 contract 생성 시 필수 필드 검증
    if (createNewContract) {
      if (!formData.title.trim()) {
        alert('출하명을 입력해주세요.');
        return;
      }
      if (!formData.shipment_datetime) {
        alert('출하일을 선택해주세요.');
        return;
      }
      if (!formData.supplier_company_id && !formData.supplier_person_id) {
        alert('공급자(회사 또는 개인)를 선택해주세요.');
        return;
      }
      if (!formData.receiver_company_id && !formData.receiver_person_id) {
        alert('수신자(회사 또는 개인)를 선택해주세요.');
        return;
      }
      if (!formData.departure_center_id) {
        alert('출발 센터를 선택해주세요.');
        return;
      }
      if (!formData.arrival_center_id) {
        alert('도착 센터를 선택해주세요.');
        return;
      }
      if (formData.items.length === 0 || formData.items.every(item => !item.product_name.trim())) {
        alert('최소 하나의 상품을 입력해주세요.');
        return;
      }
    }
    
    setLoading(true);

    try {
      let contractId = formData.contract_id;
      
      // 새로운 contract 생성이 필요한 경우
      if (createNewContract) {
        const contractTitle = formData.title 
          ? `${formData.title} - 계약`
          : `출하 계약 - ${format(new Date(formData.shipment_datetime), 'yyyy년 MM월 dd일')}`;
          
        const contractData: ContractCreate = {
          title: contractTitle,
          contract_datetime: formData.shipment_datetime,
          delivery_datetime: formData.shipment_datetime,
          payment_due_date: getMonthEndDate(formData.shipment_datetime),
          contract_status: ContractStatus.PENDING,
          payment_status: PaymentStatus.UNPAID,
          supplier_contractor_id: formData.supplier_person_id || undefined,
          supplier_company_id: formData.supplier_company_id || undefined,
          receiver_contractor_id: formData.receiver_person_id || undefined,
          receiver_company_id: formData.receiver_company_id || undefined,
          departure_center_id: formData.departure_center_id || undefined,
          arrival_center_id: formData.arrival_center_id || undefined,
          notes: formData.notes,
          items: formData.items
            .filter(item => item.product_name.trim() && item.quantity > 0)
            .map(item => ({
              product_name: item.product_name,
              quality: item.quality,
              quantity: Number(item.quantity) || 0,
              unit_price: Number(item.unit_price) || 0,
              total_price: (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
            })),
        };

        const newContract = await contractService.createContract(contractData);
        contractId = newContract.id;
      }

      const shipmentPayload = {
        ...formData,
        contract_id: contractId,
        shipment_datetime: new Date(formData.shipment_datetime).toISOString(),
        items: formData.items
          .filter(item => item.product_name.trim() && item.quantity > 0)
          .map(item => ({
            product_name: item.product_name,
            quality: item.quality as ProductQuality,
            quantity: Number(item.quantity) || 0,
            unit_price: Number(item.unit_price) || 0,
            total_price: (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
          })),
      };

      if (isEdit && id) {
        await shipmentService.updateShipment(id, shipmentPayload);
        alert('출하 정보가 수정되었습니다.');
      } else {
        await shipmentService.createShipment(shipmentPayload);
        if (createNewContract) {
          alert('새 계약과 함께 출하가 성공적으로 생성되었습니다.');
        } else {
          alert('출하가 성공적으로 생성되었습니다.');
        }
      }
      navigate('/wholesaler/transactions/shipments');
    } catch (error: any) {
      console.error("출하 저장 실패:", error);
      alert(`저장에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // ContractForm의 회사 선택 로직 적용
  const handleSupplierPersonSelect = async (profile: Profile) => {
    console.log('공급자 선택됨:', profile);
    setSelectedSupplierPerson(profile);
    
    // 기존 선택된 회사 초기화
    setSelectedSupplierCompany(null);
    setFormData(prev => ({
      ...prev,
      supplier_person_id: profile.id || '',
      supplier_company_id: ''
    }));
    
    // 유저가 선택되면 company_id로 회사 자동 설정
    if (profile.company_id) {
      console.log('공급자 회사 ID:', profile.company_id);
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
    } else {
      console.log('공급자 유저만 설정 (회사 ID 없음)');
    }
  };

  const handleReceiverPersonSelect = async (profile: Profile) => {
    console.log('수신자 선택됨:', profile);
    setSelectedReceiverPerson(profile);
    
    // 기존 선택된 회사 초기화
    setSelectedReceiverCompany(null);
    setFormData(prev => ({
      ...prev,
      receiver_person_id: profile.id || '',
      receiver_company_id: ''
    }));
    
    // 유저가 선택되면 company_id로 회사 자동 설정
    if (profile.company_id) {
      console.log('수신자 회사 ID:', profile.company_id);
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
    } else {
      console.log('수신자 유저만 설정 (회사 ID 없음)');
    }
  };

  const handleSupplierCompanySelect = (company: Company) => {
    // 유저가 선택되지 않았을 때만 회사 선택 가능
    if (!selectedSupplierPerson) {
      setSelectedSupplierCompany(company);
      setFormData(prev => ({ ...prev, supplier_company_id: company.id }));
    }
  };

  const handleReceiverCompanySelect = (company: Company) => {
    // 유저가 선택되지 않았을 때만 회사 선택 가능
    if (!selectedReceiverPerson) {
      setSelectedReceiverCompany(company);
      setFormData(prev => ({ ...prev, receiver_company_id: company.id }));
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
          selectedContract={selectedContract}
          isEditMode={isEdit}
          createNewContract={createNewContract}
          onTitleChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
          onShipmentDateChange={(value) => setFormData(prev => ({...prev, shipment_datetime: value}))}
          onContractSelect={(contract) => {
            setSelectedContract(contract);
            handleContractSelect(contract);
          }}
          onContractRemove={() => {
            setSelectedContract(null);
            setFormData(prev => ({ ...prev, contract_id: '' }));
            setSelectedSupplierCompany(null);
            setSelectedReceiverCompany(null);
            setSelectedDepartureCenter(null);
            setSelectedArrivalCenter(null);
            setSelectedSupplierPerson(null);
            setSelectedReceiverPerson(null);
          }}
          onCreateNewContractChange={setCreateNewContract}
        />

        <ShipmentParties 
          selectedSupplierCompany={selectedSupplierCompany}
          selectedReceiverCompany={selectedReceiverCompany}
          selectedSupplierPerson={selectedSupplierPerson}
          selectedReceiverPerson={selectedReceiverPerson}
          onSupplierPersonSelect={handleSupplierPersonSelect}
          onReceiverPersonSelect={handleReceiverPersonSelect}
          onSupplierPersonRemove={() => {
            setSelectedSupplierPerson(null);
            setFormData(prev => ({ ...prev, supplier_person_id: '', supplier_company_id: '' }));
          }}
          onReceiverPersonRemove={() => {
            setSelectedReceiverPerson(null);
            setFormData(prev => ({ ...prev, receiver_person_id: '', receiver_company_id: '' }));
          }}
          onSupplierCompanySelect={handleSupplierCompanySelect}
          onReceiverCompanySelect={handleReceiverCompanySelect}
          onSupplierCompanyRemove={() => {
            setSelectedSupplierCompany(null);
            setFormData(prev => ({ ...prev, supplier_company_id: '' }));
          }}
          onReceiverCompanyRemove={() => {
            setSelectedReceiverCompany(null);
            setFormData(prev => ({ ...prev, receiver_company_id: '' }));
          }}
        />
        
        <ShipmentCenters
            selectedDepartureCenter={selectedDepartureCenter}
            selectedArrivalCenter={selectedArrivalCenter}
            supplierCompanyId={formData.supplier_company_id || undefined}
            receiverCompanyId={formData.receiver_company_id || undefined}
            onDepartureCenterSelect={(center) => {
              setSelectedDepartureCenter(center);
              setFormData(prev => ({ ...prev, departure_center_id: center.id }));
            }}
            onArrivalCenterSelect={(center) => {
              setSelectedArrivalCenter(center);
              setFormData(prev => ({ ...prev, arrival_center_id: center.id }));
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