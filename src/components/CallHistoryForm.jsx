import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const CallHistoryForm = ({ customerId, customerName, onAdded, onClose }) => {
  const [formData, setFormData] = useState({
    interested: false,
    disposition: "",
    nextCallDateTime: "",
    attended: false,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/call-histories`,
        { ...formData, customerId }
      );
      toast.success('Call history saved successfully!');
      onAdded();
    } catch (error) {
      toast.error('Error saving call history: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>

      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* CHECKBOXES */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="attended"
              checked={formData.attended}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-sm">Attended</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="interested"
              checked={formData.interested}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-sm">Interested</span>
          </label>
        </div>

        {/* DISPOSITION */}
        <div>
          <label className="text-sm font-medium">Disposition</label>
          <input
            name="disposition"
            value={formData.disposition}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter disposition"
          />
        </div>

        {/* DATE */}
        <div>
          <label className="text-sm font-medium">Next Call Date & Time</label>
          <input
            type="datetime-local"
            name="nextCallDateTime"
            value={formData.nextCallDateTime}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* NOTES */}
        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Write call notes here..."
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Save Call History
        </button>
      </form>
    </>
  );
};

export default CallHistoryForm;
