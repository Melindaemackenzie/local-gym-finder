import React from "react";
import { NavLink } from "react-router-dom";



const linkStyles = {
    display: "inline-block",
    width: "150px",
    padding: "12px",
    margin: "0 6px 6px",
    background: "white",
    textDecoration: "none",
    color: "black",
    fontWeight: "bold",

}

function Navbar () { 

    return (
        <div>
            <NavLink
                to ="/"
                exact
                style={linkStyles}
                activestyle={{
                    background: "darkblue",
                    color: "white",
                }}
            >
                Home
            </NavLink>
            <NavLink
            to = "/gyms"
            exact
            style={linkStyles}
            activestyle={{
                background: "darkblue",
                color: "white",
            }}
            >
                Gyms
            </NavLink>
            <NavLink
                to="/workout-classes"
                exact
                style={linkStyles}
                activestyle={{
                    background: "darkblue",
                    color: "white",
                }}
            >
                Workout Classes
            </NavLink>
            <NavLink
                to="/signup"
                exact
                style={linkStyles}
                activestyle={{
                    background: "darkblue",
                    color: "white",
                }}
            >
                Sign Up
            </NavLink>
            <NavLink
                to='/add-gym'
                exact
                style={linkStyles}
                activestyle={{
                    background: 'darkblue',
                    color: 'white',
                }}
            >
                Add Gym
            </NavLink>
            
        </div>
   
    );
}


export default Navbar;
