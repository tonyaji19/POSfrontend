import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk pengalihan
import ItemsList from "../components/ItemList";
import ItemForm from "../components/ItemForm";

const Items = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/");
    } else {
      fetchItems();
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://localhost:7050/api/items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://localhost:7050/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      setItems([...items, data]);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    if (updatedItem && updatedItem.id) {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          `https://localhost:7050/api/items/${updatedItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedItem),
          }
        );
        const data = await response.json();
        setItems(
          items.map((item) =>
            item.id === updatedItem.id ? { ...item, ...data } : item
          )
        );
        setEditingItem(null);
        setIsFormVisible(false);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      console.error("Updated item is missing or has no id:", updatedItem);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      await fetch(`https://localhost:7050/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };

  const closeModal = () => {
    setIsFormVisible(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-left text-gray-800">
          Items
        </h1>
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isFormVisible ? "Close Form" : "Add New Item"}
          </button>
        </div>

        {/* Modal Form */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div ref={modalRef} className=" rounded-lg w-[50%]">
              <ItemForm
                onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                initialItem={editingItem}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <ItemsList
          items={items}
          onEdit={handleEditClick}
          onDelete={handleDeleteItem}
        />
      </div>
    </div>
  );
};

export default Items;
