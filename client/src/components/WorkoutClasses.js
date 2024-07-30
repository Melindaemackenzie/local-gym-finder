import React, { useState, useEffect, useContext }from "react";
import Navbar from './Navbar';
import { AuthContext } from './AuthContext';

function WorkoutClasses() {

    const [workoutClasses, setWorkoutClasses] = useState ([]);
    const { isLoggedIn } = useContext(AuthContext);
    useEffect(() => {
        fetch('http://localhost:5555/workout_classes')
        .then (res => res.json())
        .then (data => {
            console.log(data)
            setWorkoutClasses(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        })
            }, [])

            const handleDeleteWorkoutClass = (workoutClassId) => {
              console.log(workoutClassId)
              console.log("delete workout class function called with ID:", workoutClassId)
                if (window.confirm("Are you sure you want to delete this class??")) {
                fetch(`/workout_classes/${workoutClassId}`, {
                  method: 'DELETE',
                  credentials: 'include',
                  headers: {
                    'Content-type' : 'application/json'
                  }
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log("Gym deleted successfully:", data);
                    setWorkoutClasses(prevWorkoutClasses =>
                      prevWorkoutClasses.filter(workoutClass => workoutClass.id !== workoutClassId)
                      );
                    fetch('http://localhost:5555/workout_classes'); // Refresh workoutclasses after deletion
                  })
                  .catch((error) => {
                    console.error("Error deleting gym:", error);
                  });
              }
            };

            return (
                <div>
                  <Navbar />
                  <h1>Workout Classes</h1>
                  <ul>
                    {workoutClasses.map((workoutClass) => (
                      <li key={workoutClass.id}>
                        <h2>{workoutClass.name}</h2>
                        <p>Schedule: {workoutClass.schedule}</p>
                        <p>Type: {workoutClass.type}</p>
                        <p>Rating: {workoutClass.rating}</p>
                         <p>{workoutClass.gym_name}</p>
                         {isLoggedIn? (
                          <button onClick={() => handleDeleteWorkoutClass(workoutClass.id)}>
                          Delete Class
                        </button>

                         ) : (
                          <p>Log in to delete workout class </p>
                         )}
                      </li>
                    ))}
                  </ul>
                  
                </div>
              );
            }



    

export default WorkoutClasses;