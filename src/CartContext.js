// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data.data.items || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems(response.data.data.items);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add item to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${apiUrl}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(response.data.updatedCart.items);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove item from cart");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/cart/update`,
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems(response.data.updatedCart.items);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems([]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to clear cart");
    }
  };

  const cartTotal = items.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );

  // Placeholder for advancePayment and duepayment
  const advancePayment = 0; // Replace with actual logic (e.g., fetch from order or user input)
  const duepayment = cartTotal - advancePayment;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        advancePayment,
        duepayment,
        clearCart,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};