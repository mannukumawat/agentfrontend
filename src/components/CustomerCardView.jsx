import { Link } from 'react-router-dom';

const CustomerCardView = ({ customers, agents, user, handleAssignCustomer, handleUnassignCustomer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map(customer => (
        <div key={customer._id} className="bg-gray-100 p-4 rounded-md shadow-sm">

          <h3 className="text-lg font-semibold">{customer.customerName}</h3>

          <p
            className="text-sm text-blue-600 font-medium cursor-pointer"
            onClick={() => window.location.href = `tel:${customer.mobileNumbers?.[0]}`}
          >
            📞 {customer.mobileNumbers?.[0]}
          </p>

          <p className="text-sm text-gray-600">📧 {customer.emails?.[0]}</p>
          <p className="text-sm text-gray-600">📍 {customer.pinCode}</p>

          <div className="mt-3">
            <label className="text-sm text-gray-700 font-medium">Assign Agent:</label>
            {user.role === 'admin' ? (
              <select
                value={customer.assignedAgentId?._id || ''}
                onChange={(e) => e.target.value === '' ? handleUnassignCustomer(customer._id) : handleAssignCustomer(customer._id, e.target.value)}
                className="mt-1 w-full px-2 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Unassigned</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>{agent.agentName}</option>
                ))}
              </select>
            ) : (
              <select
                value={customer.assignedAgentId?._id || ''}
                disabled
                className="mt-1 w-full px-2 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
              >
                <option value="">{customer.assignedAgentId?.agentName || 'Unassigned'}</option>
              </select>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <Link to={`/customers/${customer._id}`} className="bg-blue-500 text-white py-1 px-3 rounded text-sm">
              View
            </Link>
            <Link to={`/customers/${customer._id}/add-call-history`} className="bg-green-500 text-white py-1 px-3 rounded text-sm">
              Add Call History
            </Link>
            {user.role === 'admin' && (
              <Link to={`/customers/${customer._id}/edit`} className="bg-yellow-500 text-white py-1 px-3 rounded text-sm">
                Edit
              </Link>
            )}
          </div>

        </div>
      ))}
    </div>
  );
};

export default CustomerCardView;
