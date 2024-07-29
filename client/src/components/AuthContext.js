import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext using createContext()
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId ] = useState(null);


  const checkSession = async () => {
    try {
      const response = await fetch("http://localhost:5555/session", { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.logged_in);
        setUserId(data.user_id);
        if (data.logged_in) {
          setUserId(data.user_id);
        }
      } else {
        setIsLoggedIn(false);
        /*setUserId(null);*/
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setIsLoggedIn(false);
      /*setUserId(null);*/
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, setIsLoggedIn, setUserId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

