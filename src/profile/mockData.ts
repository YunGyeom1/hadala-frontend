import { Profile, ProfileType, ProfileRole } from './types';

export const mockProfiles: Record<ProfileType, Profile> = {
  [ProfileType.FARMER]: {
    id: '1',
    username: '김농부',
    type: ProfileType.FARMER,
    role: ProfileRole.USER,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z'
  },
  [ProfileType.RETAILER]: {
    id: '2',
    username: '이소매',
    type: ProfileType.RETAILER,
    role: ProfileRole.USER,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z'
  },
  [ProfileType.WHOLESALER]: {
    id: '3',
    username: '박도매',
    type: ProfileType.WHOLESALER,
    role: ProfileRole.USER,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z'
  },
  [ProfileType.TESTER]: {
    id: '4',
    username: '최테스터',
    type: ProfileType.TESTER,
    role: ProfileRole.USER,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z'
  }
}; 