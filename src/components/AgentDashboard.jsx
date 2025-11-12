import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AgentDashboard = () => {
  const [data, setData] = useState({ yesterday: [], today: [], next: [] });
  const [activeTab, setActiveTab] = useState('today');
  const { user } = useAuth();

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/call-histories/all`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log('API Error:', error);
    }
  };

  const currentRows =
    activeTab === 'yesterday' ? data.yesterday : activeTab === 'today' ? data.today : data.next;

  return (
    <div className="min-h-screen bg-gray-100 p-5 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Follow Ups - {user?.agentName}</h1>
        <Link to="/customers" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View My Customers
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        {['yesterday', 'today', 'next'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md border ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            {tab === 'next' ? 'Tomorrow' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Customer Name</th>
              <th className="p-2">notes</th>
              <th className="p-2">disposition</th>
              <th className="p-2">Customer No</th>
              <th className="p-2">Next Call</th>
              <th className="p-2">Agent Name</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-5 text-gray-500">No results.</td>
              </tr>
            ) : (
              currentRows.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{item.customerId?.customerName || '-'}</td>
                  <td className="p-2">{item.notes || '-'}</td>
                  <td className="p-2">{item.disposition || '-'}</td>
                  <td className="p-2">{item.customerId?.mobileNumbers?.[0] || '-'}</td>
                  <td className="p-2">
                    {item.nextCallDateTime ? moment(item.nextCallDateTime).format('DD MMM, HH:mm') : '-'}
                  </td>
                  <td className="p-2">{item.agentId?.agentName || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="text-blue-600 text-sm mt-3 cursor-pointer">More records..</div>
      </div>
    </div>
  );
};

export default AgentDashboard;
