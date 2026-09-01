import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    api.get("/bookings/my-bookings").then((res) => {
      setBookings(res.data.bookings);
      setLoading(false);
    });
  }, []);

  const now = new Date();

  const isPast = (booking) => {
    const [hours, minutes] = booking.trip.departureTime.split(":").map(Number);
    const departure = new Date(booking.trip.departureDate);
    departure.setHours(hours, minutes, 0, 0);
    return departure < now;
  };

  const upcoming = bookings.filter((b) => b.status === "CONFIRMED" && !isPast(b));
  const completed = bookings.filter((b) => b.status === "CONFIRMED" && isPast(b));
  const cancelled = bookings.filter((b) => b.status === "CANCELLED" || b.status === "MISSED");

  const tabData = { upcoming, completed, cancelled };
  const activeBookings = tabData[tab];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColors = {
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    MISSED: "bg-gray-200 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <Link to="/dashboard" className="text-xl">{"<-"}</Link>
        <h1 className="font-semibold">My Bookings</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          {["upcoming", "completed", "cancelled"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 ${
                tab === t ? "border-red-600 text-red-600" : "border-transparent text-gray-500"
              }`}
            >
              {t} ({tabData[t].length})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : activeBookings.length === 0 ? (
          <p className="text-sm text-gray-500">No {tab} bookings.</p>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500">{formatDate(booking.trip.departureDate)}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="font-semibold">
                  {booking.trip.route.origin} {"->"} {booking.trip.route.destination}
                </div>
                <div className="text-xs text-gray-500">
                  {booking.trip.departureTime} - Bus {booking.trip.bus.busNumber}
                  {booking.seatNumber && ` · Seat ${booking.seatNumber}`}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-400">Ref: {booking.bookingReference}</div>
                  <Link to={`/booking-confirmed/${booking.id}`} className="text-xs text-red-600 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
