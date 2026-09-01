import { Link } from "react-router-dom";
import busImg from "../assets/dreamtrip-bus.png";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-black text-white">
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
          <Link to="/" className="hover:text-red-500">Home</Link>
          <Link to="/search" className="hover:text-red-500">Routes</Link>
          <a href="#about" className="hover:text-red-500">About Us</a>
          <a href="#contact" className="hover:text-red-500">Contact</a>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/login" className="px-3 md:px-4 py-2 bg-red-600 rounded text-xs md:text-sm font-medium hover:bg-red-700">
            Login
          </Link>
          <Link to="/signup" className="px-3 md:px-4 py-2 bg-white text-black rounded text-xs md:text-sm font-medium hover:bg-gray-200">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="relative bg-black text-white overflow-hidden pb-8 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-4 md:pb-8 grid md:grid-cols-2 gap-4 md:gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Travel Smarter <br />
              With <span className="text-red-600">DreamTrip</span>
            </h1>
            <p className="mt-3 md:mt-6 text-gray-300 max-w-md mx-auto md:mx-0 text-sm md:text-base">
              Book bus tickets easily, get real-time updates, and enjoy a comfortable journey.
            </p>
          </div>

          <div className="w-full flex items-center justify-center">
            <img src={busImg} alt="DreamTrip bus" className="w-full max-w-xs md:max-w-lg object-contain" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 md:absolute md:-bottom-10 md:left-0 md:right-0">
          <div className="bg-white text-black rounded-lg shadow-2xl p-3 md:p-6 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input type="text" defaultValue="Harare" className="w-full border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input type="text" defaultValue="Masvingo" className="w-full border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Passengers</label>
              <input type="number" defaultValue="1" min="1" className="w-full border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm" />
            </div>
            <Link to="/search" className="bg-red-600 text-white rounded px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium hover:bg-red-700 text-center col-span-2 md:col-span-1">
              Search Buses
            </Link>
          </div>
        </div>
      </section>

      <div className="h-8 md:h-20"></div>

      <section id="about" className="max-w-4xl mx-auto px-4 md:px-8 py-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <p className="text-gray-600">
          DreamTrip is a smart bus booking platform built to make intercity travel simple and reliable.
          We connect passengers with real-time trip availability, instant booking confirmations, and
          helpful reminders so you never miss your bus again.
        </p>
      </section>

      <section id="contact" className="max-w-4xl mx-auto px-4 md:px-8 py-12 scroll-mt-20 border-t border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <div className="text-gray-600 space-y-1">
          <p>Email: support@dreamtrip.co.zw</p>
          <p>Phone: +263 77 000 0000</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
