import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AgentDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customers`);
    setCustomers(res.data.customers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Dashboard - {user?.agentName}</h1>

          <div className="mb-4">
            <div className="flex space-x-2">
              <Link to="/customers/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Create Customer
              </Link>
              <Link to="/customers" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View All My Customers
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">My Customers</h2>
            <ul className="space-y-2">
              {customers.map(customer => (
                <li key={customer._id} className="bg-gray-50 p-3 rounded-md hover:bg-gray-100">
                  <Link to={`/customers/${customer._id}`} className="text-blue-600 hover:text-blue-800">
                    {customer.customerName} - {customer.pinCode}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
