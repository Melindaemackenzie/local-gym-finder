import React, { useState, useEffect }from "react";
import Navbar from './Navbar'

function WorkoutClasses() {

    const [workoutClasses, setWorkoutClasses] = useState ([]);

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
                        
                        
                        
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }



    

export default WorkoutClasses;