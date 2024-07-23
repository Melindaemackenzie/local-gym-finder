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
                        <p>{workoutClass.schedule}</p>
                        <p>{workoutClass.type}</p>
                        <p>{workoutClass.rating}</p>
                        {workoutClass.gym && <p>{workoutClass.gym.name}</p>}
                        
                        
                        
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }



    

export default WorkoutClasses;