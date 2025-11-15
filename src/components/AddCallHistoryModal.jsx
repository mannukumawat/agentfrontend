import React, { useState } from 'react';
import Modal from 'react-modal';
import CallHistoryForm from './CallHistoryForm';

Modal.setAppElement('#root');

const AddCallHistoryModal = ({ isOpen, onClose, customerId, customerName, onAdded }) => {
  const handleCallHistoryAdded = () => {
    onAdded();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Call History"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Add Call History for {customerName}</h2>
        <CallHistoryForm customerId={customerId} onAdded={handleCallHistoryAdded} />
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default AddCallHistoryModal;
