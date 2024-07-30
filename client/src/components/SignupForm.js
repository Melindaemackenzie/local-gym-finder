import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignupForm = () => {
  const initialValues = {
    username: '',
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
  });

  const onSubmit = async (values, { resetForm, setFieldError }) => {
    try {
      const response = await fetch('http://localhost:5555/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
        
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error && errorData.field) {
          setFieldError(errorData.field, errorData.error);
        } else {
          throw new Error('Network response was not ok');
        }
      } else {
        console.log('User signed up successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.message === 'Failed to fetch') {
        alert('Network error: Please check your internet connection or try again later.');
      } else {
        setFieldError('general', 'An error occurred during signup. Please try again.');
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className='form-container'>
        <h2 className='form-heading'>Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className='form'>
            <div className='form-group'>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    className='form-input'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className="error-message">{formik.errors.username}</div>
                ) : null}
            </div>

            <div className='form-group'>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className='form-input'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="error-message">{formik.errors.email}</div>
                ) : null}
            </div>

            <div className='form-group'>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className='form-input'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className="error-message">{formik.errors.password}</div>
                ) : null}
            </div>

            {formik.errors.general && <div className="error-message">{formik.errors.general}</div>}

            <button type="submit" className='submit-button'>Sign Up</button>
        </form>
    </div>
);
};

export default SignupForm;