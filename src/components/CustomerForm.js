import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumbers: [''],
    emails: [''],
    creditScore: '',
    address: '',
    pinCode: '',
    gender: '',
    occupation: '',
    income: '',
    dob: '',
    aadhaarNumber: '',
    panNumber: '',
    aadhaarFiles: { frontUrl: '', backUrl: '' },
    panFile: '',
    selfie: '',
    incomeProofFiles: [''],
  });
  const [files, setFiles] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customers/${id}`);
    setFormData(res.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleFileChange = (field, file) => {
    setFiles({ ...files, [field]: file });
  };

  const uploadFile = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/uploads`, formDataUpload);
    return res.data.fileUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload files and get URLs
    const fileUrls = {};
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        fileUrls[key] = await uploadFile(file);
      }
    }

    const customerData = { ...formData, ...fileUrls };

    if (isEdit) {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/customers/${id}`, customerData);
    } else {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/customers`, customerData);
    }

    navigate('/customers');
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Customer' : 'Create Customer'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name:</label>
              <input
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score:</label>
              <input
                name="creditScore"
                type="number"
                value={formData.creditScore}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Numbers:</label>
            {formData.mobileNumbers.map((mobile, index) => (
              <input
                key={index}
                value={mobile}
                onChange={(e) => handleArrayChange('mobileNumbers', index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
            ))}
            <button type="button" onClick={() => addArrayField('mobileNumbers')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
              Add Mobile
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emails:</label>
            {formData.emails.map((email, index) => (
              <input
                key={index}
                type="email"
                value={email}
                onChange={(e) => handleArrayChange('emails', index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
            ))}
            <button type="button" onClick={() => addArrayField('emails')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
              Add Email
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code:</label>
              <input
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation:</label>
              <select name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="salary">Salary</option>
                <option value="non-salary">Non-Salary</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Income:</label>
              <input
                name="income"
                type="number"
                value={formData.income}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth:</label>
              <input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number:</label>
              <input
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number:</label>
              <input
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Front:</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('aadhaarFiles.frontUrl', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Back:</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('aadhaarFiles.backUrl', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN File:</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('panFile', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selfie:</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('selfie', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Income Proof Files:</label>
            {formData.incomeProofFiles.map((file, index) => (
              <input
                key={index}
                type="file"
                onChange={(e) => handleFileChange(`incomeProofFiles.${index}`, e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
            ))}
            <button type="button" onClick={() => addArrayField('incomeProofFiles')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
              Add File
            </button>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              {isEdit ? 'Update' : 'Create'} Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
