import React from 'react';
import Sidebar from '../../layouts/sidebar.component';
import Header from '../../layouts/header.component';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="width-100">
        <Sidebar />
      </div>
    </div>
  );
};

export default Dashboard;
