import React, { useState } from 'react';
import axios from 'axios';

const CallHistoryForm = ({ customerId, onAdded }) => {
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
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/call-histories`, { ...formData, customerId });
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="call-history-form">
      <div>
        <label>
          <input
            type="checkbox"
            name="attended"
            checked={formData.attended}
            onChange={handleChange}
          />
          Attended
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="interested"
            checked={formData.interested}
            onChange={handleChange}
          />
          Interested
        </label>
      </div>

      <div>
        <label>Disposition:</label>
        <input
          name="disposition"
          value={formData.disposition}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Next Call Date & Time:</label>
        <input
          type="datetime-local"
          name="nextCallDateTime"
          value={formData.nextCallDateTime}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Notes:</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Add Call History</button>
    </form>
  );
};

export default CallHistoryForm;
