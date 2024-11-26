import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk pengalihan
import ItemsList from "../components/ItemList";
import ItemForm from "../components/ItemForm";

const Items = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setNotification("Session expired. Please log in again.");
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
    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://localhost:7050/api/items", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setNotification("Error fetching items.");
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://localhost:7050/api/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        fetchItems();
        setNotification("Item added successfully!");
        setTimeout(() => setNotification(""), 3000);
        setIsFormVisible(false);
      } else {
        setNotification("Error adding item.");
      }
    } catch (error) {
      setNotification("Error adding item.");
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `https://localhost:7050/api/items/${updatedItem.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedItem),
        }
      );
      if (response.ok) {
        fetchItems();
        setNotification("Item updated successfully!");
        setTimeout(() => setNotification(""), 3000);
        setEditingItem(null);
        setIsFormVisible(false);
      } else {
        setNotification("Error updating item.");
      }
    } catch (error) {
      setNotification("Error updating item.");
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://localhost:7050/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchItems();
        setNotification("Item deleted successfully!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        setNotification("Error deleting item.");
      }
    } catch (error) {
      setNotification("Error deleting item.");
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

        {/* Notification */}
        {notification && (
          <div className="mb-4 p-2 text-orange-300  rounded-lg">
            {notification}
          </div>
        )}

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
            <div ref={modalRef} className="rounded-lg w-[50%]">
              <ItemForm
                onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                initialItem={editingItem}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}

        {/* Loader or Items List */}
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="loader">Loading...</div>{" "}
            {/* Tambahkan CSS spinner */}
          </div>
        ) : (
          <ItemsList
            items={items}
            onEdit={handleEditClick}
            onDelete={handleDeleteItem}
          />
        )}
      </div>
    </div>
  );
};

export default Items;
