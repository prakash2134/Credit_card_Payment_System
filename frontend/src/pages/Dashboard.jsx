import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { djangoApi } from "../api/axios";

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    djangoApi.get("/cards/").then((res) => setCards(res.data));
    djangoApi.get("/transactions/").then((res) => setTransactions(res.data.slice(0, 5)));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Saved Cards ({cards.length})</h2>
            <Link to="/cards/add" className="text-sm text-blue-600">+ Add</Link>
          </div>
          {cards.length === 0 && <p className="text-sm text-slate-500">No cards saved yet.</p>}
          <ul className="space-y-2">
            {cards.map((c) => (
              <li key={c.id} className="text-sm border rounded px-3 py-2 flex justify-between">
                <span>{c.brand} {c.masked_number}</span>
                <span className="text-slate-400">{c.expiry_month}/{c.expiry_year}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-blue-600">View all</Link>
          </div>
          {transactions.length === 0 && <p className="text-sm text-slate-500">No transactions yet.</p>}
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li key={t.id} className="text-sm border rounded px-3 py-2 flex justify-between">
                <span>{t.amount} {t.currency}</span>
                <span className={
                  t.status === "SUCCESS" ? "text-green-600" : t.status === "FAILED" ? "text-red-600" : "text-yellow-600"
                }>{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link to="/payments/new" className="inline-block bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">
        Make a Payment
      </Link>
    </div>
  );
}
