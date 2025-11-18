import React from 'react';

const PageHeader = ({ title, actions }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold capitalize">{title}</h1>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
