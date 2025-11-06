import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Eye, PenLine, Plus, X } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ agentName: "", agentId: "", email: "", mobile: "", password: "" });

  useEffect(() => { fetchAgents(); }, []);

  const fetchAgents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/agents`);
    setAgents(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/agents`, form);
    setForm({ agentName: "", agentId: "", email: "", mobile: "", password: "" });
    setShowForm(false);
    fetchAgents();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-7 h-7 text-blue-600" /> Agents
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow"
          >
            <Plus className="w-5" /> Register New Agent
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create Agent</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(form).map((field, i) => (
                <input
                  key={i}
                  type={field === "password" ? "password" : "text"}
                  placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <button className="col-span-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">Create Agent</button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((a) => (
            <div key={a._id} className="bg-white p-6 rounded-xl shadow relative space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-lg font-bold">
                  {a.agentName?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{a.agentName}</h3>
                  <p className="text-sm text-gray-500">{a.agentId}</p>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center gap-2"><Mail className="w-4" /> {a.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-4" /> {a.mobile}</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Eye className="w-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
                <PenLine className="w-5 text-gray-600 hover:text-green-600 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
