import { useEffect, useState } from "react";
import { djangoApi } from "../api/axios";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ status: "", date_from: "", date_to: "" });

  const fetchData = () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    djangoApi.get("/transactions/", { params }).then((res) => setTransactions(res.data));
  };

  useEffect(fetchData, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-2 items-end">
        <select
          className="border rounded px-2 py-1"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={filters.date_from}
          onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={filters.date_to}
          onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
        />
        <button onClick={fetchData} className="bg-slate-900 text-white px-3 py-1 rounded">
          Filter
        </button>
      </div>

      <table className="w-full bg-white rounded-lg shadow overflow-hidden text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-2">Reference</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2 font-mono text-xs">{t.reference_id}</td>
              <td className="p-2">{t.amount} {t.currency}</td>
              <td className="p-2">{t.status}</td>
              <td className="p-2">{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
