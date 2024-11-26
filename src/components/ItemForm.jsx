import React, { useState, useEffect } from "react";

const ItemForm = ({ onSubmit, initialItem, onCancel }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState(""); // State untuk notifikasi

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setPrice(initialItem.price.toString());
      setStock(initialItem.stock.toString());
      setCategory(initialItem.category);
    }
  }, [initialItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Price", price);
    formData.append("Stock", stock);
    formData.append("Category", category);
    if (image) {
      formData.append("Image", image);
    }

    try {
      const url = initialItem
        ? `https://localhost:7050/api/items/${initialItem.id}`
        : "https://localhost:7050/api/items";
      const method = initialItem ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: formData,
      });
      const data = await response.json();

      // Periksa apakah ada properti 'message' dan 'item' dalam respons
      if (
        data.message &&
        data.message.includes("Successfully added item.") &&
        data.item
      ) {
        if (initialItem) {
          // Untuk pembaruan, fetch item yang telah diperbarui
          onSubmit(data.item); // Perbarui data item yang sudah diubah
        } else {
          // Untuk item baru, API kemungkinan akan mengembalikan item baru
          onSubmit(data.item);
        }
        // alert(
        //   `Data ${initialItem ? "updated" : "added"} Successfully added item.!`
        // ); // Tampilkan pesan berhasil
        resetForm();
        onCancel(); // Menutup modal setelah berhasil
      } else {
        console.error("Unexpected API response format:", data);
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setCategory("");
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
      {/* Menampilkan notifikasi */}
      {notification && (
        <div className="mb-4 p-2 text-white bg-green-500 rounded-lg">
          {notification}
        </div>
      )}

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="price"
        >
          Price
        </label>
        <input
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="stock"
        >
          Stock
        </label>
        <input
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="category"
        >
          Category
        </label>
        <input
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Image
        </label>
        <div className="relative">
          {/* Input file yang disembunyikan */}
          <input
            id="image"
            type="file"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])} // Fungsi tetap terjaga
          />
          {/* Tombol Choose File */}
          <button
            type="button"
            className="w-full py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
            onClick={() => document.getElementById("image").click()} // Men-trigger input file
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-[1px]"
              fill="none"
              viewBox="0 -2 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Choose File
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {initialItem ? "Update Item" : "Add Item"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
