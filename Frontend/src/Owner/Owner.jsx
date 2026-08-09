import { useNavigate } from "react-router-dom";

const Owner = () => {
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
            <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your handloom platform operations.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
            <h2 className="font-semibold text-blue-700">Orders</h2>
            <p className="mt-2 text-sm text-gray-600">Track incoming orders and fulfillments.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-green-50 p-4">
            <h2 className="font-semibold text-green-700">Inventory</h2>
            <p className="mt-2 text-sm text-gray-600">Review stock and product availability.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-yellow-50 p-4">
            <h2 className="font-semibold text-yellow-700">Customers</h2>
            <p className="mt-2 text-sm text-gray-600">Monitor customer requests and feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;
