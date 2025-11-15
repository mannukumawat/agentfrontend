import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerTableView from './CustomerTableView';
import CustomerCardView from './CustomerCardView';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ pinCode: '', agentId: '', customerName: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [totalCustomers, setTotalCustomers] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
    fetchAgents();
  }, [currentPage, filters, user.role]);

  const fetchCustomers = async () => {
    const params = { page: currentPage, ...filters };
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customers`, { params });
    setCustomers(res.data.customers);
    setTotalPages(res.data.totalPages);
    setTotalCustomers(res.data.totalCount);
  };

  const fetchAgents = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/agents`);
    setAgents(res.data);
  };

  const handleAssignCustomer = async (customerId, agentId) => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customers/${customerId}/assign`, { agentId });
    fetchCustomers();
  };

  const handleUnassignCustomer = async (customerId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customers/${customerId}/unassign`);
      toast.success('Customer unassigned successfully');
      fetchCustomers();
    } catch (error) {
      toast.error('Error unassigning customer: ' + error.response?.data?.message || error.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('csvFile', selectedFile);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customers/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message);
      setSelectedFile(null);
      fetchCustomers();
    } catch (error) {
      toast.error('Error uploading CSV: ' + error.response?.data?.message || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Smart Pagination Function
  const renderSmartPagination = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, idx) => (
      <button
        key={idx}
        onClick={() => page !== "..." && handlePageChange(page)}
        disabled={page === "..." || page === currentPage}
        className={`px-3 py-1 rounded 
          ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
      >
        {page}
      </button>
    ));
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-white shadow rounded-lg mt-12">
        <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customers ({totalCustomers})</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Filter by Customer Name"
            value={filters.customerName}
            onChange={(e) => handleFilterChange('customerName', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            placeholder="Filter by Pin Code"
            value={filters.pinCode}
            onChange={(e) => handleFilterChange('pinCode', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={filters.agentId}
            onChange={(e) => handleFilterChange('agentId', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Agents</option>
            {agents.map(agent => (
              <option key={agent._id} value={agent._id}>{agent.agentName}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          {user.role === 'admin' && (
            <>
              <Link to="/customers/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Create New Customer
              </Link>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
                />
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className={`font-bold py-2 px-4 rounded w-full sm:w-auto ${
                    isUploading
                      ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                      : 'bg-blue-500 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Upload CSV'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* View Mode Tabs */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded ${
              viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded ${
              viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            Card View
          </button>
        </div>

        {/* Conditional Rendering based on viewMode */}
        {viewMode === 'table' && (
          <CustomerTableView
            customers={customers}
            agents={agents}
            user={user}
            handleAssignCustomer={handleAssignCustomer}
            handleUnassignCustomer={handleUnassignCustomer}
          />
        )}

        {viewMode === 'card' && (
          <CustomerCardView
            customers={customers}
            agents={agents}
            user={user}
            handleAssignCustomer={handleAssignCustomer}
            handleUnassignCustomer={handleUnassignCustomer}
          />
        )}

        {/* ✅ Smart Pagination */}
        <div className="mt-4 flex justify-center space-x-2">
          {renderSmartPagination()}
        </div>

        </div>
      </div>
    </>
  );
};

export default CustomerList;
