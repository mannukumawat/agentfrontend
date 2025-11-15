import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CallHistoryForm from './CallHistoryForm';

const AddCallHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customers/${id}`);
        setCustomerName(res.data.customerName);
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleCallHistoryAdded = () => {
    navigate(`/customers/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Add Call History</h2>
      <CallHistoryForm customerId={id} customerName={customerName} onAdded={handleCallHistoryAdded} />
    </div>
  );
};

export default AddCallHistoryPage;
