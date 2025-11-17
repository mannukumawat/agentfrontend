import React, { useState } from 'react';
import Modal from 'react-modal';
import CallHistoryForm from './CallHistoryForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const AddCallHistoryModal = ({ isOpen, onClose, customerId, customerName, onAdded }) => {
  const handleCallHistoryAdded = () => {
    onAdded();
    onClose();
  };

  return (
    <>
      <ToastContainer />
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Add Call History"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Add Call History for {customerName}</h2>

          <CallHistoryForm customerId={customerId} customerName={customerName} onAdded={handleCallHistoryAdded} onClose={onClose} />
        </div>
      </Modal>
    </>
  );
};

export default AddCallHistoryModal;
