import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Assumes you have an AuthContext for user info

const UserGyms = () => {
  const [gyms, setGyms] = useState([]);
  const { userId, isLoggedIn } = useContext(AuthContext); // Access user info from context

  useEffect(() => {
    if (isLoggedIn) {
        fetch(`http://localhost:5555/user_gym_resource/${userId}`)
        .then(response => response.json())
        .then(data => setGyms(data.gyms))
        .catch(error => console.error('Error fetching gyms:', error));
    }
  }, [isLoggedIn, userId]);

  if (!isLoggedIn) {
    return <p>Please log in to view your gyms.</p>;
  }

  return (
    <div>
      <h1>Your Gyms</h1>
      {gyms.length > 0 ? (
        <ul>
          {gyms.map(gym => (
            <li key={gym.id}>{gym.name}</li>
          ))}
        </ul>
      ) : (
        <p>You don't have any gyms.</p>
      )}
    </div>
  );
};

export default UserGyms;