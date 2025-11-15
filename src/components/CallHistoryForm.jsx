import React, { useState } from 'react';
import axios from 'axios';

const CallHistoryForm = ({ customerId, customerName, onAdded }) => {
  const [formData, setFormData] = useState({
    interested: false,
    disposition: '',
    nextCallDateTime: '',
    attended: false,
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/call-histories`, { ...formData, customerId });
    onAdded();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md mt-10">
      {customerName && (
        <div className="mb-4 mb-10">
          <p className="text-xl font-medium text-gray-700">Customer: <span className="text-gray-900">{customerName}</span></p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="attended"
              name="attended"
              checked={formData.attended}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="attended" className="ml-2 block text-sm text-gray-900">
              Attended
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="interested"
              name="interested"
              checked={formData.interested}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="interested" className="ml-2 block text-sm text-gray-900">
              Interested
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="disposition" className="block text-sm font-medium text-gray-700 mb-1">Disposition:</label>
          <input
            id="disposition"
            name="disposition"
            value={formData.disposition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nextCallDateTime" className="block text-sm font-medium text-gray-700 mb-1">Next Call Date & Time:</label>
          <input
            id="nextCallDateTime"
            type="datetime-local"
            name="nextCallDateTime"
            value={formData.nextCallDateTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Call History
          </button>
        </div>
      </form>
    </div>
  );
};

export default CallHistoryForm;
