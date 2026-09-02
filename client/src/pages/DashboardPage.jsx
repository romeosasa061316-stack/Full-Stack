import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    api.get("/bookings/my-bookings").then((res) => setBookings(res.data.bookings));
    api.get("/notifications").then((res) => setNotifications(res.data.notifications));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");
  const upcomingTrip = confirmedBookings[0];
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Bookings", path: "/my-bookings" },
    { label: "Search Buses", path: "/search" },
    { label: "Notifications", path: "/notifications", badge: unreadNotifications.length },
    { label: "Profile", path: "/profile" },
    { label: "Support", path: "/support" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden flex items-center justify-between bg-black text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center font-bold text-sm">D</div>
          <span className="font-bold text-sm">DREAMTRIP</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="text-xl px-2">=</button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="flex">
        <aside className={`w-64 bg-black text-white flex flex-col fixed md:sticky top-0 h-screen z-50 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold">D</div>
              <div className="font-bold">DREAMTRIP</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-xl">x</button>
          </div>

          <nav className="flex-1 px-3 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded text-sm text-gray-300 hover:bg-gray-800 mb-1"
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mx-3 mb-4 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800 rounded"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 p-4 md:p-8 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold">
                Good Morning, {user?.fullName || "..."}
              </h1>
              <p className="text-sm text-gray-500">Where are you traveling to today?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold">{confirmedBookings.length}</div>
              <div className="text-xs text-gray-500">Upcoming Trips</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-gray-500">Completed Trips</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold">{cancelledBookings.length}</div>
              <div className="text-xs text-gray-500">Cancelled Trips</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold">{unreadNotifications.length}</div>
              <div className="text-xs text-gray-500">Notifications</div>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Trip</h2>
          {upcomingTrip ? (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    {upcomingTrip.trip.route.origin} {"->"} {upcomingTrip.trip.route.destination}
                  </div>
                  <div className="text-sm text-gray-500">
                    {upcomingTrip.trip.departureTime} - Seat {upcomingTrip.seatNumber}
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  {upcomingTrip.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-sm text-gray-500">
              No upcoming trips. <Link to="/search" className="text-red-600">Search buses</Link> to book one.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
