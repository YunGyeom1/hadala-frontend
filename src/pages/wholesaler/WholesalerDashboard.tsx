import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyCard, CompanyUserList, Company, CompanyType, companyService, CompanyCreateRequest } from '../../company/company';
import { CenterList } from '../../company/center';
import { WholesaleCompanyDetail } from '../../company/company/services/companyService';
import { Profile } from '@/profile/types';

const WholesalerDashboard = () => {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyDetail, setCompanyDetail] = useState<WholesaleCompanyDetail | null>(null);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  // 회사 목록 조회
  const { data: existingCompanies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies,
  });

  // 도매상 회사 조회
  const { data: wholesalerCompany, refetch: refetchWholesalerCompany } = useQuery({
    queryKey: ['my-company'],
    queryFn: companyService.getMyCompany,
  });

  // 도매상 회사 상세 정보 조회
  const { data: wholesalerDetail, refetch: refetchWholesalerDetail, error: detailError } = useQuery({
    queryKey: ['wholesaler-detail', company?.id],
    queryFn: async () => {
      if (!company?.id) return null;
      try {
        return await companyService.getWholesaleCompanyDetail(company.id);
      } catch (error: any) {
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.log('Wholesale detail not found, will be created when needed');
          return null;
        }
        throw error;
      }
    },
    enabled: !!company?.id,
  });

  // 회사 생성 뮤테이션
  const createCompanyMutation = useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: async (newCompany) => {
      console.log('회사 생성 성공:', newCompany);
      setCompany(newCompany);
      
      // 캐시 무효화 및 데이터 다시 불러오기
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
      await queryClient.invalidateQueries({ queryKey: ['my-company'] });
      
      // 도매상 회사와 상세 정보 다시 불러오기
      await refetchWholesalerCompany();
      
      // 새로 생성된 회사가 도매상이면 상세 정보도 불러오기
      if (newCompany.type === CompanyType.WHOLESALER) {
        setTimeout(() => {
          refetchWholesalerDetail();
        }, 1000); // 백엔드에서 detail 생성에 시간이 걸릴 수 있으므로 잠시 대기
      }
    },
  });

  // 회사 수정 뮤테이션
  const updateCompanyMutation = useMutation({
    mutationFn: ({ companyId, data }: { companyId: string; data: Partial<Company> }) =>
      companyService.updateCompany(companyId, data),
    onSuccess: (updatedCompany) => {
      setCompany(updatedCompany);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
    },
  });

  // 도매상 상세 정보 저장 뮤테이션
  const saveDetailMutation = useMutation({
    mutationFn: companyService.upsertWholesaleCompanyDetail,
    onSuccess: (updatedDetail) => {
      setCompanyDetail(updatedDetail);
      queryClient.invalidateQueries({ queryKey: ['wholesaler-detail'] });
    },
    onError: (error) => {
      console.error('상세 정보 저장 실패:', error);
    },
  });

  // 회사 정보 설정
  useEffect(() => {
    if (wholesalerCompany) {
      console.log('도매상 회사 설정:', wholesalerCompany);
      setCompany(wholesalerCompany);
    }
  }, [wholesalerCompany]);

  // 상세 정보 설정
  useEffect(() => {
    if (wholesalerDetail) {
      console.log('도매상 상세 정보 설정:', wholesalerDetail);
      setCompanyDetail(wholesalerDetail);
    }
  }, [wholesalerDetail]);

  const handleUpdate = (updatedCompany: Company) => {
    if (company?.id) {
      updateCompanyMutation.mutate({
        companyId: company.id,
        data: updatedCompany,
      });
    }
  };

  const handleCreate = (newCompany: Omit<Company, 'id'>) => {
    console.log('회사 생성 시작:', newCompany);
    createCompanyMutation.mutate(newCompany);
  };

  const handleDetailUpdate = (updatedDetail: WholesaleCompanyDetail) => {
    if (company?.id) {
      const detailWithCompanyId = {
        ...updatedDetail,
        company_id: company.id,
      };
      saveDetailMutation.mutate(detailWithCompanyId);
    }
  };

  const handleUserSelect = (user: Profile | null) => {
    setSelectedUser(user);
    if (user) {
      console.log('선택된 사용자:', user);
    } else {
      console.log('사용자 선택 해제');
    }
  };

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
            {companyDetail && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">도매 회사 상세 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
                    <p className="mt-1 text-sm text-gray-900">{companyDetail.business_registration_number || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">주소</label>
                    <p className="mt-1 text-sm text-gray-900">{companyDetail.address || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">전화번호</label>
                    <p className="mt-1 text-sm text-gray-900">{companyDetail.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-sm text-gray-900">{companyDetail.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">대표자</label>
                    <p className="mt-1 text-sm text-gray-900">{companyDetail.representative || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">설립년도</label>
                    <p className="mt-1 text-sm text-gray-900">{companyDetail.established_year || '-'}</p>
                  </div>
                </div>
              </div>
            )}
            {detailError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                상세 정보 로드 실패: {detailError.message}
              </div>
            )}
            {saveDetailMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                상세 정보 저장 실패: {saveDetailMutation.error?.message}
              </div>
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
                  onUserSelect={handleUserSelect}
                  selectedUserId={selectedUser?.id}
                />
                
                {/* 선택된 사용자 상세 정보 */}
                {selectedUser && (
                  <div className="mt-4 bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-medium">선택된 사용자 정보</h4>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">사용자명:</span> {selectedUser.username}
                      </div>
                      <div>
                        <span className="font-medium">이름:</span> {selectedUser.name}
                      </div>
                      <div>
                        <span className="font-medium">이메일:</span> {selectedUser.email || '-'}
                      </div>
                      <div>
                        <span className="font-medium">역할:</span> 
                        <span className="ml-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {selectedUser.role || '역할 없음'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">타입:</span> {selectedUser.type}
                      </div>
                      <div>
                        <span className="font-medium">가입일:</span> {new Date(selectedUser.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
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