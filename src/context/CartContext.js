import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider component
export const CartProvider = ({ children }) => {
  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userInfo.id || null;
      
      // Also check token for alternate auth method
      const token = localStorage.getItem('token');
      if (token && !userId) {
        try {
          // Decode JWT token to get user ID
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          return JSON.parse(jsonPayload).userId || null;
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
      
      return userId;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  // Initialize cartItems from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    const userId = getUserInfo();
    
    if (userId) {
      const savedCart = localStorage.getItem(`cartItems_${userId}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    
    // Fallback to anonymous cart
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cartItems to localStorage whenever they change
  useEffect(() => {
    const userId = getUserInfo();
    
    if (userId) {
      localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    const userId = getUserInfo();
    
    // If item doesn't have userId, add it
    const itemWithUserId = {
      ...item,
      userId: userId
    };
    
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(i => i.id === item.id && i.userId === userId);
      
      if (existingItem) {
        // If it exists, add the new quantity to existing quantity
        return prevItems.map(i => 
          i.id === item.id && i.userId === userId
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        // If it's a new item, add it with the specified quantity or default to 1
        return [...prevItems, { ...itemWithUserId, quantity: item.quantity || 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const userId = getUserInfo();
    
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === itemId && item.userId === userId)
    ));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    const userId = getUserInfo();
    
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId && item.userId === userId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    const userId = getUserInfo();
    
    if (userId) {
      // Filter out only items for this user
      setCartItems(prevItems => prevItems.filter(item => item.userId !== userId));
      localStorage.removeItem(`cartItems_${userId}`);
    } else {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  };

  // Get filtered cart items for current user
  const getUserCartItems = () => {
    const userId = getUserInfo();
    
    if (userId) {
      return cartItems.filter(item => item.userId === userId);
    }
    
    // If no user ID, return only items without a userId
    return cartItems.filter(item => !item.userId);
  };

  // Get total number of items in cart
  const getCartCount = () => {
    const userItems = getUserCartItems();
    return userItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate cart total
  const getCartTotal = () => {
    const userItems = getUserCartItems();
    return userItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems: getUserCartItems(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    isCartOpen,
    toggleCart,
    getUserInfo
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 