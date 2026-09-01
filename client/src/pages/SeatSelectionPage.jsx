import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function SeatSelectionPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/trips"),
      api.get(`/bookings/trip/${tripId}/seats`),
    ]).then(([tripsRes, seatsRes]) => {
      const foundTrip = tripsRes.data.trips.find((t) => t.id === tripId);
      setTrip(foundTrip);
      setBookedSeats(seatsRes.data.bookedSeats);
      setLoading(false);
    });
  }, [tripId]);

  const handleBook = async () => {
    if (!selectedSeat) return;
    setBooking(true);
    setError("");

    try {
      const res = await api.post("/bookings", { tripId, seatNumber: selectedSeat });
      navigate(`/booking-confirmed/${res.data.booking.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading seats...</div>;
  }

  if (!trip) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Trip not found.</div>;
  }

  const capacity = trip.bus.capacity;
  const seats = Array.from({ length: capacity }, (_, i) => i + 1);

  const getSeatState = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return "booked";
    if (selectedSeat === seatNum) return "selected";
    return "available";
  };

  const seatColors = {
    available: "bg-white border-gray-300 text-gray-700 hover:border-red-400",
    selected: "bg-red-600 border-red-600 text-white",
    booked: "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <Link to="/search" className="text-xl">{"<-"}</Link>
        <h1 className="font-semibold">Select Seats</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="font-semibold">
            {trip.bus.busNumber} - {trip.route.origin} {"->"} {trip.route.destination}
          </div>
          <div className="text-sm text-gray-500">{trip.departureTime}</div>
        </div>

        <div className="flex gap-6 mb-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-gray-300 bg-white"></div>
            Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600"></div>
            Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-300"></div>
            Booked
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
            {seats.map((seatNum) => {
              const state = getSeatState(seatNum);
              return (
                <button
                  key={seatNum}
                  disabled={state === "booked"}
                  onClick={() => setSelectedSeat(seatNum)}
                  className={`border rounded py-2 text-sm font-medium transition ${seatColors[state]}`}
                >
                  {seatNum}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Selected Seat</div>
            <div className="font-semibold">{selectedSeat || "None"}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Total Price</div>
            <div className="font-bold text-red-600">${selectedSeat ? trip.fare.toFixed(2) : "0.00"}</div>
          </div>
        </div>

        <button
          disabled={!selectedSeat || booking}
          onClick={handleBook}
          className="w-full mt-4 bg-red-600 text-white rounded py-3 font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {booking ? "Booking..." : "Continue to Book"}
        </button>
      </div>
    </div>
  );
}

export default SeatSelectionPage;
