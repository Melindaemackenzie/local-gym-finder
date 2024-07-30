import React from 'react';
import SignupForm from './SignupForm'; // Adjust the import path as necessary
import Navbar from './Navbar'

const Signup = () => {
  return (
    <div>
      <div className='navbar-container'>
        <Navbar />
      </div>
        <SignupForm />
    </div>
  );
};

export default Signup;