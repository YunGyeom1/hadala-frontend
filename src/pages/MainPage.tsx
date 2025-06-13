import { useState } from 'react';
import axios from 'axios';

const MainPage = () => {
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showOrganizationForm, setShowOrganizationForm] = useState(false);
  const [showWholesalerForm, setShowWholesalerForm] = useState(false);
  const [farmerData, setFarmerData] = useState({
    name: '',
    address: '',
    farm_size: 0,
    yearly_yield: 0,
    farm_members: 0
  });
  const [organizationData, setOrganizationData] = useState({
    name: '',
    address: ''
  });
  const [wholesalerData, setWholesalerData] = useState({
    name: '',
    phone: '',
    address: '',
    role: 'manager'
  });

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/farmers/', farmerData);
      console.log('Farmer added:', response.data);
      setShowFarmerForm(false);
    } catch (error) {
      console.error('Error adding farmer:', error);
    }
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/organizations/', organizationData);
      console.log('Organization added:', response.data);
      setShowOrganizationForm(false);
    } catch (error) {
      console.error('Error adding organization:', error);
    }
  };

  const handleWholesalerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/wholesalers/', wholesalerData);
      console.log('Wholesaler added:', response.data);
      setShowWholesalerForm(false);
    } catch (error) {
      console.error('Error adding wholesaler:', error);
    }
  };

  const handleFarmerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFarmerData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrganizationData(prev => ({ ...prev, [name]: value }));
  };

  const handleWholesalerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWholesalerData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold mt-10 mb-6">메인 대시보드</h1>
      <div className="flex gap-4 mb-8">
        <button className="btn" onClick={() => setShowFarmerForm(true)}>Farmer 추가</button>
        <button className="btn" onClick={() => setShowOrganizationForm(true)}>Organizations 추가</button>
        <button className="btn" onClick={() => setShowWholesalerForm(true)}>Wholesalers 추가</button>
      </div>

      {showFarmerForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Farmer 추가</h2>
            <form onSubmit={handleFarmerSubmit}>
              <input type="text" name="name" placeholder="이름" value={farmerData.name} onChange={handleFarmerChange} required />
              <input type="text" name="address" placeholder="주소" value={farmerData.address} onChange={handleFarmerChange} />
              <input type="number" name="farm_size" placeholder="농장 크기" value={farmerData.farm_size} onChange={handleFarmerChange} />
              <input type="number" name="yearly_yield" placeholder="연간 수확량" value={farmerData.yearly_yield} onChange={handleFarmerChange} />
              <input type="number" name="farm_members" placeholder="농장 구성원 수" value={farmerData.farm_members} onChange={handleFarmerChange} />
              <button type="submit">추가</button>
              <button type="button" onClick={() => setShowFarmerForm(false)}>닫기</button>
            </form>
          </div>
        </div>
      )}

      {showOrganizationForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Organizations 추가</h2>
            <form onSubmit={handleOrganizationSubmit}>
              <input type="text" name="name" placeholder="조직명" value={organizationData.name} onChange={handleOrganizationChange} required />
              <input type="text" name="address" placeholder="주소" value={organizationData.address} onChange={handleOrganizationChange} required />
              <button type="submit">추가</button>
              <button type="button" onClick={() => setShowOrganizationForm(false)}>닫기</button>
            </form>
          </div>
        </div>
      )}

      {showWholesalerForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Wholesalers 추가</h2>
            <form onSubmit={handleWholesalerSubmit}>
              <input type="text" name="name" placeholder="이름" value={wholesalerData.name} onChange={handleWholesalerChange} required />
              <input type="text" name="phone" placeholder="전화번호" value={wholesalerData.phone} onChange={handleWholesalerChange} required />
              <input type="text" name="address" placeholder="주소" value={wholesalerData.address} onChange={handleWholesalerChange} required />
              <select name="role" value={wholesalerData.role} onChange={handleWholesalerChange} required>
                <option value="manager">매니저</option>
                <option value="staff">스태프</option>
              </select>
              <button type="submit">추가</button>
              <button type="button" onClick={() => setShowWholesalerForm(false)}>닫기</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage; 