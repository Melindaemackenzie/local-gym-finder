import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Home(){
    return (
        <div>
            <h1 className = 'Welcome'>Local Gym Finder</h1>
            <Link to="/login">
                <button className="login-button">Log In</button>
            </Link>
            <hr></hr>
            <hr></hr>
            <p>Your one-stop spot for all your local fitness needs</p>
            <Navbar />
            <img
            className='app_pic'
            src='https://as1.ftcdn.net/v2/jpg/04/29/35/62/1000_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg'
            alt='app pic'
            />
        </div>
    )
        
}

export default Home;