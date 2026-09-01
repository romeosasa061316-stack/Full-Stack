import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <Link to="/dashboard" className="text-xl">{"<-"}</Link>
        <h1 className="font-semibold">Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center mb-6">
          <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            {user.fullName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="font-bold text-lg">{user.fullName}</div>
          <div className="text-xs text-gray-500 uppercase mt-1">{user.role}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Full Name</span>
            <span className="text-sm font-semibold">{user.fullName}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-sm text-gray-500">Role</span>
            <span className="text-sm font-semibold">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
