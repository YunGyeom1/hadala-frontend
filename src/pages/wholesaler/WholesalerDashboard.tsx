import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyCard, CompanyUserList, Company, CompanyType, companyService, CompanyCreateRequest } from '../../company/company';
import { CenterList } from '../../company/center';
import WholesaleCompanyDetailCard from '../../company/company/components/display/WholesaleCompanyDetailCard';

const WholesalerDashboard = () => {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState<Company | null>(null);

  // 회사 목록 조회
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies,
  });

  // 내 회사 조회
  const { data: myCompany } = useQuery({
    queryKey: ['myCompany'],
    queryFn: companyService.getMyCompany,
  });

  // 회사 생성 mutation
  const createCompanyMutation = useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      setCompany(newCompany);
    },
  });

  // 회사 수정 mutation
  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companyService.updateCompany(id, data),
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      setCompany(updatedCompany);
    },
  });

  // 회사 정보 설정
  useEffect(() => {
    if (myCompany) {
      setCompany(myCompany);
    } else {
      const wholesalerCompany = companies.find(c => c.type === CompanyType.WHOLESALER);
      if (wholesalerCompany) {
        setCompany(wholesalerCompany);
      }
    }
  }, [myCompany, companies]);

  const handleCreate = (companyData: Omit<Company, 'id'>) => {
    createCompanyMutation.mutate(companyData);
  };

  const handleUpdate = (companyData: Company) => {
    updateCompanyMutation.mutate({ id: companyData.id, data: companyData });
  };

  const existingCompanies = companies.filter(c => c.id !== company?.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">도매상 대시보드</h1>
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 회사 정보 섹션 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">회사 정보 / 도매 회사</h2>
          <div className="grid grid-cols-2 gap-6">
            <CompanyCard
              company={company || undefined}
              type={CompanyType.WHOLESALER}
              onUpdate={handleUpdate}
              onCreate={(company: CompanyCreateRequest) => handleCreate(company as Omit<Company, 'id'>)}
              existingCompanies={existingCompanies}
            />
            {company && (
              <WholesaleCompanyDetailCard
                companyId={company.id}
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
                <CompanyUserList 
                  companyId={company.id} 
                />
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