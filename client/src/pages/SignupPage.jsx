import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", { fullName, email, phone, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-lg text-white">
            D
          </div>
          <div className="text-white font-bold text-lg">DREAMTRIP</div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-xl font-bold text-center">Create Account</h1>
          <p className="text-center text-sm text-gray-500 mt-1 mb-6">Sign up to get started</p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-xs text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
            />

            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
            />

            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input
              type="tel"
              placeholder="0771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
            />

            <label className="block text-xs text-gray-500 mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-6"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white rounded py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-red-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
