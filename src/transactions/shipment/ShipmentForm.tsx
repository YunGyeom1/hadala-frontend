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
 * Final ShipmentForm based on ContractForm's component-based structure.
 * Each section is separated into child components, with data flow and state management centralized.
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
  
  // Calculate month end date function
  const getMonthEndDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return format(new Date(year, month, lastDay), 'yyyy-MM-dd');
  };

  // Calculate total price function
  // const calculateTotalPrice = (items: ShipmentItem[]): number => {
  //   return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  // };

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
          console.error("Failed to load shipment and related information:", error);
          alert("Failed to load data.");
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

  // Reset form data when new contract creation mode changes
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
        title: prev.title || `${contract.title} - Shipment`,
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
      console.error("Failed to load contract information:", error);
      alert("Failed to load selected contract information.");
    } finally {
      setLoading(false);
    }
  };

  // const handleContractChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const contractId = e.target.value;
  //   if (!contractId) {
  //     setFormData(defaultForm);
  //     setSelectedSupplierCompany(null);
  //     setSelectedReceiverCompany(null);
  //     setSelectedDepartureCenter(null);
  //     setSelectedArrivalCenter(null);
  //     setSelectedSupplierPerson(null);
  //     setSelectedReceiverPerson(null);
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const contract = await contractService.getContract(contractId);
  //     
  //     setSelectedSupplierCompany(contract.supplier_company || null);
  //     setSelectedReceiverCompany(contract.receiver_company || null);
  //     setSelectedDepartureCenter(contract.departure_center || null);
  //     setSelectedArrivalCenter(contract.arrival_center || null);
  //     setSelectedSupplierPerson(contract.supplier_contractor || null);
  //     setSelectedReceiverPerson(contract.receiver_contractor || null);

  //     setFormData(prev => ({
  //       ...prev,
  //       title: prev.title || `${contract.title} - Shipment`,
  //       contract_id: contract.id,
  //       supplier_person_id: contract.supplier_contractor_id || '',
  //       supplier_company_id: contract.supplier_company_id || '',
  //       receiver_person_id: contract.receiver_contractor_id || '',
  //       receiver_company_id: contract.receiver_company_id || '',
  //       departure_center_id: contract.departure_center_id || '',
  //       arrival_center_id: contract.arrival_center_id || '',
  //       items: contract.items.length > 0 ? contract.items.map(item => ({
  //         product_name: item.product_name,
  //         quality: item.quality as ProductQuality,
  //         quantity: item.quantity,
  //         unit_price: item.unit_price,
  //         total_price: item.total_price,
  //       })) : [{ ...defaultItem }],
  //     }));
  //   } catch (error) {
  //     console.error("Failed to load contract information:", error);
  //     alert("Failed to load selected contract information.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
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
        alert('Please select a linked contract.');
        return;
    }

    // Required field validation for new contract creation
    if (createNewContract) {
      if (!formData.title.trim()) {
        alert('Please enter a shipment name.');
        return;
      }
      if (!formData.shipment_datetime) {
        alert('Please select a shipment date.');
        return;
      }
      if (!formData.supplier_company_id && !formData.supplier_person_id) {
        alert('Please select a supplier (company or individual).');
        return;
      }
      if (!formData.receiver_company_id && !formData.receiver_person_id) {
        alert('Please select a receiver (company or individual).');
        return;
      }
      if (!formData.departure_center_id) {
        alert('Please select a departure center.');
        return;
      }
      if (!formData.arrival_center_id) {
        alert('Please select an arrival center.');
        return;
      }
      if (formData.items.length === 0 || formData.items.every(item => !item.product_name.trim())) {
        alert('Please enter at least one product.');
        return;
      }
    }
    
    setLoading(true);

    try {
      let contractId = formData.contract_id;
      
      // 새로운 contract 생성이 필요한 경우
      if (createNewContract) {
        const contractTitle = formData.title 
          ? `${formData.title} - Contract`
          : `Shipment Contract - ${format(new Date(formData.shipment_datetime), 'yyyy-MM-dd')}`;
          
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
        alert('Shipment information has been updated.');
      } else {
        await shipmentService.createShipment(shipmentPayload);
        if (createNewContract) {
          alert('New contract and shipment created successfully.');
        } else {
          alert('Shipment created successfully.');
        }
      }
      navigate('/wholesaler/transactions/shipments');
    } catch (error: any) {
      console.error("Failed to save shipment:", error);
      alert(`Failed to save: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // ContractForm의 회사 선택 로직 적용
  const handleSupplierPersonSelect = async (profile: Profile) => {
    console.log('Supplier selected:', profile);
    setSelectedSupplierPerson(profile);
    
    // Reset selected company
    setSelectedSupplierCompany(null);
    setFormData(prev => ({
      ...prev,
      supplier_person_id: profile.id || '',
      supplier_company_id: ''
    }));
    
    // If user has company_id, auto-select company
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
        console.error('Failed to load company information:', error);
      }
    } else {
      console.log('Only supplier user set (no company ID)');
    }
  };

  const handleReceiverPersonSelect = async (profile: Profile) => {
    console.log('Receiver selected:', profile);
    setSelectedReceiverPerson(profile);
    
    // Reset selected company
    setSelectedReceiverCompany(null);
    setFormData(prev => ({
      ...prev,
      receiver_person_id: profile.id || '',
      receiver_company_id: ''
    }));
    
    // If user has company_id, auto-select company
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
        console.error('Failed to load company information:', error);
      }
    } else {
      console.log('Only receiver user set (no company ID)');
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
    return <div className="p-8">Loading data...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Shipment' : 'Create Shipment'}</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/shipments')}
          className="btn btn-ghost"
        >
          Back to List
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
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Notes</h2>
            <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Enter shipment-related notes."
            />
        </div>

        <div className="flex justify-end gap-x-4 pt-4">
          <button type="button" onClick={() => navigate('/wholesaler/transactions/shipments')} className="btn btn-ghost">Cancel</button>
          {isEdit && (
            <button
              type="button"
              className="btn btn-error"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this shipment?')) {
                  try {
                    await shipmentService.deleteShipment(id!);
                    alert('Shipment has been deleted.');
                    navigate('/wholesaler/transactions/shipments');
                  } catch (error: any) {
                    alert(error.message || 'Failed to delete.');
                  }
                }
              }}
            >
              Delete
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Shipment' : 'Create Shipment')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentForm; 