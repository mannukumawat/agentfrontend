import { Link } from 'react-router-dom';

const CustomerTableView = ({ customers, agents, user, handleAssignCustomer, handleUnassignCustomer }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Mobile</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Assign Agent</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map(customer => (
            <tr key={customer._id}>
              <td className="px-6 py-4">{customer.customerName}</td>
              <td
                className="px-6 py-4 text-blue-600 cursor-pointer"
                onClick={() => window.location.href = `tel:${customer.mobileNumbers?.[0]}`}
              >
                {customer.mobileNumbers?.[0]}
              </td>

              <td className="px-6 py-4">{customer.emails?.[0]}</td>

              <td className="px-6 py-4">
                {user.role === 'admin' ? (
                  <select
                    value={customer.assignedAgentId?._id || ''}
                    onChange={(e) => e.target.value === '' ? handleUnassignCustomer(customer._id) : handleAssignCustomer(customer._id, e.target.value)}
                    className="px-2 py-1 border rounded-md"
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
                    className="px-2 py-1 border rounded-md bg-gray-100 text-gray-600"
                  >
                    <option value="">{customer.assignedAgentId?.agentName || 'Unassigned'}</option>
                  </select>
                )}
              </td>

              <td className="px-6 py-4">
                <Link to={`/customers/${customer._id}`} className="text-blue-600 mr-4">View</Link>
                <Link to={`/customers/${customer._id}/add-call-history`} className="text-green-600 mr-4">
                  Add Call History
                </Link>
                {user.role === 'admin' && (
                  <Link to={`/customers/${customer._id}/edit`} className="text-yellow-600">Edit</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTableView;
