import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="font-bold text-lg">Payment System</Link>
      {user && (
        <div className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="hover:text-slate-300">Dashboard</Link>
          <Link to="/cards/add" className="hover:text-slate-300">Add Card</Link>
          <Link to="/payments/new" className="hover:text-slate-300">Make Payment</Link>
          <Link to="/transactions" className="hover:text-slate-300">Transactions</Link>
          {user.is_staff && (
            <Link to="/admin" className="hover:text-slate-300">Admin</Link>
          )}
          <span className="text-slate-400">Hi, {user.username}</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
