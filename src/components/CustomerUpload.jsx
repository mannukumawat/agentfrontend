import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FileChartColumn } from 'lucide-react';

const CustomerUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('csvFile', selectedFile);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customers/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message);
      setSelectedFile(null);
      onUploadSuccess();
    } catch (error) {
      toast.error('Error uploading CSV: ' + error.response?.data?.message || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto text-sm"
      />
      <button
        onClick={handleFileUpload}
        disabled={isUploading}
        className={`font-bold py-2 px-4 rounded w-full sm:w-auto flex items-center gap-2 ${
          isUploading
            ? 'bg-gray-500 cursor-not-allowed text-gray-300'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        <FileChartColumn size={16} />
        {isUploading ? 'Uploading...' : 'Upload CSV'}
      </button>
    </div>
  );
};

export default CustomerUpload;
