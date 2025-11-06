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

  if (!customer) return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-600">Loading...</div></div>;

  return (
    <div className="space-y-6 ">
      <div className="bg-white shadow rounded-lg ">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-900">{customer.customerName}</h2>
            <Link to={`/customers/${id}/edit`} className="mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit Customer
            </Link>
          </div>

          <div className="customer-info grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <p className="text-sm"><strong className="text-gray-700">Mobile:</strong> <span className="text-gray-900">{customer.mobileNumbers?.join(', ')}</span></p>
              <p className="text-sm"><strong className="text-gray-700">Email:</strong> <span className="text-gray-900">{customer.emails?.join(', ')}</span></p>
              <p className="text-sm"><strong className="text-gray-700">Address:</strong> <span className="text-gray-900">{customer.address}</span></p>
              <p className="text-sm"><strong className="text-gray-700">Pin Code:</strong> <span className="text-gray-900">{customer.pinCode}</span></p>
            </div>
            <div className="space-y-3">
              <p className="text-sm"><strong className="text-gray-700">Credit Score:</strong> <span className="text-gray-900">{customer.creditScore}</span></p>
              <p className="text-sm"><strong className="text-gray-700">Occupation:</strong> <span className="text-gray-900">{customer.occupation}</span></p>
              <p className="text-sm"><strong className="text-gray-700">Income:</strong> <span className="text-gray-900">{customer.income}</span></p>
              <p className="text-sm"><strong className="text-gray-700">Gender:</strong> <span className="text-gray-900">{customer.gender}</span></p>
            </div>
          </div>

          <div className="uploaded-files mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customer.aadhaarFiles?.frontUrl && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Aadhaar Front:</p>
                  <img src={customer.aadhaarFiles.frontUrl} alt="Aadhaar Front" className="w-full h-32 object-cover rounded-md" />
                </div>
              )}
              {customer.aadhaarFiles?.backUrl && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Aadhaar Back:</p>
                  <img src={customer.aadhaarFiles.backUrl} alt="Aadhaar Back" className="w-full h-32 object-cover rounded-md" />
                </div>
              )}
              {customer.panFile && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">PAN:</p>
                  <img src={customer.panFile} alt="PAN" className="w-full h-32 object-cover rounded-md" />
                </div>
              )}
              {customer.selfie && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selfie:</p>
                  <img src={customer.selfie} alt="Selfie" className="w-full h-32 object-cover rounded-md" />
                </div>
              )}
              {customer.incomeProofFiles?.map((file, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Income Proof {index + 1}:</p>
                  <img src={file} alt={`Income Proof ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                </div>
              ))}
            </div>
          </div>

          <div className="call-history">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Call History</h3>
              <button
                onClick={() => setShowCallForm(!showCallForm)}
                className="mt-2 sm:mt-0 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {showCallForm ? 'Cancel' : 'Add Call History'}
              </button>
            </div>
            {showCallForm && (
              <div className="mb-6">
                <CallHistoryForm customerId={id} onAdded={handleCallHistoryAdded} />
              </div>
            )}
            <div className="space-y-4">
              {callHistories.map(call => (
                <div key={call._id} className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm"><strong className="text-gray-700">Date:</strong> <span className="text-gray-900">{new Date(call.callTime).toLocaleString()}</span></p>
                      <p className="text-sm"><strong className="text-gray-700">Agent:</strong> <span className="text-gray-900">{call.agentId?.agentName}</span></p>
                      <p className="text-sm"><strong className="text-gray-700">Interested:</strong> <span className="text-gray-900">{call.interested ? 'Yes' : 'No'}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><strong className="text-gray-700">Disposition:</strong> <span className="text-gray-900">{call.disposition}</span></p>
                      <p className="text-sm"><strong className="text-gray-700">Attended:</strong> <span className="text-gray-900">{call.attended ? 'Yes' : 'No'}</span></p>
                      {call.nextCallDateTime && (
                        <p className="text-sm"><strong className="text-gray-700">Next Call:</strong> <span className="text-gray-900">{new Date(call.nextCallDateTime).toLocaleString()}</span></p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-2"><strong className="text-gray-700">Notes:</strong> <span className="text-gray-900">{call.notes}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
