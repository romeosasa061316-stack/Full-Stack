import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function LoginPage() {
  const [role, setRole] = useState("passenger");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const actualRole = response.data.user.role;

      if (role === "admin" && actualRole !== "ADMIN") {
        setError("This account is not an admin account.");
        setLoading(false);
        return;
      }

      if (role === "passenger" && actualRole === "ADMIN") {
        setError("This is an admin account. Please use the Admin tab to log in.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (actualRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          <h1 className="text-xl font-bold text-center">Welcome Back!</h1>
          <p className="text-center text-sm text-gray-500 mt-1 mb-6">Login to your account</p>

          <div className="flex mb-6 rounded overflow-hidden border border-gray-300">
            <button
              type="button"
              onClick={() => setRole("passenger")}
              className={`flex-1 py-2 text-sm font-medium ${
                role === "passenger" ? "bg-red-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              Passenger
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-sm font-medium ${
                role === "admin" ? "bg-red-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
            />

            <div className="flex items-center justify-between text-xs mb-6">
              <label className="flex items-center gap-1 text-gray-500">
                <input type="checkbox" />
                Remember Me
              </label>
              <a href="#" className="text-red-600 hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white rounded py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Don't have an account? <Link to="/signup" className="text-red-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
