import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-black text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-lg">D</div>
          <div className="font-bold text-lg">DREAMTRIP</div>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="hover:text-red-500">Home</Link>
          <Link to="/search" className="hover:text-red-500">Routes</Link>
          <Link to="/about" className="text-red-500">About Us</Link>
          <Link to="/contact" className="hover:text-red-500">Contact</Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/login" className="px-3 md:px-4 py-2 bg-red-600 rounded text-xs md:text-sm font-medium hover:bg-red-700">Login</Link>
          <Link to="/signup" className="px-3 md:px-4 py-2 bg-white text-black rounded text-xs md:text-sm font-medium hover:bg-gray-200">Sign Up</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="text-gray-600 leading-relaxed">
          DreamTrip is a smart bus booking platform built to make intercity travel simple and reliable.
          We connect passengers with real-time trip availability, instant booking confirmations, and
          helpful reminders so you never miss your bus again.
        </p>
        <p className="text-gray-600 leading-relaxed mt-4">
          Our system automatically detects when a bus has already departed and recommends the next
          available trip on the same route, so passengers always have a clear path forward instead of
          hitting a dead end.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
