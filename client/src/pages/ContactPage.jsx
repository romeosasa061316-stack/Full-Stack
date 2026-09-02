import { Link } from "react-router-dom";

function ContactPage() {
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
          <Link to="/about" className="hover:text-red-500">About Us</Link>
          <Link to="/contact" className="text-red-500">Contact</Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/login" className="px-3 md:px-4 py-2 bg-red-600 rounded text-xs md:text-sm font-medium hover:bg-red-700">Login</Link>
          <Link to="/signup" className="px-3 md:px-4 py-2 bg-white text-black rounded text-xs md:text-sm font-medium hover:bg-gray-200">Sign Up</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="space-y-3 text-gray-600">
          <p><span className="font-semibold text-gray-900">Email:</span> support@dreamtrip.co.zw</p>
          <p><span className="font-semibold text-gray-900">Phone:</span> +263 77 000 0000</p>
          <p><span className="font-semibold text-gray-900">Hours:</span> Monday - Saturday, 6:00 AM - 8:00 PM</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
