import { UserCog } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto mt-10 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-blue-600" />
            Calling Dashboard
          </h1>
        </div>
      </header>

      
    </div>
  );
};

export default AdminDashboard;
