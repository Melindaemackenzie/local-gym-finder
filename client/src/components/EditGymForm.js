import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const gymValidationSchema = Yup.object().shape({
  name: Yup.string().required("Gym name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone number is required"),
  website: Yup.string().url("Invalid URL").required("Website is required"),
});

const EditGymForm = ({ gym, onSubmit, onCancel }) => {
    console.log('EditGymForm props", gym')
  return (
    <div>
      <h2>Edit Gym</h2>
      <Formik
        initialValues={gym}
        validationSchema={gymValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <div>
              <label htmlFor="name">Gym Name</label>
              <Field
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <Field
                id="address"
                name="address"
                type="text"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="address" component="div" />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <Field
                id="phone"
                name="phone"
                type="text"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="phone" component="div" />
            </div>
            <div>
              <label htmlFor="website">Website</label>
              <Field
                id="website"
                name="website"
                type="text"
                value={values.website}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="website" component="div" />
            </div>
            <button type="submit">Submit</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditGymForm;
