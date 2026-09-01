import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function BookingConfirmedPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my-bookings").then((res) => {
      const found = res.data.bookings.find((b) => b.id === bookingId);
      setBooking(found);
      setLoading(false);
    });
  }, [bookingId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Booking not found.</div>;
  }

  const formattedDate = new Date(booking.trip.departureDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <Link to="/dashboard" className="text-xl">{"<-"}</Link>
        <h1 className="font-semibold">Booking Confirmed</h1>
      </div>

      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center mb-6">
          <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            ?
          </div>
          <h2 className="text-lg font-bold">Your booking is confirmed!</h2>
          <p className="text-sm text-gray-500">Thank you for choosing DreamTrip.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Booking Reference</span>
            <span className="text-sm font-semibold">{booking.bookingReference}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Route</span>
            <span className="text-sm font-semibold">
              {booking.trip.route.origin} {"->"} {booking.trip.route.destination}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm font-semibold">{formattedDate}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Time</span>
            <span className="text-sm font-semibold">{booking.trip.departureTime}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Bus</span>
            <span className="text-sm font-semibold">{booking.trip.bus.busNumber}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Seat</span>
            <span className="text-sm font-semibold">{booking.seatNumber}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">Amount Paid</span>
            <span className="text-sm font-semibold text-red-600">${booking.trip.fare.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 border border-red-600 text-red-600 rounded py-2.5 text-sm font-medium hover:bg-red-50">
            Download Ticket
          </button>
          <Link
            to="/my-bookings"
            className="flex-1 bg-red-600 text-white rounded py-2.5 text-sm font-medium text-center hover:bg-red-700"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmedPage;
