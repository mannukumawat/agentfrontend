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
    <div className="customer-list">
      <h2>Customers</h2>
      <div className="filters">
        <input
          placeholder="Filter by Pin Code"
          value={filters.pinCode}
          onChange={(e) => handleFilterChange('pinCode', e.target.value)}
        />
        {user.role === 'admin' && (
          <input
            placeholder="Filter by Agent ID"
            value={filters.agentId}
            onChange={(e) => handleFilterChange('agentId', e.target.value)}
          />
        )}
      </div>
      <Link to="/customers/new">Create New Customer</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Pin Code</th>
            <th>Agent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer._id}>
              <td>{customer.customerName}</td>
              <td>{customer.mobileNumbers?.[0]}</td>
              <td>{customer.emails?.[0]}</td>
              <td>{customer.pinCode}</td>
              <td>{customer.assignedAgentId?.agentName || 'Unassigned'}</td>
              <td>
                <Link to={`/customers/${customer._id}`}>View</Link>
                <Link to={`/customers/${customer._id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
