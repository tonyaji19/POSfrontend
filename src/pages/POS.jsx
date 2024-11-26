import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const POS = () => {
  const [transactions, setTransactions] = useState([]);
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://localhost:7050/api/pos/transactions",
          {
            method: "GET",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          setError("Failed to fetch transactions.");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions.");
      }
    };

    const fetchItems = async () => {
      try {
        const response = await fetch("https://localhost:7050/api/items", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          setError("Failed to fetch items.");
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to fetch items.");
      }
    };

    fetchTransactions();
    fetchItems();
  }, []);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const jwt = localStorage.getItem("jwt");

    if (quantity <= 0 || itemId === "") {
      setError("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7050/api/pos/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            itemId: parseInt(itemId),
            quantity: parseInt(quantity),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTransactions((prev) => [...prev, data.transaction]);
        setMessage(data.message);
        window.location.reload();
      } else {
        setError(data.message || "Error processing transaction.");
      }
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setError("Failed to submit the transaction.");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        POS - Point of Sale
      </h2>

      <form onSubmit={handleTransactionSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemId" className="block text-lg font-medium mb-2">
            Item:
          </label>
          <select
            id="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select an item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.stock} in stock
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-lg font-medium mb-2">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Submit Transaction
        </button>
      </form>

      {message && <div className="mt-4 text-green-600 text-lg">{message}</div>}
      {error && <div className="mt-4 text-red-600 text-lg">{error}</div>}

      {/* Transactions List */}
      <h3 className="text-2xl font-semibold mt-8 mb-4">Recent Transactions</h3>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left bg-gray-100">Item</th>
            <th className="px-4 py-2 text-left bg-gray-100">Quantity</th>
            <th className="px-4 py-2 text-left bg-gray-100">Total Price</th>
            <th className="px-4 py-2 text-left bg-gray-100">
              Transaction Date
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="odd:bg-gray-50">
              <td className="px-4 py-2">
                {transaction.item && transaction.item.name
                  ? transaction.item.name
                  : "Unknown Item"}
              </td>
              <td className="px-12 py-2">{transaction.quantity}</td>
              <td className="px-4 py-2">
                {formatCurrency(transaction.totalPrice)}
              </td>
              <td className="px-4 py-2">
                {new Date(transaction.transactionDate).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default POS;
