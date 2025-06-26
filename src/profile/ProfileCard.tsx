import React, { useState } from 'react';
import { Profile, ProfileType } from './types';
import { ProfileCreateRequest } from './profile';
import CompanySearch from '@/company/company/components/search/CompanySearch';
import { Company } from '@/company/company/types';

interface ProfileCardProps {
  profile?: Profile;
  type: ProfileType;
  onUpdate?: (profile: Profile) => void;
  onCreate?: (profile: ProfileCreateRequest) => void;
  existingProfiles?: Profile[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  type, 
  onUpdate, 
  onCreate, 
  existingProfiles = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | ProfileCreateRequest>(
    profile || {
      type,
      username: '',
      name: '',
      phone: '',
      email: '',
    }
  );

  const [errors, setErrors] = useState<{
    username?: string;
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  const validateUsername = (username: string): boolean => {
    if (!username) {
      setErrors(prev => ({ ...prev, username: '사용자명은 필수입니다.' }));
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setErrors(prev => ({ ...prev, username: '영문자와 숫자만 사용 가능합니다.' }));
      return false;
    }
    if (existingProfiles.some(p => p.username === username && (!profile || p.id !== profile.id))) {
      setErrors(prev => ({ ...prev, username: '이미 사용 중인 사용자명입니다.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, username: undefined }));
    return true;
  };

  const validateName = (name: string): boolean => {
    if (!name) return true; // 선택사항
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setErrors(prev => ({ ...prev, name: '영문자만 사용 가능합니다.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // 선택사항
    if (!/^\d+$/.test(phone)) {
      setErrors(prev => ({ ...prev, phone: '숫자만 입력 가능합니다.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: undefined }));
    return true;
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // 선택사항
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: '올바른 이메일 형식이 아닙니다.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  };

  const validateForm = (): boolean => {
    const isUsernameValid = validateUsername(editedProfile.username);
    const isNameValid = validateName(editedProfile.name || '');
    const isPhoneValid = validatePhone(editedProfile.phone || '');
    const isEmailValid = validateEmail(editedProfile.email || '');
    return isUsernameValid && isNameValid && isPhoneValid && isEmailValid;
  };

  const getProfileTypeLabel = (type: ProfileType) => {
    switch (type) {
      case ProfileType.FARMER:
        return '농부';
      case ProfileType.RETAILER:
        return '소매상';
      case ProfileType.WHOLESALER:
        return '도매상';
      default:
        return '알 수 없음';
    }
  };

  const getHeaderColor = (type: ProfileType) => {
    switch (type) {
      case ProfileType.FARMER:
        return 'bg-green-600';
      case ProfileType.RETAILER:
        return 'bg-purple-600';
      case ProfileType.WHOLESALER:
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleCompanySelect = (company: Company) => {
    setEditedProfile({
      ...editedProfile,
      company_id: company.id,
      company_name: company.name,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (profile && onUpdate) {
      onUpdate(editedProfile as Profile);
    } else if (onCreate) {
      onCreate(editedProfile as ProfileCreateRequest);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile(profile);
    } else {
      setEditedProfile({
        type,
        username: '',
        name: '',
        phone: '',
        email: '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const renderHeader = () => (
    <div className={`${getHeaderColor(type)} px-6 py-4 rounded-t-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">프로필 정보</h2>
          <p className="text-white/80 mt-1">{getProfileTypeLabel(type)}</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
          >
            {profile ? '수정' : '생성'}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">사용자명 <span className="text-red-500">*</span></p>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedProfile.username}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, username: e.target.value});
                    validateUsername(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.username || '-'}</p>
            )}
          </div>
          <div>
            <p className="text-gray-600">이름</p>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedProfile.name || ''}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, name: e.target.value});
                    validateName(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.name || '-'}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">전화번호</p>
            {isEditing ? (
              <div>
                <input
                  type="tel"
                  value={editedProfile.phone || ''}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, phone: e.target.value});
                    validatePhone(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.phone || '-'}</p>
            )}
          </div>
          <div>
            <p className="text-gray-600">이메일</p>
            {isEditing ? (
              <div>
                <input
                  type="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => {
                    setEditedProfile({...editedProfile, email: e.target.value});
                    validateEmail(e.target.value);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            ) : (
              <p className="font-medium">{profile?.email || '-'}</p>
            )}
          </div>
        </div>
        
        {/* 회사 선택 섹션 */}
        <div>
          <p className="text-gray-600">회사 선택</p>
          {isEditing ? (
            <div className="mt-2">
              <CompanySearch
                onSearch={() => {}} // 검색은 CompanySearch 내부에서 처리됨
                onSelect={handleCompanySelect}
                placeholder="회사를 검색하여 선택하세요..."
                className="w-full"
              />
              {(editedProfile as any).company_name && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    선택된 회사: <strong>{(editedProfile as any).company_name}</strong>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">회사명</p>
                <p className="font-medium">{profile?.company_name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">역할</p>
                <p className="font-medium">{profile?.role || '-'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default ProfileCard;