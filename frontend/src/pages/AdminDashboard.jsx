import { useEffect, useState } from "react";
import { djangoApi } from "../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    djangoApi.get("/admin-panel/users/").then((res) => setUsers(res.data));
    djangoApi.get("/admin-panel/transactions/").then((res) => setTransactions(res.data));
    djangoApi.get("/admin-panel/summary/").then((res) => setSummary(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <a
          href={`${import.meta.env.VITE_DJANGO_API_URL}/transactions/export/`}
          className="text-sm bg-slate-900 text-white px-3 py-2 rounded"
        >
          Export CSV
        </a>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-2">Daily Payment Summary</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-1">Day</th><th className="p-1">Status</th><th className="p-1">Count</th><th className="p-1">Total</th></tr></thead>
          <tbody>
            {summary.map((row, i) => (
              <tr key={i} className="border-b">
                <td className="p-1">{row.day}</td>
                <td className="p-1">{row.status}</td>
                <td className="p-1">{row.count}</td>
                <td className="p-1">{row.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Users ({users.length})</h2>
          <ul className="text-sm space-y-1 max-h-64 overflow-auto">
            {users.map((u) => (
              <li key={u.id} className="flex justify-between border-b py-1">
                <span>{u.username}</span>
                <span className="text-slate-400">{u.is_staff ? "admin" : "user"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">All Transactions ({transactions.length})</h2>
          <ul className="text-sm space-y-1 max-h-64 overflow-auto">
            {transactions.map((t) => (
              <li key={t.id} className="flex justify-between border-b py-1">
                <span>{t.amount} {t.currency}</span>
                <span>{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
