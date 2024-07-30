import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Assumes you have an AuthContext for user info
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'

const UserGyms = () => {
  const [gyms, setGyms] = useState([]);
  const { userId, isLoggedIn } = useContext(AuthContext); // Access user info from context
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
        fetch(`http://localhost:5555/user_gym_resource/${userId}`)
        .then(response => response.json())
        .then(data => setGyms(data.gyms))
        .catch(error => console.error('Error fetching gyms:', error));
    }
  }, [isLoggedIn, userId]);

  if (!isLoggedIn) {
    return (
      <div>
        <p>Please log in to view your gyms.</p>
        <button onClick={() => navigate('/login')}>Log In</button>
      </div>
    );
  }

  return (
    <div>
      <div className='navbar-container'>
        <Navbar />
      </div>
      <h1>Your Gyms</h1>
      {gyms.length > 0 ? (
        <ul>
          {gyms.map(gym => (
            <li key={gym.id}>
              <p>{gym.name}</p>
              <p>{gym.address}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any gyms.</p>
      )}
    </div>
  );
};

export default UserGyms;