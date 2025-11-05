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
    <div className="dashboard">
      <header>
        <h1>Agent Dashboard - {user?.agentName}</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="dashboard-content">
        <section>
          <h2>My Customers</h2>
          <Link to="/customers/new">Create Customer</Link>
          <Link to="/customers">View All My Customers</Link>
          <ul>
            {customers.map(customer => (
              <li key={customer._id}>
                <Link to={`/customers/${customer._id}`}>
                  {customer.customerName} - {customer.pinCode}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AgentDashboard;
