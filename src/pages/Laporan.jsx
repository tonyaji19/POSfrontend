import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const POSReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [stockReport, setStockReport] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const response = await fetch("https://localhost:7050/api/reports/pos", {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Add Authorization header
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        setError("Failed to fetch transactions.");
      }
    } catch (err) {
      setError("Error fetching transactions.");
    }
  };

  const fetchStockReport = async () => {
    try {
      const response = await fetch("https://localhost:7050/api/reports/stock", {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStockReport(data);
      } else {
        setError("Failed to fetch stock report.");
      }
    } catch (err) {
      setError("Error fetching stock report.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/");
    } else {
      fetchTransactions();
      fetchStockReport();
    }
  }, [navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const transactionData = {
    labels: transactions.map((t) =>
      new Date(t.transactionDate).toLocaleString()
    ),
    datasets: [
      {
        label: "Total Price",
        data: transactions.map((t) => t.totalPrice),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const stockData = {
    labels: stockReport.map((item) => item.itemName),
    datasets: [
      {
        label: "Stock",
        data: stockReport.map((item) => item.stock),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-full mx-auto p-6">
      {error && <div className="text-red-600 text-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Transaksi Chart */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Laporan Transaksi</h3>
          <Line data={transactionData} options={{ responsive: true }} />
        </div>

        {/* Stock Chart */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Laporan Stok</h3>
          <Bar data={stockData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Grid layout for tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Laporan Transaksi Table */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            Detail Laporan Transaksi
          </h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left bg-gray-100">
                  Tanggal Transaksi
                </th>
                <th className="px-4 py-2 text-left bg-gray-100">Item</th>
                <th className="px-4 py-2 text-left bg-gray-100">Kategori</th>
                <th className="px-4 py-2 text-left bg-gray-100">Quantity</th>
                <th className="px-4 py-2 text-left bg-gray-100">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="odd:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(transaction.transactionDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{transaction.itemName}</td>
                  <td className="px-4 py-2">{transaction.category}</td>
                  <td className="px-4 py-2">{transaction.quantity}</td>
                  <td className="px-4 py-2">
                    {formatCurrency(transaction.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Laporan Stok Table */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Detail Laporan Stok</h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left bg-gray-100">Item</th>
                <th className="px-4 py-2 text-left bg-gray-100">Kategori</th>
                <th className="px-4 py-2 text-left bg-gray-100">Stok</th>
                <th className="px-4 py-2 text-left bg-gray-100">Harga</th>
              </tr>
            </thead>
            <tbody>
              {stockReport.map((item, index) => (
                <tr key={index} className="odd:bg-gray-50">
                  <td className="px-4 py-2">{item.itemName}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.stock}</td>
                  <td className="px-4 py-2">{formatCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default POSReport;
