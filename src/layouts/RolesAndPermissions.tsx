import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ClientTable from "./ClientTable";

const RolesAndPermissions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isClientList = location.pathname === "/clients";

  return (
    <div className="flex-1 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Role and Permission Management
        </h1>
      </div>
      
      {isClientList && (
        <div className="space-y-6">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ClientTable searchQuery={searchQuery} />
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissions;

