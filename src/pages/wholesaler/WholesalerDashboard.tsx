import React, { useState, useEffect } from 'react';
import CompanyCard from '../../company/company/CompanyCard';
import CompanyUserList from '../../company/company/CompanyUserList';
import { Company, CompanyType } from '../../company/company/types';
import { mockCompanies } from '../../company/company/mockData';
import { Center } from '../../center/types';
import { mockCenters } from '../../center/mockData';
import CenterList from '../../center/CenterList';
import { WholesaleCompanyDetail } from '../../company/wholesale/types';
import { mockWholesaleCompanyDetails } from '../../company/wholesale/mockData';
import WholesaleCompanyDetailCard from '../../company/wholesale/WholesaleCompanyDetailCard';

const WholesalerDashboard = () => {
  const [company, setCompany] = useState<Company | undefined>();
  const [existingCompanies, setExistingCompanies] = useState<Company[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [companyDetail, setCompanyDetail] = useState<WholesaleCompanyDetail | undefined>();

  useEffect(() => {
    // TODO: API 연동 시 실제 API 호출로 변경
    const wholesalerCompany = mockCompanies.find(c => c.type === CompanyType.WHOLESALER);
    if (wholesalerCompany) {
      setCompany(wholesalerCompany);
      const detail = mockWholesaleCompanyDetails.find(d => d.company_id === wholesalerCompany.id);
      if (detail) {
        setCompanyDetail(detail);
      }
    }
    setExistingCompanies(mockCompanies);
    setCenters(mockCenters);
  }, []);

  const handleUpdate = (updatedCompany: Company) => {
    // TODO: API 연동 시 실제 API 호출로 변경
    setCompany(updatedCompany);
  };

  const handleCreate = (newCompany: Omit<Company, 'id'>) => {
    // TODO: API 연동 시 실제 API 호출로 변경
    const createdCompany: Company = {
      ...newCompany,
      id: Math.random().toString(36).substr(2, 9),
      owner_name: '홍길동' // TODO: 실제 프로필에서 가져오기
    };
    setCompany(createdCompany);
  };

  const handleDetailUpdate = (updatedDetail: WholesaleCompanyDetail) => {
    // TODO: API 연동 시 실제 API 호출로 변경
    setCompanyDetail(updatedDetail);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">도매상 대시보드</h1>
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 회사 정보 섹션 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">회사 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <CompanyCard
              company={company}
              type={CompanyType.WHOLESALER}
              onUpdate={handleUpdate}
              onCreate={handleCreate}
              existingCompanies={existingCompanies}
            />
            {companyDetail && (
              <WholesaleCompanyDetailCard
                detail={companyDetail}
                onUpdate={handleDetailUpdate}
              />
            )}
          </div>
        </section>

        {/* 회사 유저 관리와 센터 관리 */}
        {company && (
          <section>
            <h2 className="text-xl font-semibold mb-4">회사 관리</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* 회사 유저 관리 */}
              <div>
                <h3 className="text-lg font-medium mb-4">회사 유저 관리</h3>
                <CompanyUserList companyId={company.id} />
              </div>

              {/* 센터 관리 */}
              <div>
                <h3 className="text-lg font-medium mb-4">센터 관리</h3>
                <CenterList companyId={company.id} />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default WholesalerDashboard; 