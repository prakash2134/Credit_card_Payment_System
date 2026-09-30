import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { djangoApi } from "../api/axios";

export default function AddCard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    card_holder_name: "", brand: "VISA", card_number: "", expiry_month: "", expiry_year: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await djangoApi.post("/cards/", form);
      navigate("/dashboard");
    } catch {
      setError("Could not add card. Check the details and try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add a Card</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Cardholder Name"
          value={form.card_holder_name}
          onChange={(e) => setForm({ ...form, card_holder_name: e.target.value })}
          required
        />
        <select
          className="w-full border rounded px-3 py-2"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        >
          <option value="VISA">Visa</option>
          <option value="MASTERCARD">Mastercard</option>
          <option value="AMEX">American Express</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Card Number"
          value={form.card_number}
          onChange={(e) => setForm({ ...form, card_number: e.target.value })}
          required
        />
        <div className="flex gap-2">
          <input
            className="w-1/2 border rounded px-3 py-2"
            placeholder="Exp. Month"
            type="number" min="1" max="12"
            value={form.expiry_month}
            onChange={(e) => setForm({ ...form, expiry_month: e.target.value })}
            required
          />
          <input
            className="w-1/2 border rounded px-3 py-2"
            placeholder="Exp. Year"
            type="number" min="2024"
            value={form.expiry_year}
            onChange={(e) => setForm({ ...form, expiry_year: e.target.value })}
            required
          />
        </div>
        <p className="text-xs text-slate-500">
          Only the last 4 digits and a masked number are stored. The CVV is never requested or saved.
        </p>
        <button className="w-full bg-slate-900 text-white rounded py-2 hover:bg-slate-800">
          Save Card
        </button>
      </form>
    </div>
  );
}
