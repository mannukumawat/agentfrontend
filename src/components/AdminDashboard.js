import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserPlus, Users,  UserCog, User } from 'lucide-react';

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    fetchAgents();
    fetchCustomers();
  }, []);

  const fetchAgents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/agents`);
    setAgents(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customers`);
    setCustomers(res.data.customers);
  };


  const handleAssignCustomer = async (customerId, agentId) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/customers/${customerId}/assign`, { agentId });
    fetchCustomers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto mt-10 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-blue-600" />
            Calling Dashboard
          </h1>
          
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-8 px-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition">
            <div>
              <p className="text-gray-500 text-sm">Total Agents</p>
              <p className="text-2xl font-bold text-gray-800">{agents.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="text-blue-600 w-6 h-6" />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-600 w-6 h-6" />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition">
            <div>
              <p className="text-gray-500 text-sm">Unassigned Customers</p>
              <p className="text-2xl font-bold text-gray-800">
                {customers.filter(c => !c.assignedAgentId).length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <UserPlus className="text-yellow-600 w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      

          {/* Customers Section */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Customers
              </h2>
              <div className="space-x-2">
                <Link
                  to="/customers/new"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                >
                  New
                </Link>
                <Link
                  to="/customers"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  View All
                </Link>
              </div>
            </div>

            <ul className="divide-y divide-gray-200">
              {customers.slice(0, 10).map(customer => (
                <li key={customer._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{customer.customerName}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <select
                    value={customer.assignedAgentId?._id || ''}
                    onChange={(e) => handleAssignCustomer(customer._id, e.target.value)}
                    className="ml-2 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.agentName}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
