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
import UserGyms from './UserGyms'


function App() {
  return (

    <Router>
      <AuthProvider>
        <div className="App">
          <img src='https://t4.ftcdn.net/jpg/03/51/22/27/240_F_351222764_DBU75XBKgvorlN1TRwBn0RCw4nPEGGDJ.jpg' alt="Header" className="header-image" />
          <div className="app-container">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/gyms" element={<Gyms />} />
              <Route path="/workout-classes" element={<WorkoutClasses />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/add-gym" element={<AddGym />} />
              <Route path="/add-workout_class" element={<AddWorkoutClass />} />
              <Route path="/user_gym_resource/:userId" element={<UserGyms />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
  