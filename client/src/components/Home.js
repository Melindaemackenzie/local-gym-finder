import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";



function Home(){
    return (
        <div>
        <h1 className='welcome'>Local Gym Finder</h1>
        <div className='page-header-container'>
        <Link to="/login">
            <button className="login-button">Log In</button>
        </Link>
        <hr />
            <p className='page-header'>Your one-stop spot for all your local fitness needs</p>
        </div>
        <div className='scrolling-text'>
            <p>Please log in or sign up to enjoy the full experience and find your next gym!</p>
        </div>
        <div className='navbar-container'>
          <Navbar />
        </div>
      </div>
    );
  }

export default Home;