import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState(searchParams.get("from") || "Harare");
  const [destination, setDestination] = useState(searchParams.get("to") || "");

  useEffect(() => {
    api.get("/trips").then((res) => {
      setTrips(res.data.trips);
      setLoading(false);
    });
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesOrigin = !origin || trip.route.origin.toLowerCase().includes(origin.toLowerCase());
    const matchesDestination = !destination || trip.route.destination.toLowerCase().includes(destination.toLowerCase());
    return matchesOrigin && matchesDestination && trip.status === "SCHEDULED";
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    const dateCompare = new Date(a.departureDate) - new Date(b.departureDate);
    if (dateCompare !== 0) return dateCompare;
    return a.departureTime.localeCompare(b.departureTime);
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <Link to="/dashboard" className="text-xl">{"<-"}</Link>
        <h1 className="font-semibold">Search Results</h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Any destination"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {origin} {destination && `-> ${destination}`} · {sortedTrips.length} result{sortedTrips.length !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">Loading trips...</p>
        ) : sortedTrips.length === 0 ? (
          <p className="text-sm text-gray-500">No trips found for this search.</p>
        ) : (
          <div className="space-y-3">
            {sortedTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                    BUS
                  </div>
                  <div>
                    <div className="font-semibold">
                      {trip.departureTime} · {trip.route.origin} {"->"} {trip.route.destination}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(trip.departureDate)} · {trip.bus.busNumber} · {trip.availableSeats} seats available
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">${trip.fare.toFixed(2)}</div>
                  <Link
                    to={`/book/${trip.id}`}
                    className="text-xs border border-red-600 text-red-600 rounded px-3 py-1 mt-1 inline-block hover:bg-red-600 hover:text-white"
                  >
                    View Seats
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

export default SearchPage;
