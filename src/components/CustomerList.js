import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ pinCode: '', agentId: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
    fetchAgents();
  }, [currentPage, filters]);

  const fetchCustomers = async () => {
    const params = { page: currentPage, ...filters };
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customers`, { params });
    setCustomers(res.data.customers);
    setTotalPages(res.data.totalPages);
  };

  const fetchAgents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/agents`);
    setAgents(res.data);
  };

  const handleAssignCustomer = async (customerId, agentId) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/customers/${customerId}/assign`, { agentId });
    fetchCustomers();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customers</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Filter by Pin Code"
            value={filters.pinCode}
            onChange={(e) => handleFilterChange('pinCode', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          {user.role === 'admin' && (
            <input
              placeholder="Filter by Agent ID"
              value={filters.agentId}
              onChange={(e) => handleFilterChange('agentId', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          )}
        </div>

        <div className="mb-4">
          <Link to="/customers/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Create New Customer
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Pin Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Assign Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td className="px-6 py-4">{customer.customerName}</td>

                  {/* ✅ MOBILE NUMBER CLICK → DIALER OPEN */}
                  <td
                    className="px-6 py-4 text-blue-600 cursor-pointer"
                    onClick={() => window.location.href = `tel:${customer.mobileNumbers?.[0]}`}
                  >
                    {customer.mobileNumbers?.[0]}
                  </td>

                  <td className="px-6 py-4">{customer.emails?.[0]}</td>
                  <td className="px-6 py-4">{customer.pinCode}</td>

                  {/* Assign Agent Dropdown */}
                  <td className="px-6 py-4">
                    <select
                      value={customer.assignedAgentId?._id || ''}
                      onChange={(e) => handleAssignCustomer(customer._id, e.target.value)}
                      className="px-2 py-1 border rounded-md"
                    >
                      <option value="">Unassigned</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>{agent.agentName}</option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <Link to={`/customers/${customer._id}`} className="text-blue-600 mr-4">View</Link>
                    <Link to={`/customers/${customer._id}/edit`} className="text-yellow-600">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* ✅ MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
          {customers.map(customer => (
            <div key={customer._id} className="bg-gray-100 p-4 rounded-md shadow-sm">

              <h3 className="text-lg font-semibold">{customer.customerName}</h3>

              {/* ✅ Tap Mobile Number to Call */}
              <p
                className="text-sm text-blue-600 font-medium cursor-pointer"
                onClick={() => window.location.href = `tel:${customer.mobileNumbers?.[0]}`}
              >
                📞 {customer.mobileNumbers?.[0]}
              </p>

              <p className="text-sm text-gray-600">📧 {customer.emails?.[0]}</p>
              <p className="text-sm text-gray-600">📍 {customer.pinCode}</p>

              {/* Assign Agent */}
              <div className="mt-3">
                <label className="text-sm text-gray-700 font-medium">Assign Agent:</label>
                <select
                  value={customer.assignedAgentId?._id || ''}
                  onChange={(e) => handleAssignCustomer(customer._id, e.target.value)}
                  className="mt-1 w-full px-2 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.agentName}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex gap-2">
                <Link to={`/customers/${customer._id}`} className="bg-blue-500 text-white py-1 px-3 rounded text-sm">
                  View
                </Link>
                <Link to={`/customers/${customer._id}/edit`} className="bg-yellow-500 text-white py-1 px-3 rounded text-sm">
                  Edit
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
              className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              {page}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CustomerList;
