import React, { useEffect, useState } from "react";
import { BrowserRouter as  Router,  Route, Routes } from "react-router-dom";
import Home from "./Home";
import Gyms from "./Gyms";
import WorkoutClasses from "./WorkoutClasses";
import Reviews from "./Reviews";
import { AuthProvider } from "./AuthContext";
import Signup from "./Signup"
import Login from "./Login"
import AddGym from './AddGym';
import AddWorkoutClass from './AddWorkoutClass';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
        <br />
          <Routes>
            <Route path="/" exact ={true} element={<Home />} />
            <Route path="/gyms" element={<Gyms />} />
            <Route path="/workout-classes" element={<WorkoutClasses />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path= "/login" element={<Login />} />
            <Route path= '/signup' element={<Signup />} />
            <Route path= '/add-gym' element={<AddGym />} />
            <Route path= '/add-workout_class' element={<AddWorkoutClass />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
  