

import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Logout = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch('http://localhost:5555/logout', {
          method: 'POST',
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error('Logout failed');
        }

        const data = await response.json();
        console.log('Logout successful', data);
        setIsLoggedIn(false);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userId');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    handleLogout();
  }, [navigate, setIsLoggedIn]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;