import React from 'react';
import SignupForm from './SignupForm'; // Adjust the import path as necessary
import Navbar from './Navbar'

const Signup = () => {
  return (
    <div>
    <Navbar />
      <h1>Sign Up Page</h1>
      <SignupForm />
    </div>
  );
};

export default Signup;