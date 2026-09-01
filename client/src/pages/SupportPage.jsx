import { Link } from "react-router-dom";

function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <Link to="/dashboard" className="text-xl">{"<-"}</Link>
        <h1 className="font-semibold">Support</h1>
      </div>

      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="font-semibold mb-2">Need help?</h2>
          <p className="text-sm text-gray-600">
            If you have questions about a booking, a missed trip, or your account, reach out to us below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-semibold">support@dreamtrip.co.zw</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Phone</span>
            <span className="text-sm font-semibold">+263 77 000 0000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
