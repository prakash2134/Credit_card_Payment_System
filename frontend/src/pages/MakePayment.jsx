import { useEffect, useState } from "react";
import { djangoApi, fastApi } from "../api/axios";

export default function MakePayment() {
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    djangoApi.get("/cards/").then((res) => {
      setCards(res.data);
      if (res.data.length) setCardId(res.data[0].id);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fastApi.post("/payments/", {
        card_id: Number(cardId),
        amount: Number(amount),
        currency: "INR",
      });
      setResult(res.data);
    } catch {
      setError("Payment could not be processed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Make a Payment</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {cards.length === 0 ? (
          <p className="text-sm text-slate-500">Add a card first before making a payment.</p>
        ) : (
          <>
            <select
              className="w-full border rounded px-3 py-2"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>{c.brand} {c.masked_number}</option>
              ))}
            </select>
            <input
              className="w-full border rounded px-3 py-2"
              type="number" step="0.01" min="0.01"
              placeholder="Amount (INR)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button disabled={loading} className="w-full bg-slate-900 text-white rounded py-2 hover:bg-slate-800 disabled:opacity-50">
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${result.status === "SUCCESS" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
          <p className="font-semibold">Status: {result.status}</p>
          <p className="text-sm">Reference: {result.reference_id}</p>
          {result.failure_reason && <p className="text-sm text-red-600">{result.failure_reason}</p>}
        </div>
      )}
    </div>
  );
}
