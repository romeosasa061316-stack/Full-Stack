import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/notifications"),
      api.get("/bookings/my-bookings"),
    ]).then(([notifRes, bookingsRes]) => {
      setNotifications(notifRes.data.notifications);
      setBookings(bookingsRes.data.bookings);
      setLoading(false);
    });
  }, []);

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.title === "Missed Departure") {
      const routeMatch = notification.message.match(/the \d{2}:\d{2} (.+?) -> (.+?) departure/);
      if (routeMatch) {
        navigate(`/search?from=${encodeURIComponent(routeMatch[1])}&to=${encodeURIComponent(routeMatch[2])}`);
      } else {
        navigate("/search");
      }
      return;
    }

    const refMatch = notification.message.match(/TS-[A-Z0-9]+/);
    if (refMatch) {
      const matchedBooking = bookings.find((b) => b.bookingReference === refMatch[0]);
      if (matchedBooking) {
        navigate(`/booking-confirmed/${matchedBooking.id}`);
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <Link to="/dashboard" className="text-xl">{"<-"}</Link>
        <h1 className="font-semibold">Notifications</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications yet.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`rounded-lg p-4 cursor-pointer ${
                  n.isRead ? "bg-white" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-sm">{n.title}</div>
                  {!n.isRead && <div className="w-2 h-2 bg-red-600 rounded-full"></div>}
                </div>
                <div className="text-sm text-gray-600">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
