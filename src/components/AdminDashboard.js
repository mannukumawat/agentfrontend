import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [agentForm, setAgentForm] = useState({
    agentName: '', agentId: '', email: '', mobile: '', password: ''
  });
  const { logout } = useAuth();

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

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/agents`, agentForm);
    setAgentForm({ agentName: '', agentId: '', email: '', mobile: '', password: '' });
    setShowAgentForm(false);
    fetchAgents();
  };

  const handleAssignCustomer = async (customerId, agentId) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/customers/${customerId}/assign`, { agentId });
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Agents</h2>
              <button
                onClick={() => setShowAgentForm(!showAgentForm)}
                className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {showAgentForm ? 'Cancel' : 'Create Agent'}
              </button>
              {showAgentForm && (
                <form onSubmit={handleCreateAgent} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Agent Name"
                      value={agentForm.agentName}
                      onChange={(e) => setAgentForm({...agentForm, agentName: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Agent ID"
                      value={agentForm.agentId}
                      onChange={(e) => setAgentForm({...agentForm, agentId: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={agentForm.email}
                      onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Mobile"
                      value={agentForm.mobile}
                      onChange={(e) => setAgentForm({...agentForm, mobile: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={agentForm.password}
                      onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Create
                  </button>
                </form>
              )}
              <ul className="space-y-2">
                {agents.map(agent => (
                  <li key={agent._id} className="bg-gray-50 p-3 rounded-md">
                    {agent.agentName} ({agent.agentId})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customers</h2>
              <div className="space-x-2 mb-4">
                <Link to="/customers/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Create Customer
                </Link>
                <Link to="/customers" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  View All Customers
                </Link>
              </div>
              <ul className="space-y-2">
                {customers.slice(0, 10).map(customer => (
                  <li key={customer._id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                    <span>{customer.customerName}</span>
                    <select
                      value={customer.assignedAgentId?._id || ''}
                      onChange={(e) => handleAssignCustomer(customer._id, e.target.value)}
                      className="ml-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>{agent.agentName}</option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
