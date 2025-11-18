import React, { useState } from 'react';

const DialogContext = React.createContext();

const Dialog = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, className, ...props }) => {
  const { setOpen } = React.useContext(DialogContext);

  return (
    <button
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
};

const DialogContent = ({ children, className, ...props }) => {
  const { open, setOpen } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full ${className}`}
        {...props}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
