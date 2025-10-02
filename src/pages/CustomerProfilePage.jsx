import React from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import ProfileCard from '../component/CustomerProfile/ProfileCard';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex flex-col items-center mt-10 px-4 relative pb-20">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
        <ProfileCard />
        
      </main>
    </div>
  );
};

export default ProfilePage;