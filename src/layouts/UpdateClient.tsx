import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../layouts/header.component';
import Sidebar from '../layouts/sidebar.component';
import ClientCreationForm from '../layouts/ClientCreationForm';

const UpdateClient: React.FC = () => {
  const location = useLocation();
  const { client } = location.state || {};

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Update Client</h1>
          </div>
          <ClientCreationForm isUpdate initialData={client} />
        </div>
      </div>
    </div>
  );
};

export default UpdateClient;

