import { Link } from "react-router-dom";
import { useState } from "react";
import AddCallHistoryModal from "./AddCallHistoryModal";
import { EyeIcon, Pencil, PlusCircle, Phone, Mail, User } from "lucide-react";

export default function CustomerCardView({
  customers,
  agents,
  user,
  handleAssignCustomer,
  handleUnassignCustomer,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full">
              {/* LEFT: Name + Select */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                {/* Customer Name */}
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate max-w-[180px]">
                    {customer.customerName}
                  </h3>
                </div>

                {/* Agent Assignment */}
                {user.role === "admin" ? (
                  <select
                    value={customer.assignedAgentId?._id || ""}
                    onChange={(e) =>
                      e.target.value === ""
                        ? handleUnassignCustomer(customer._id)
                        : handleAssignCustomer(customer._id, e.target.value)
                    }
                    className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 
                  focus:ring-blue-300 outline-none text-sm w-full sm:w-auto"
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
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm w-full sm:w-auto"
                    value={customer.assignedAgentId?.agentName || "Unassigned"}
                  />
                )}
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start sm:self-center ${
                  customer.assignedAgentId
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {customer.assignedAgentId ? "Assigned" : "Unassigned"}
              </span>
            </div>

            {/* Contact Info */}
            <div className="mt-4 space-y-2">
              <p
                className="text-sm text-blue-600 font-medium cursor-pointer flex items-center gap-2 hover:underline"
                onClick={() =>
                  (window.location.href = `tel:${customer.mobileNumbers?.[0]}`)
                }
              >
                <Phone className="w-4 h-4" />
                {customer.mobileNumbers?.[0] || "N/A"}
              </p>

              <p
                className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer hover:underline"
                onClick={() =>
                  (window.location.href = `mailto:${
                    customer.emails?.[0] || ""
                  }`)
                }
              >
                <Mail className="w-4 h-4" />
                {customer.emails?.[0] || "N/A"}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/customers/${customer._id}`}
                className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition flex items-center gap-2 justify-center"
              >
                <EyeIcon className="w-4 h-4" /> View
              </Link>

              <button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition flex items-center gap-2 justify-center"
              >
                <PlusCircle className="w-4 h-4" /> Add History
              </button>

              {user.role === "admin" && (
                <Link
                  to={`/customers/${customer._id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition flex items-center gap-2 justify-center"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AddCallHistoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customerId={selectedCustomer?._id}
        customerName={selectedCustomer?.customerName}
        onAdded={() => setModalOpen(false)}
      />
    </>
  );
}
