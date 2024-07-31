import React from 'react';

const Footer = () => {
  return (
    <footer className='footer'>
      <p className = 'footer-quote'>You are only one workout away from a good mood.</p>
      <p>&copy; 2024 Fitness Finder. All rights reserved.</p>
      <p>
        <a href='/about'>About Us</a> | <a href='/contact'>Contact</a>
      </p>
    </footer>
  );
};

export default Footer;