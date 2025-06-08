import React, { useState } from 'react';
import { mockUserProfile } from '../user/user/userData';
import { mockRetailer } from '../user/retailer/retailerData';
import { mockWholesaler } from '../user/wholesaler/wholesalerData';
import { mockFarmer } from '../user/farmer/farmerData';
import ProfileInfo from '../user/user/ProfileInfo';
import RetailerInfo from '../user/retailer/RetailerInfo';
import WholesalerInfo from '../user/wholesaler/WholesalerInfo';
import FarmerInfo from '../user/farmer/FarmerInfo';
import type { UserProfile } from '../user/user/user';
import type { Retailer } from '../user/retailer/retailer';
import type { Wholesaler } from '../user/wholesaler/wholesaler';
import type { Farmer } from '../user/farmer/farmer';

const Profile = () => {
  const [user, setUser] = useState<UserProfile>(mockUserProfile);
  const [retailer, setRetailer] = useState<Retailer>(mockRetailer);
  const [wholesaler, setWholesaler] = useState<Wholesaler>(mockWholesaler);
  const [farmer, setFarmer] = useState<Farmer>(mockFarmer);

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleUpdateRetailer = (updatedRetailer: Retailer) => {
    setRetailer(updatedRetailer);
  };

  const handleUpdateWholesaler = (updatedWholesaler: Wholesaler) => {
    setWholesaler(updatedWholesaler);
  };

  const handleUpdateFarmer = (updatedFarmer: Farmer) => {
    setFarmer(updatedFarmer);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <ProfileInfo user={user} onUpdate={handleUpdateProfile} />
            </div>
          </div>
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <RetailerInfo retailer={retailer} onUpdate={handleUpdateRetailer} />
            </div>
          </div>
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <WholesalerInfo wholesaler={wholesaler} onUpdate={handleUpdateWholesaler} />
            </div>
          </div>
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <FarmerInfo farmer={farmer} onUpdate={handleUpdateFarmer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
