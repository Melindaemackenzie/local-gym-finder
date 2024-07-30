import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Navbar from './Navbar';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await fetch('http://localhost:5555/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login successful', data);
        setIsLoggedIn(true);
        navigate('/');
      } catch (error) {
        setFieldError('general', 'Invalid username or password');
        console.error('Login error:', error);
      }
    }
  });

  return (
    <div>
      <div className='navbar-container'>
        <Navbar />
      </div>
      <div className='form-container'>
        <h2 className='form-heading'>Login</h2>
        <form onSubmit={formik.handleSubmit} className='form'>
          <div className='form-group'>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className='form-input'
              {...formik.getFieldProps('username')}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="error-message">{formik.errors.username}</div>
            ) : null}
          </div>

          <div className='form-group'>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className='form-input'
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
          </div>

          {formik.errors.general && <div className="error-message">{formik.errors.general}</div>}

          <button type="submit" className='submit-button'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;