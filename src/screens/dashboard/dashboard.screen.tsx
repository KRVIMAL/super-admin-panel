import React from 'react';
import Sidebar from '../../layouts/sidebar.component';
import Header from '../../layouts/header.component';
import RolesAndPermissions from '../../layouts/RolesAndPermissions';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <RolesAndPermissions />
      </div>
    </div>
  );
};

export default Dashboard;
