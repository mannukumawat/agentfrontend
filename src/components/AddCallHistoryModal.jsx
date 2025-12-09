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
  style={{
    overlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1000,
    },
    content: {
      inset: "unset",
      background: "transparent",
      border: "none",
      padding: 0,
    },
  }}
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
