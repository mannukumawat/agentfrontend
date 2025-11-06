import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-20 text-lg">Please log in to view your profile.</div>;
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-semibold text-center mb-6">User Profile</h1>

        <div className="space-y-4 text-lg">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Name:</span>
            <span>{user.agentName || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Email:</span>
            <span>{user.email || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Role:</span>
            <span>{user.role || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
