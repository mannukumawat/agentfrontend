import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, SlidersHorizontal, ChevronDown, ChevronUp, X, User, Phone, Building } from 'lucide-react';

const CustomerFilters = ({
  filters,
  onFilterChange,
  agents,
  onRefresh,
  totalCustomers
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    customerName: filters.customerName || '',
    mobileNumbers: filters.mobileNumbers || '',
    agentId: filters.agentId || '',
  });

  useEffect(() => {
    setFormData({
      customerName: filters.customerName || '',
      mobileNumbers: filters.mobileNumbers || '',
      agentId: filters.agentId || '',
    });
  }, [filters]);

  const handleApplyFilters = () => {
    onFilterChange(formData);
    setIsExpanded(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      customerName: '',
      mobileNumbers: '',
      agentId: '',
    };
    setFormData(cleared);
    onFilterChange(cleared);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const activeFiltersCount = [
    formData.customerName,
    formData.mobileNumbers,
    formData.agentId,
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Main Filter Bar */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border border-gray-300 rounded-lg p-6 shadow-sm overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-200 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '12px 12px',
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/5 via-transparent to-blue-100/5"></div>

        <div className="relative z-10">
          {/* Search and Actions Row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            {/* Search Section */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search by customer name..."
                value={formData.customerName }
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, customerName: value, });
                }}
                className="pl-10 bg-white border border-gray-300 focus:border-blue-500 h-12 rounded-md w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border border-gray-300 hover:bg-gray-50 h-12 px-4 rounded-md"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="border border-gray-300 hover:bg-gray-50 h-12 px-4 rounded-md flex items-center"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.customerName && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200">
                  <User className="h-3 w-3" />
                  <span>Name: {formData.customerName}</span>
                  <button
                    onClick={() => setFormData({ ...formData, customerName: '' })}
                    className="hover:bg-blue-200 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {formData.mobileNumbers && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm border border-green-200">
                  <Phone className="h-3 w-3" />
                  <span>Mobile: {formData.mobileNumbers}</span>
                  <button
                    onClick={() => setFormData({ ...formData, mobileNumbers: '' })}
                    className="hover:bg-green-200 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {formData.agentId && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm border border-purple-200">
                  <Building className="h-3 w-3" />
                  <span>Agent: {agents.find(a => a._id === formData.agentId)?.agentName}</span>
                  <button
                    onClick={() => setFormData({ ...formData, agentId: '' })}
                    className="hover:bg-purple-200 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="mt-4 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4 text-blue-500" />
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="bg-white border border-gray-300 focus:border-blue-500 h-12 rounded-md w-full px-3"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 text-green-500" />
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={formData.mobileNumbers}
                onChange={(e) => setFormData({ ...formData, mobileNumbers: e.target.value })}
                className="bg-white border border-gray-300 focus:border-blue-500 h-12 rounded-md w-full px-3"
              />
            </div>

            {/* Agent */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Building className="h-4 w-4 text-purple-500" />
                Agent
              </label>
              <select
                value={formData.agentId}
                onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                className="bg-white border border-gray-300 focus:border-blue-500 h-12 rounded-md w-full px-3"
              >
                <option value="">All Agents</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>{agent.agentName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-300">
            <button
              onClick={handleClearFilters}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFilters;
