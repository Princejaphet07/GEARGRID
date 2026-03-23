import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    // Read from localStorage on initial load
    return saved ? JSON.parse(saved) : [];
  });

  // Automatically save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  // ADD THIS: Function to remove items by index
  const removeFromCart = (indexToRemove) => {
    setCartItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    // Make sure removeFromCart is included in the value
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);