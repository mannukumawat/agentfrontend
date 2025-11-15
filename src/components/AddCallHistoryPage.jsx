import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CallHistoryForm from './CallHistoryForm';

const AddCallHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCallHistoryAdded = () => {
    navigate(`/customers/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Add Call History</h2>
      <CallHistoryForm customerId={id} onAdded={handleCallHistoryAdded} />
    </div>
  );
};

export default AddCallHistoryPage;
