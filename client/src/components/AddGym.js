import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar'
import { Link , useNavigate } from 'react-router-dom';
const AddGym = () => {
    const { isLoggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            website: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Gym name is required'),
            /*address: Yup.string().required('Address is required'),*/
            address: Yup.string()
            .matches(/^[\d\w\s]+, [\w\s]+, [A-Z]{2} \d{5}$/, 'Address must be in the format: Street Address, City, State ZIP')
            .required('Address is required'),
            phone: Yup.string()
            .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format: xxx-xxx-xxxx')
            .required('Phone number is required'),
            website: Yup.string().url('Invalid website URL')
        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
            console.log('Form submitted', values);
            if (!isLoggedIn) {
                setFieldError('general', 'You must be logged in to add a gym.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5555/gym', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...values, userId}),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add gym');
                }

                resetForm();
                alert('Gym added successfully!');
                navigate('/gyms')
            } catch (error) {
                setFieldError('general', error.message);
            }
        }
    });

    return (
        <div>
            <div className='navbar-container'>
                <Navbar />
            </div>
            <div className='form-container'>
            <h2>Add Gym</h2>
            {isLoggedIn ? (
                <div className='form-container'>
                    {formik.errors.general && <div className="error-message">{formik.errors.general}</div>}
                    <form onSubmit={formik.handleSubmit} className='form'>
                        <div className='form-group'>
                            <label htmlFor="name">Gym Name</label>
                            <input
                                id="name"
                                type="text"
                                className='form-input'
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="error-message">{formik.errors.name}</div>
                            ) : null}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="address">Address</label>
                            <input
                                id="address"
                                type="text"
                                className='form-input'
                                {...formik.getFieldProps('address')}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div className="error-message">{formik.errors.address}</div>
                            ) : null}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone">Phone</label>
                            <input
                                id="phone"
                                type="text"
                                className='form-input'
                                {...formik.getFieldProps('phone')}
                            />
                            <p className='helper-text'>Phone number must be 10 digits</p>
                            {formik.touched.phone && formik.errors.phone ? (
                                <div className="error-message">{formik.errors.phone}</div>
                            ) : null}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="website">Website</label>
                            <input
                                id="website"
                                type="text"
                                className='form-input'
                                {...formik.getFieldProps('website')}
                            />
                            <p className='helper-text'>Please enter a complete URL (e.g., http://example.com)</p>
                            {formik.touched.website && formik.errors.website ? (
                                <div className="error-message">{formik.errors.website}</div>
                            ) : null}
                        </div>
                        <button type="submit" className='submit-button'>Add Gym</button>
                    </form>
                </div>
            ) : (
                <div className='login-prompt'>
                    <p>You must be logged in to add a gym.</p>
                    <Link to="/login">
                        <button className='login-button'>Log In</button>
                    </Link>
                </div>
            )}
        </div>
    </div>
    );
};

export default AddGym;