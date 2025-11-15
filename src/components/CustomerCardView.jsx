import { Link } from 'react-router-dom';

const CustomerCardView = ({ customers, agents, user, handleAssignCustomer, handleUnassignCustomer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <div
          key={customer._id}
          className="
            bg-white backdrop-blur-lg 
            shadow-md hover:shadow-xl 
            border border-gray-200 
            p-5 rounded-2xl 
            transition-all duration-300 
            hover:-translate-y-1
          "
        >
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800">
              {customer.customerName}
            </h3>

            <span
              className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${customer.assignedAgentId ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}
              `}
            >
              {customer.assignedAgentId ? "Assigned" : "Unassigned"}
            </span>
          </div>

          {/* Contact */}
          <div className="mt-3 space-y-1">
            <p
              className="text-sm text-blue-600 font-semibold cursor-pointer flex items-center gap-2"
              onClick={() => window.location.href = `tel:${customer.mobileNumbers?.[0]}`}
            >
              <span>📞</span> {customer.mobileNumbers?.[0] || "N/A"}
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span>📧</span> {customer.emails?.[0] || "N/A"}
            </p>
          </div>

          {/* Agent Assignment */}
          <div className="mt-4">
            <label className="text-sm text-gray-700 font-medium">Assign Agent:</label>

            {user.role === "admin" ? (
              <select
                value={customer.assignedAgentId?._id || ""}
                onChange={(e) =>
                  e.target.value === ""
                    ? handleUnassignCustomer(customer._id)
                    : handleAssignCustomer(customer._id, e.target.value)
                }
                className="
                  mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg 
                  bg-white focus:ring-2 focus:ring-blue-300 outline-none
                "
              >
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.agentName}
                  </option>
                ))}
              </select>
            ) : (
              <input
                disabled
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                value={customer.assignedAgentId?.agentName || "Unassigned"}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-2 flex-wrap">
            <Link
              to={`/customers/${customer._id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-lg text-sm font-medium transition"
            >
              View
            </Link>

            <Link
              to={`/customers/${customer._id}/add-call-history`}
              className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-4 rounded-lg text-sm font-medium transition"
            >
              Add Call History
            </Link>

            {user.role === "admin" && (
              <Link
                to={`/customers/${customer._id}/edit`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-4 rounded-lg text-sm font-medium transition"
              >
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
