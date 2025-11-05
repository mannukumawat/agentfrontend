import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import CallHistoryForm from './CallHistoryForm';

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [callHistories, setCallHistories] = useState([]);
  const [showCallForm, setShowCallForm] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchCustomer();
    fetchCallHistories();
  }, [id]);

  const fetchCustomer = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customers/${id}`);
    setCustomer(res.data);
  };

  const fetchCallHistories = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/call-histories`, { params: { customerId: id } });
    setCallHistories(res.data);
  };

  const handleCallHistoryAdded = () => {
    setShowCallForm(false);
    fetchCallHistories();
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="customer-detail">
      <h2>{customer.customerName}</h2>
      <Link to={`/customers/${id}/edit`}>Edit Customer</Link>

      <div className="customer-info">
        <p><strong>Mobile:</strong> {customer.mobileNumbers?.join(', ')}</p>
        <p><strong>Email:</strong> {customer.emails?.join(', ')}</p>
        <p><strong>Address:</strong> {customer.address}</p>
        <p><strong>Pin Code:</strong> {customer.pinCode}</p>
        <p><strong>Credit Score:</strong> {customer.creditScore}</p>
        <p><strong>Occupation:</strong> {customer.occupation}</p>
        <p><strong>Income:</strong> {customer.income}</p>
      </div>

      <div className="uploaded-files">
        <h3>Uploaded Files</h3>
        {customer.aadhaarFiles?.frontUrl && (
          <div>
            <strong>Aadhaar Front:</strong>
            <img src={customer.aadhaarFiles.frontUrl} alt="Aadhaar Front" width="200" />
          </div>
        )}
        {customer.aadhaarFiles?.backUrl && (
          <div>
            <strong>Aadhaar Back:</strong>
            <img src={customer.aadhaarFiles.backUrl} alt="Aadhaar Back" width="200" />
          </div>
        )}
        {customer.panFile && (
          <div>
            <strong>PAN:</strong>
            <img src={customer.panFile} alt="PAN" width="200" />
          </div>
        )}
        {customer.selfie && (
          <div>
            <strong>Selfie:</strong>
            <img src={customer.selfie} alt="Selfie" width="200" />
          </div>
        )}
        {customer.incomeProofFiles?.map((file, index) => (
          <div key={index}>
            <strong>Income Proof {index + 1}:</strong>
            <img src={file} alt={`Income Proof ${index + 1}`} width="200" />
          </div>
        ))}
      </div>

      <div className="call-history">
        <h3>Call History</h3>
        <button onClick={() => setShowCallForm(!showCallForm)}>
          {showCallForm ? 'Cancel' : 'Add Call History'}
        </button>
        {showCallForm && (
          <CallHistoryForm customerId={id} onAdded={handleCallHistoryAdded} />
        )}
        <ul>
          {callHistories.map(call => (
            <li key={call._id}>
              <p><strong>Date:</strong> {new Date(call.callTime).toLocaleString()}</p>
              <p><strong>Agent:</strong> {call.agentId?.agentName}</p>
              <p><strong>Interested:</strong> {call.interested ? 'Yes' : 'No'}</p>
              <p><strong>Disposition:</strong> {call.disposition}</p>
              <p><strong>Attended:</strong> {call.attended ? 'Yes' : 'No'}</p>
              <p><strong>Notes:</strong> {call.notes}</p>
              {call.nextCallDateTime && (
                <p><strong>Next Call:</strong> {new Date(call.nextCallDateTime).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerDetail;
