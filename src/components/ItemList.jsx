import React from "react";

const ItemsList = ({ items, onEdit, onDelete }) => {
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-xl rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
        >
          <div className="p-6 flex items-center">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-14 h-14 object-cover rounded-full shadow-md"
            />
            <div className="ml-4">
              <h2 className="font-semibold text-xl text-gray-800">
                {item.name}
              </h2>
              <p className="text-gray-500 text-sm">{item.category}</p>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-800 text-xl font-semibold mb-4">
              {formatRupiah(item.price)}
            </p>
            <p className="text-gray-600 text-lg mb-4">Stock: {item.stock}</p>
            {/* <p className="text-gray-600 text-lg mb-4">
              Category: {item.category}
            </p> */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
