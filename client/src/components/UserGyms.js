import React, { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from './AuthContext'; // Assumes you have an AuthContext for user info
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const UserGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const { userId, isLoggedIn } = useContext(AuthContext); // Access user info from context
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
        fetch(`http://localhost:5555/user_gym_resource/${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched gyms:', data.gyms);
          console.log(userId);
          const gymsWithNotes = data.gyms.map(gym => ({
            ...gym,
            notes: gym.notes || [] // Initialize notes as an array if not present
          }));
          setGyms(gymsWithNotes);
        })
        .catch(error => console.error('Error fetching gyms:', error));
    }
  }, [isLoggedIn, userId]);

  const formik = useFormik({
    initialValues: {
      note: ''
    },
    validationSchema: Yup.object({
      note: Yup.string().max(500, 'Note cannot be longer than 500 characters')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`/user_gym_resource/add_note`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          /*credentials: 'include',*/
          body: JSON.stringify({
            user_id: userId,
            gym_id: selectedGym.id,
            note: values.note
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add note');
        }

        alert('Note added successfully!');
        setGyms(prevGyms =>
          prevGyms.map(gym =>
            gym.id === selectedGym.id
              ? { ...gym, notes: [...(gym.notes || []), values.note] }
              : gym
          )
        );

        resetForm();
        setSelectedGym(null);
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  });

  if (!isLoggedIn) {
    return (
      <div>
        <div className ='navbar-container'>
          <Navbar />
        </div>
        <div className='page-header-container'>
          <p className= 'page-header'>Please log in to view your gyms.</p>
          <button onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='navbar-container'>
        <Navbar />
      </div>
      <div className='page-header-container'>
        <p className='page-header'>Your Gyms</p>
      </div>
      {gyms.length > 0 ? (
        <ul>
          {gyms.map(gym => (
            <li key={gym.id}>
              <p>{gym.name}</p>
              <p>{gym.address}</p>
              <button onClick={() => {
                console.log('Selected gym:', gym);
                setSelectedGym(gym);}}>Add Note</button>
                {gym.notes && gym.notes.length > 0 && (
                  <ul>
                    {gym.notes.map((note, index)=> (
                      <li key ={index}>{note}</li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any gyms.</p>
      )}
      {selectedGym && (
        <div className='note-form-container'>
          <h3>Add Note to {selectedGym.name}</h3>
          <form onSubmit={formik.handleSubmit} className='form'>
            <div className='form-group'>
              <label htmlFor="note">Note</label>
              <textarea
                id="note"
                className='form-input'
                {...formik.getFieldProps('note')}
              />
              {formik.touched.note && formik.errors.note ? (
                <div className="error-message">{formik.errors.note}</div>
              ) : null}
            </div>
            <button type="submit" className='submit-button'>Submit Note</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserGyms;