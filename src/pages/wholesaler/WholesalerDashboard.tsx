import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyCard, CompanyUserList, Company, CompanyType, companyService, CompanyCreateRequest } from '../../company/company';
import { CenterList } from '../../company/center';
import WholesaleCompanyDetailCard from '../../company/company/components/display/WholesaleCompanyDetailCard';

const WholesalerDashboard = () => {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState<Company | null>(null);

  // Get company list
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies,
  });

  // Get my company
  const { data: myCompany } = useQuery({
    queryKey: ['myCompany'],
    queryFn: companyService.getMyCompany,
  });

  // Company creation mutation
  const createCompanyMutation = useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      setCompany(newCompany);
    },
  });

  // Company update mutation
  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companyService.updateCompany(id, data),
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      setCompany(updatedCompany);
    },
  });

  // Set company information
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
      <h1 className="text-2xl font-bold mb-6">Wholesaler Dashboard</h1>
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Company information section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Company Information / Wholesale Company</h2>
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

        {/* Company user management and center management */}
        {company && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Company Management</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Company user management */}
              <div>
                <h3 className="text-lg font-medium mb-4">Company User Management</h3>
                <CompanyUserList 
                  companyId={company.id} 
                />
              </div>

              {/* Center management */}
              <div>
                <h3 className="text-lg font-medium mb-4">Center Management</h3>
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