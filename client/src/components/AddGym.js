import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar'
import { Link } from 'react-router-dom';
const AddGym = () => {
    const { isLoggedIn } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            website: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Gym name is required'),
            address: Yup.string().required('Address is required'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
            website: Yup.string().url('Invalid website URL')
        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
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
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add gym');
                }

                resetForm();
                alert('Gym added successfully!');
            } catch (error) {
                setFieldError('general', error.message);
            }
        }
    });

    return (
        <div>
            <Navbar />
            <h2>Add Gym</h2>
            {isLoggedIn ? (
                <div>
                    {formik.errors.general && <div className="error">{formik.errors.general}</div>}
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="name">Gym Name</label>
                            <input
                                id="name"
                                type="text"
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="error">{formik.errors.name}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="address">Address</label>
                            <input
                                id="address"
                                type="text"
                                {...formik.getFieldProps('address')}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div className="error">{formik.errors.address}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input
                                id="phone"
                                type="text"
                                {...formik.getFieldProps('phone')}
                            />
                            <p>Phone number must be 10 digits</p>
                            {formik.touched.phone && formik.errors.phone ? (
                                <div className="error">{formik.errors.phone}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="website">Website</label>
                            <input
                                id="website"
                                type="text"
                                {...formik.getFieldProps('website')}
                            />
                            <p>Please enter a complete URL (e.g., http://example.com)</p>
                            {formik.touched.website && formik.errors.website ? (
                                <div className="error">{formik.errors.website}</div>
                            ) : null}
                        </div>
                        <button type="submit">Add Gym</button>
                    </form>
                </div>
            ) : (
                <div>
                    <p>You must be logged in to add a gym.</p>
                    <Link to="/login">
                        <button>Log In</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

            

export default AddGym;