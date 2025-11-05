import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ pinCode: '', agentId: '' });
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, filters]);

  const fetchCustomers = async () => {
    const params = { page: currentPage, ...filters };
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customers`, { params });
    setCustomers(res.data.customers);
    setTotalPages(res.data.totalPages);
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
        <div className="filters mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Filter by Pin Code"
              value={filters.pinCode}
              onChange={(e) => handleFilterChange('pinCode', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {user.role === 'admin' && (
              <input
                placeholder="Filter by Agent ID"
                value={filters.agentId}
                onChange={(e) => handleFilterChange('agentId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <Link to="/customers/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Create New Customer
          </Link>
        </div>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pin Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.mobileNumbers?.[0]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.emails?.[0]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.pinCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.assignedAgentId?.agentName || 'Unassigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/customers/${customer._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                    <Link to={`/customers/${customer._id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {customers.map(customer => (
            <div key={customer._id} className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-900">{customer.customerName}</h3>
              <p className="text-sm text-gray-600">Mobile: {customer.mobileNumbers?.[0]}</p>
              <p className="text-sm text-gray-600">Email: {customer.emails?.[0]}</p>
              <p className="text-sm text-gray-600">Pin Code: {customer.pinCode}</p>
              <p className="text-sm text-gray-600">Agent: {customer.assignedAgentId?.agentName || 'Unassigned'}</p>
              <div className="mt-2 space-x-2">
                <Link to={`/customers/${customer._id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">View</Link>
                <Link to={`/customers/${customer._id}/edit`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination mt-4 flex flex-wrap justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
              className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
