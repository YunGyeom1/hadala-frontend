import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProfileCard from '@/profile/ProfileCard';
import { profileService, ProfileCreateRequest } from '@/profile/profile';
import { type Profile, ProfileType } from '@/profile/types';

const Profile = () => {
  const queryClient = useQueryClient();

  // Get my profile list
  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['myProfiles'],
    queryFn: profileService.getMyProfiles,
  });

  // Profile creation mutation
  const createProfileMutation = useMutation({
    mutationFn: (newProfile: ProfileCreateRequest) => profileService.createProfile(newProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfiles'] });
    },
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileService.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfiles'] });
    },
  });

  const handleUpdateProfile = (updatedProfile: Profile) => {
    updateProfileMutation.mutate({
      id: updatedProfile.id,
      data: {
        username: updatedProfile.username,
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        email: updatedProfile.email,
        company_id: updatedProfile.company_id,
        company_name: updatedProfile.company_name,
      },
    });
  };

  const handleCreateProfile = (newProfile: ProfileCreateRequest) => {
    createProfileMutation.mutate(newProfile);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          An error occurred while loading profiles.
        </div>
      </div>
    );
  }

  // Group profiles by type
  const profilesByType = {
    farmer: profiles.find(p => p.type === ProfileType.FARMER),
    retailer: profiles.find(p => p.type === ProfileType.RETAILER),
    wholesaler: profiles.find(p => p.type === ProfileType.WHOLESALER),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileCard
          type={ProfileType.FARMER}
          profile={profilesByType.farmer}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={profiles}
        />
        <ProfileCard
          type={ProfileType.WHOLESALER}
          profile={profilesByType.wholesaler}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={profiles}
        />
        <ProfileCard
          type={ProfileType.RETAILER}
          profile={profilesByType.retailer}
          onUpdate={handleUpdateProfile}
          onCreate={handleCreateProfile}
          existingProfiles={profiles}
        />
      </div>
    </div>
  );
};

export default Profile;
