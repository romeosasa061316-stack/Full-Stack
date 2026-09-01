import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function AdminPage() {
  const [tab, setTab] = useState("buses");
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [busForm, setBusForm] = useState({ busNumber: "", registrationNumber: "", capacity: "" });
  const [routeForm, setRouteForm] = useState({ origin: "", destination: "", distance: "", duration: "" });
  const [tripForm, setTripForm] = useState({ routeId: "", busId: "", departureDate: "", departureTime: "", fare: "" });
  const [adminForm, setAdminForm] = useState({ fullName: "", email: "", phone: "", password: "" });

  const loadAll = () => {
    Promise.all([api.get("/buses"), api.get("/routes"), api.get("/trips")]).then(
      ([busesRes, routesRes, tripsRes]) => {
        setBuses(busesRes.data.buses);
        setRoutes(routesRes.data.routes);
        setTrips(tripsRes.data.trips);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const createBus = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/buses", {
        busNumber: busForm.busNumber,
        registrationNumber: busForm.registrationNumber,
        capacity: Number(busForm.capacity),
      });
      setBusForm({ busNumber: "", registrationNumber: "", capacity: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bus.");
    }
  };

  const deleteBus = async (id) => {
    if (!confirm("Delete this bus?")) return;
    await api.delete(`/buses/${id}`);
    loadAll();
  };

  const createRoute = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/routes", {
        origin: routeForm.origin,
        destination: routeForm.destination,
        distance: Number(routeForm.distance),
        duration: Number(routeForm.duration),
      });
      setRouteForm({ origin: "", destination: "", distance: "", duration: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create route.");
    }
  };

  const deleteRoute = async (id) => {
    if (!confirm("Delete this route?")) return;
    await api.delete(`/routes/${id}`);
    loadAll();
  };

  const createTrip = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/trips", {
        routeId: tripForm.routeId,
        busId: tripForm.busId,
        departureDate: tripForm.departureDate,
        departureTime: tripForm.departureTime,
        fare: Number(tripForm.fare),
      });
      setTripForm({ routeId: "", busId: "", departureDate: "", departureTime: "", fare: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip.");
    }
  };

  const deleteTrip = async (id) => {
    if (!confirm("Delete this trip?")) return;
    await api.delete(`/trips/${id}`);
    loadAll();
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/auth/create-admin", adminForm);
      setSuccess(`Admin account created: ${res.data.user.email}`);
      setAdminForm({ fullName: "", email: "", phone: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create admin.");
    }
  };

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm";
  const tabs = [
    { key: "buses", label: `Buses (${buses.length})` },
    { key: "routes", label: `Routes (${routes.length})` },
    { key: "trips", label: `Trips (${trips.length})` },
    { key: "admins", label: "Create Admin" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold">D</div>
          <div className="font-bold">DREAMTRIP ADMIN</div>
        </div>
        <nav className="flex-1 px-3 mt-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setError(""); setSuccess(""); }}
              className={`w-full text-left px-3 py-2.5 rounded text-sm mb-1 ${
                tab === t.key ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <Link to="/dashboard" className="mx-3 mb-1 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 rounded">
          Passenger View
        </Link>
        <button onClick={handleLogout} className="mx-3 mb-4 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800 rounded">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-xl font-bold mb-6 capitalize">{tab === "admins" ? "Create Admin Account" : `${tab} Management`}</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{success}</div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : tab === "buses" ? (
          <>
            <form onSubmit={createBus} className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bus Number</label>
                <input required value={busForm.busNumber} onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Registration</label>
                <input required value={busForm.registrationNumber} onChange={(e) => setBusForm({ ...busForm, registrationNumber: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Capacity</label>
                <input required type="number" value={busForm.capacity} onChange={(e) => setBusForm({ ...busForm, capacity: e.target.value })} className={inputClass} />
              </div>
              <button className="bg-red-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-red-700">Add Bus</button>
            </form>

            <div className="bg-white rounded-lg shadow-sm divide-y">
              {buses.map((bus) => (
                <div key={bus.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-semibold text-sm">{bus.busNumber} - {bus.registrationNumber}</div>
                    <div className="text-xs text-gray-500">{bus.capacity} seats - {bus.status}</div>
                  </div>
                  <button onClick={() => deleteBus(bus.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              ))}
            </div>
          </>
        ) : tab === "routes" ? (
          <>
            <form onSubmit={createRoute} className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Origin</label>
                <input required value={routeForm.origin} onChange={(e) => setRouteForm({ ...routeForm, origin: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Destination</label>
                <input required value={routeForm.destination} onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Distance (km)</label>
                <input required type="number" value={routeForm.distance} onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Duration (min)</label>
                <input required type="number" value={routeForm.duration} onChange={(e) => setRouteForm({ ...routeForm, duration: e.target.value })} className={inputClass} />
              </div>
              <button className="bg-red-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-red-700">Add Route</button>
            </form>

            <div className="bg-white rounded-lg shadow-sm divide-y">
              {routes.map((route) => (
                <div key={route.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-semibold text-sm">{route.origin} {"->"} {route.destination}</div>
                    <div className="text-xs text-gray-500">{route.distance} km - {route.duration} min</div>
                  </div>
                  <button onClick={() => deleteRoute(route.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              ))}
            </div>
          </>
        ) : tab === "trips" ? (
          <>
            <form onSubmit={createTrip} className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Route</label>
                <select required value={tripForm.routeId} onChange={(e) => setTripForm({ ...tripForm, routeId: e.target.value })} className={inputClass}>
                  <option value="">Select route</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bus</label>
                <select required value={tripForm.busId} onChange={(e) => setTripForm({ ...tripForm, busId: e.target.value })} className={inputClass}>
                  <option value="">Select bus</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>{b.busNumber}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Fare ($)</label>
                <input required type="number" step="0.01" value={tripForm.fare} onChange={(e) => setTripForm({ ...tripForm, fare: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Departure Date</label>
                <input required type="date" value={tripForm.departureDate} onChange={(e) => setTripForm({ ...tripForm, departureDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Departure Time</label>
                <input required type="time" value={tripForm.departureTime} onChange={(e) => setTripForm({ ...tripForm, departureTime: e.target.value })} className={inputClass} />
              </div>
              <button className="bg-red-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-red-700">Add Trip</button>
            </form>

            <div className="bg-white rounded-lg shadow-sm divide-y">
              {trips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-semibold text-sm">
                      {trip.route.origin} {"->"} {trip.route.destination} - {trip.departureTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trip.bus.busNumber} - {trip.availableSeats} seats - ${trip.fare.toFixed(2)} - {trip.status}
                    </div>
                  </div>
                  <button onClick={() => deleteTrip(trip.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={createAdmin} className="bg-white rounded-lg shadow-sm p-6 max-w-sm space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Full Name</label>
              <input required value={adminForm.fullName} onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input required type="email" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <input required value={adminForm.phone} onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Password</label>
              <input required type="password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className={inputClass} />
            </div>
            <button className="w-full bg-red-600 text-white rounded py-2 text-sm font-medium hover:bg-red-700">Create Admin</button>
          </form>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
