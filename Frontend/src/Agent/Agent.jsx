import { useNavigate } from "react-router-dom";

const Agent = () => {
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
            <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
            <p className="mt-2 text-gray-600">Coordinate deliveries, support clients, and manage field tasks.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-violet-50 p-4">
            <h2 className="font-semibold text-violet-700">Assignments</h2>
            <p className="mt-2 text-sm text-gray-600">Review daily delivery and service assignments.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-fuchsia-50 p-4">
            <h2 className="font-semibold text-fuchsia-700">Client Updates</h2>
            <p className="mt-2 text-sm text-gray-600">Share progress and resolve customer concerns.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-amber-50 p-4">
            <h2 className="font-semibold text-amber-700">Reports</h2>
            <p className="mt-2 text-sm text-gray-600">Track completed jobs and pending follow-ups.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;
