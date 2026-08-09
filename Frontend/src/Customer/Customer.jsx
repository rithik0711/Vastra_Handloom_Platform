import { useNavigate } from "react-router-dom";

const Customer = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
            <p className="mt-2 text-gray-600">Explore products and manage your orders.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-purple-50 p-4">
            <h2 className="font-semibold text-purple-700">My Orders</h2>
            <p className="mt-2 text-sm text-gray-600">Check current order status and history.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-pink-50 p-4">
            <h2 className="font-semibold text-pink-700">Wish List</h2>
            <p className="mt-2 text-sm text-gray-600">Keep favorite handloom items saved.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-indigo-50 p-4">
            <h2 className="font-semibold text-indigo-700">Support</h2>
            <p className="mt-2 text-sm text-gray-600">Contact the team for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
