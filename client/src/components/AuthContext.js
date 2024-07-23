import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext using createContext()
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    fetch('http://localhost:5555/session', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error checking session:', error);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

