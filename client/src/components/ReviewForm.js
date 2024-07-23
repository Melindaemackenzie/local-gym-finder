import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ReviewForm = ({ onSubmit }) => {
    return (
      <Formik
        initialValues={{ content: "", rating: "" }}
        validationSchema={Yup.object({
          content: Yup.string().required("Required"),
          rating: Yup.number()
            .required("Required")
            .min(1, "Must be at least 1")
            .max(10, "Must be at most 10")
        })}
        onSubmit={(values, { resetForm }) => {
          console.log(values)
          /*console.log(gymId)*/
          onSubmit(values);
          resetForm();
        }}
      >
        <Form>
          <div>
            <label htmlFor="content">Content</label>
            <Field id='content' name="content" as="textarea" />
            <ErrorMessage name="content" component="div" />
          </div>
          <div>
            <label htmlFor="rating">Rating (1-10)</label>
            <Field name="rating" type="number" />
            <ErrorMessage name="rating" component="div" />
          </div>
          <button type="submit">Submit Review</button>
        </Form>
      </Formik>
    );
  };
  
  export default ReviewForm;