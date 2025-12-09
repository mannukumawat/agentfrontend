import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddCallHistoryModal from "./AddCallHistoryModal";
import {
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  EyeIcon,
  PlusCircle,
} from "lucide-react";

export default function DailyView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [filters, setFilters] = useState({
    interested: "true",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/call-histories/filtered`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            interested: filters.interested,
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        }
      );

      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="p-5 mt-10">
      <h2 className="text-xl font-bold mb-4">📞 Daily Call History</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          className="border p-2 rounded-xl bg-gray-50"
          value={filters.interested}
          onChange={(e) =>
            setFilters({ ...filters, interested: e.target.value })
          }
        >
          <option value="true">Interested</option>
          <option value="false">Not Interested</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded-xl"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 rounded-xl"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* No Data */}
      {!loading && data.length === 0 && (
        <p className="text-center text-gray-500">No Data Found</p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.customerId?.customerName || "N/A"}
                </h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.interested
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.interested ? "Interested" : "Not Interested"}
              </span>
            </div>

            {/* Mobile */}
            <div className="mt-4">
              <p
                className="text-sm text-blue-600 font-medium cursor-pointer flex items-center gap-2 hover:underline"
                onClick={() =>
                  (window.location.href = `tel:${
                    item.customerId?.mobileNumbers?.[0] || ""
                  }`)
                }
              >
                <Phone className="w-4 h-4" />
                {Array.isArray(item.customerId?.mobileNumbers)
                  ? item.customerId.mobileNumbers.join(", ")
                  : item.customerId?.mobileNumbers || "N/A"}
              </p>
            </div>

            {/* Agent */}
            <div className="mt-2 text-sm text-gray-600">
              <strong>Agent:</strong> {item.agentId?.agentName || "N/A"}
            </div>

            {/* Call Time */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {new Date(item.callTime).toLocaleString()}
            </div>

            {/* Buttons (like CustomerCardView) */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {/* View Button */}
              <Link
                to={`/customers/${item.customerId?._id}`}
                className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition flex items-center gap-2 justify-center"
              >
                <EyeIcon className="w-4 h-4" /> View
              </Link>

              {/* Add History Button */}
              <button
                onClick={() => {
                  setSelectedCustomer(item.customerId);
                  setModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition flex items-center gap-2 justify-center"
              >
                <PlusCircle className="w-4 h-4" /> Add History
              </button>
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
        onAdded={() => {
          setModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
