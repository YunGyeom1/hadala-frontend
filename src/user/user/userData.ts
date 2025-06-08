import type { UserProfile } from './user';

export const mockUserProfile: UserProfile = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "user@example.com",
  name: "John Doe",
  picture_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
};

export const mockUsers: UserProfile[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "user@example.com",
    name: "John Doe",
    picture_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    email: "jane@example.com",
    name: "Jane Smith",
    picture_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    email: "bob@example.com",
    name: "Bob Johnson",
    picture_url: null
  }
];