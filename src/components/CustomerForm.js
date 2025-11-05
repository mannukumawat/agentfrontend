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
    <div className="customer-form">
      <h2>{isEdit ? 'Edit Customer' : 'Create Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name:</label>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Mobile Numbers:</label>
          {formData.mobileNumbers.map((mobile, index) => (
            <input
              key={index}
              value={mobile}
              onChange={(e) => handleArrayChange('mobileNumbers', index, e.target.value)}
            />
          ))}
          <button type="button" onClick={() => addArrayField('mobileNumbers')}>Add Mobile</button>
        </div>

        <div>
          <label>Emails:</label>
          {formData.emails.map((email, index) => (
            <input
              key={index}
              type="email"
              value={email}
              onChange={(e) => handleArrayChange('emails', index, e.target.value)}
            />
          ))}
          <button type="button" onClick={() => addArrayField('emails')}>Add Email</button>
        </div>

        <div>
          <label>Credit Score:</label>
          <input
            name="creditScore"
            type="number"
            value={formData.creditScore}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Pin Code:</label>
          <input
            name="pinCode"
            value={formData.pinCode}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Occupation:</label>
          <select name="occupation" value={formData.occupation} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="salary">Salary</option>
            <option value="non-salary">Non-Salary</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Income:</label>
          <input
            name="income"
            type="number"
            value={formData.income}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Date of Birth:</label>
          <input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Aadhaar Number:</label>
          <input
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>PAN Number:</label>
          <input
            name="panNumber"
            value={formData.panNumber}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Aadhaar Front:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange('aadhaarFiles.frontUrl', e.target.files[0])}
          />
        </div>

        <div>
          <label>Aadhaar Back:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange('aadhaarFiles.backUrl', e.target.files[0])}
          />
        </div>

        <div>
          <label>PAN File:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange('panFile', e.target.files[0])}
          />
        </div>

        <div>
          <label>Selfie:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange('selfie', e.target.files[0])}
          />
        </div>

        <div>
          <label>Income Proof Files:</label>
          {formData.incomeProofFiles.map((file, index) => (
            <input
              key={index}
              type="file"
              onChange={(e) => handleFileChange(`incomeProofFiles.${index}`, e.target.files[0])}
            />
          ))}
          <button type="button" onClick={() => addArrayField('incomeProofFiles')}>Add File</button>
        </div>

        <button type="submit">{isEdit ? 'Update' : 'Create'} Customer</button>
      </form>
    </div>
  );
};

export default CustomerForm;
