import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddCallHistoryModal from "./AddCallHistoryModal";

const AgentDashboard = () => {
  const [data, setData] = useState({ yesterday: [], today: [], next: [] });
  const [activeTab, setActiveTab] = useState("today");
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/call-histories/all`
      );
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  const currentRows =
    activeTab === "yesterday"
      ? data.yesterday
      : activeTab === "today"
      ? data.today
      : data.next;

  return (
    <div className="min-h-screen  p-3 sm:p-5 mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">
          Follow Ups - {user?.agentName}
        </h1>

        <Link
          to="/customers"
          className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-700 
        text-white font-semibold py-2 px-4 rounded-md"
        >
          View My Customers
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {["yesterday", "today", "next"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm sm:text-base whitespace-nowrap rounded-md border shadow-sm ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {tab === "next"
              ? "Tomorrow"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Card Container */}
      <div className="p-3 sm:p-4">
        {currentRows.length === 0 ? (
          <div className="text-center p-5 text-gray-500">No results.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentRows.map((item) => (
              <div
                key={item._id}
                className="
                bg-white border border-gray-200 p-4 sm:p-5 
                rounded-2xl shadow-md hover:shadow-xl 
                transition-all duration-300 hover:-translate-y-1
              "
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <Link
                    to={`/customers/${item.customerId?._id}`}
                    className="text-lg sm:text-xl font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {item.customerId?.customerName || "-"}
                  </Link>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-2 text-sm sm:text-base">
                  <p className="text-gray-600">
                    <strong>Notes:</strong> {item.notes || "-"}
                  </p>

                  <p className="text-gray-600">
                    <strong>Disposition:</strong> {item.disposition || "-"}
                  </p>

                  {/* Phone */}
                  <p
                    className="text-blue-600 font-semibold cursor-pointer flex items-center gap-2 text-base sm:text-lg"
                    onClick={() =>
                      (window.location.href = `tel:${item.customerId?.mobileNumbers?.[0]}`)
                    }
                  >
                    <span>📞</span>{" "}
                    {item.customerId?.mobileNumbers?.[0] || "N/A"}
                  </p>

                  <p className="text-gray-600">
                    <strong>Next Call:</strong>{" "}
                    {item.nextCallDateTime
                      ? moment(item.nextCallDateTime).format("DD MMM, HH:mm")
                      : "-"}
                  </p>

                  <p className="text-gray-600">
                    <strong>Agent:</strong> {item.agentId?.agentName || "-"}
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/customers/${item.customerId?._id}`}
                    className="flex-1 text-center bg-blue-500 hover:bg-blue-600 
                  text-white py-2 rounded-lg text-sm font-medium"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedCustomer(item.customerId);
                      setModalOpen(true);
                    }}
                    className="flex-1 text-center bg-green-500 hover:bg-green-600 
                  text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Add Call History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-blue-600 text-sm mt-3 cursor-pointer">
          More records..
        </div>
      </div>

      {/* Modal */}
      <AddCallHistoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customerId={selectedCustomer?._id}
        customerName={selectedCustomer?.customerName}
        onAdded={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AgentDashboard;
