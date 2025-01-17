import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Client {
  _id: string;
  name: string;
  email: string;
  apiKey: string;
  apiKeyExpiresAt: string;
}

interface ClientTableProps {
  searchQuery: string;
}

const ClientTable: React.FC<ClientTableProps> = ({ searchQuery }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3030/gateway/listClient',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2NlZjM3MWQxYWZlYzhkYzljMGFhMCIsIm5hbWUiOiJNYWxhdiBOYWFnYXIiLCJlbWFpbCI6Im1hbGF2bmFnYXI5MEBnbWFpbC5jb20iLCJyb2xlIjpbImFkbWluIiwiZWRpdG9yIl0sImlhdCI6MTczNzEwODQ0MSwiZXhwIjoxNzM3MTEyMDQxfQ.-VmhUx1rKt5JuZajXEtGJmI-BbxJjbrUeCyM0kA3bk4'
          },
        }
      );
      const data = await response.data;

      if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.error('Expected an array but got:', data);
        setClients([]); // Set to an empty array if data is not an array
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  // Filter clients based on search query
  const filteredClients = clients?.filter(
    (client) =>
      client?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      client?.email?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const handleCreateClient = () => {
    navigate('/create-client');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Clients</h2>
        <button
          onClick={handleCreateClient}
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Create Client
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                API Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Expires At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentItems.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">{client.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{client.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-mono text-sm">{client.apiKey}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(client.apiKeyExpiresAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstItem + 1} to{' '}
          {Math.min(indexOfLastItem, filteredClients.length)} of{' '}
          {filteredClients.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
