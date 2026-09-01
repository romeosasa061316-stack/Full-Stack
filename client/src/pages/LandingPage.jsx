import { Link } from "react-router-dom";
import busImg from "../assets/dreamtrip-bus.png";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-black text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-lg">
            D
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">DREAMTRIP</div>
            <div className="text-[10px] text-gray-400 leading-tight">Travel Smart. Arrive Safe.</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#" className="hover:text-red-500">Home</a>
          <a href="#" className="hover:text-red-500">Routes</a>
          <a href="#" className="hover:text-red-500">About Us</a>
          <a href="#" className="hover:text-red-500">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 bg-red-600 rounded text-sm font-medium hover:bg-red-700">
            Login
          </Link>
          <Link to="/signup" className="px-4 py-2 bg-white text-black rounded text-sm font-medium hover:bg-gray-200">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="relative bg-black text-white overflow-hidden pb-24">
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Travel Smarter <br />
              With <span className="text-red-600">DreamTrip</span>
            </h1>
            <p className="mt-6 text-gray-300 max-w-md">
              Book bus tickets easily, get real-time updates, and enjoy a comfortable journey.
            </p>
          </div>

          <div className="w-full flex items-center justify-center">
            <img src={busImg} alt="DreamTrip bus" className="w-full max-w-lg object-contain" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 absolute -bottom-10 left-0 right-0">
          <div className="bg-white text-black rounded-lg shadow-2xl p-6 grid md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input type="text" defaultValue="Harare" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input type="text" defaultValue="Masvingo" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Passengers</label>
              <input type="number" defaultValue="1" min="1" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <Link to="/search" className="bg-red-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-red-700 text-center">
              Search Buses
            </Link>
          </div>
        </div>
      </section>

      <div className="h-20"></div>
    </div>
  );
}

export default LandingPage;
