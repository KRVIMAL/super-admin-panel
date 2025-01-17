import React from 'react';
import Header from '../layouts/header.component';
import Sidebar from '../layouts/sidebar.component';
import ClientCreationForm from '../layouts/ClientCreationForm';

const CreateClient: React.FC = () => {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Create Client</h1>
          </div>
          <ClientCreationForm />
        </div>
      </div>
    </div>
  );
};

export default CreateClient;

