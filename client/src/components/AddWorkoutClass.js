import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "./AuthContext";
import Navbar from "./Navbar";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const AddWorkoutClass = () => {
  const [gyms, setGyms] = useState([]);
  const { isLoggedIn, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5555/gym')
      .then((res) => res.json())
      .then((data) => {
        setGyms(data);
      })
      .catch((error) => {
        console.error('Error fetching gyms:', error);
      });
  }, []);

  const initialValues = {
    name: "",
    schedule: "",
    type: "",
    rating: "",
    gym_name: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    schedule: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    rating: Yup.number().required("Required").min(1).max(10),
    gym_name: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    if (!isLoggedIn) {
      alert("You must be logged in to add a workout class");
      return;
    }

    const selectedGym = gyms.find((gym) => gym.name === values.gym_name);
    if (!selectedGym) {
      alert("Selected gym not found");
      return;
    }

    const workoutClassData = {
      ...values,
      gym_id: selectedGym.id,
      user_id: userId, // assuming you have userId from AuthContext
    };

    fetch("http://localhost:5555/workout_classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workoutClassData),
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Workout class added successfully:", data);
        resetForm();
        navigate('/workout-classes')
      })
      .catch((error) => {
        console.error("Error adding workout class:", error);
      });
  };

  return (
    <div>
      <div className='navbar-container'>
        <Navbar />
      </div>
      <div className='form-container'>
      <h2>Add Workout Class</h2>
      {isLoggedIn ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className ='form-group'>
              <label htmlFor="name">Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div className= 'form-group'>
              <label htmlFor="schedule">Schedule</label>
              <Field name="schedule" type="text" />
              <ErrorMessage name="schedule" component="div" />
            </div>
            <div className = 'form-group'>
              <label htmlFor="type">Type</label>
              <Field name="type" type="text" />
              <ErrorMessage name="type" component="div" />
            </div>
            <div className ='form-group'>
              <label htmlFor="rating">Rating</label>
              <Field name="rating" type="number" />
              <ErrorMessage name="rating" component="div" />
            </div>
            <div className ='form-group'>
              <label htmlFor="gymName">Gym Name</label>
              <Field as="select" name="gym_name">
                <option value="">Select a gym</option>
                {gyms.map((gym) => (
                  <option key={gym.id} value={gym.name}>
                    {gym.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="gymName" component="div" />
            </div>
            <button type="submit">Add Workout Class</button>
          </Form>
        </Formik>
      ) : (
        <div className='login-prompt'>
        <p>You must be logged in to add a workout class.</p>
        <Link to="/login">
                        <button>Log In</button>
                    </Link>
        </div>
      )}
    </div>
  </div>
  );
};

export default AddWorkoutClass;

