import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import EditGymForm from "./EditGymForm";
import { AuthContext,  } from "./AuthContext"
import Navbar from './Navbar'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MapComponent from './MapComponent';

function Gyms() {
  const [gyms, setGyms] = useState([]);
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [selectedGymReviews, setSelectedGymReviews] = useState({});
  const [reviewsVisible, setReviewsVisible] = useState({}); 
  const [showReviewForm, setShowReviewForm] = useState({}); // State to toggle review form
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editGymData, setEditGymData] = useState({});
  

  useEffect(() => {
    console.log(isLoggedIn)
    fetchGyms();
  }, []);

  


  const fetchGyms = () => {
    fetch("http://localhost:5555/gym")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGyms(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  /*const checkSession = () => {
    fetch("http://localhost:5555/session", { credentials: 'include'})
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setIsLoggedIn(data.logged_in);
      })
      .catch((error) => {
        console.error("Error checking session:", error);
        setIsLoggedIn(false); // Set to false if session check fails
      });
  };*/

  const fetchReviews = (gymId) => {
    console.log(gymId)
    if (reviewsVisible[gymId]) {
      // If reviews are already visible, hide them
      setReviewsVisible((prev) => ({ ...prev, [gymId]: false }));
      setSelectedGymReviews((prev) => ({ ...prev, [gymId]: {} }));
    } else {
      // Fetch reviews and show them
      fetch(`http://localhost:5555/gym/${gymId}/reviews`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setSelectedGymReviews((prev) => ({ ...prev, [gymId]: data }));
          setReviewsVisible((prev) => ({ ...prev, [gymId]: true }));
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  };

  

  /*const handleLeaveReview = () => {
    setShowReviewForm(!showReviewForm); // Toggle review form visibility
  };*/

  const handleLeaveReview = (gymId) => {
    console.log(gymId)
    console.log(userId)
    setShowReviewForm((prev) => ({ ...prev, [gymId]: !prev[gymId] }));
  };

  /*const handleSubmitReview = (values) => {
    const { gymId, ...reviewData } = values;*/

  
  const handleSubmitReview = (gymId, values) => {
    console.log(userId)
    const reviewData = { ...values, gym_id:gymId, user_id: userId};
    console.log(gymId)
    console.log(values)
    console.log(reviewData)
    console.log("Review data being sent:", JSON.stringify(reviewData));
    fetch(`/gym/${gymId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
      credentials: 'include',
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Review submitted successfully:", data);
        fetchReviews(gymId); // Refresh reviews after submission
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  const handleDeleteGym = (gymId) => {
    console.log(gymId)
    console.log("delete Gym function called with ID:", gymId)
      if (window.confirm("Are you sure you want to delete this gym?")) {
      fetch(`/gym/${gymId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-type' : 'application/json'
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Gym deleted successfully:", data);
          fetchGyms(); // Refresh gyms after deletion
        })
        .catch((error) => {
          console.error("Error deleting gym:", error);
        });
    }
  };

  const handleEditGym = (gym) => {
    console.log("Editing gym:", gym);
    setEditGymData(gym);
    setShowEditForm(!showEditForm);
  };

  const handleSubmitEditGym = (values) => {
    
    fetch(`http://localhost:5555/gym/${values.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Gym updated successfully:", data);
        setShowEditForm(false);
        fetchGyms(); // Refresh gyms after update
      })
      .catch((error) => {
        console.error("Error updating gym:", error);
      });
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditGymData(null);
  }

  const gymValidationSchema = Yup.object().shape({
    name: Yup.string().required("Gym name is required"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string().required("Phone number is required"),
    website: Yup.string().url("Invalid URL").required("Website is required"),
  });


  return (
    <div>
      <Navbar />
      <h1>Gyms</h1>
      <MapComponent gyms={gyms} />
      <ul>
        {gyms.map((gym) => (
          <li key={gym.id}>
            <h2>{gym.name}</h2>
            <p>Address: {gym.address}</p>
            <p>Phone: {gym.phone}</p>
            <a href={gym.website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
            <button onClick={() => fetchReviews(gym.id)}>
              {reviewsVisible[gym.id] ? "Hide Reviews" : "Show Reviews"}
            </button>
            {reviewsVisible[gym.id] && (
              <div>
                <h3>Reviews:</h3>
                <ul>
                  {selectedGymReviews[gym.id]?.map((review) => (
                    <li key={review.id}>
                      <p>{review.content}</p>
                      <p>Rating: {review.rating}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {isLoggedIn ? (
              <div>
                <button onClick={() =>handleLeaveReview(gym.id)}>
                  {showReviewForm[gym.id] ? "Cancel Review" : "Leave Review"}
                </button>
                {showReviewForm[gym.id]&& (
                  <ReviewForm onSubmit={(values) => handleSubmitReview(gym.id,values)}/>
                )} 
                <button onClick={() => handleEditGym(gym)}>
                  {showEditForm && editGymData?.id === gym.id?   "Cancel" : "Edit Gym"}
                </button>
                {showEditForm && editGymData.id === gym.id && 
                  (<EditGymForm gym={editGymData}
                    onSubmit={handleSubmitEditGym}
                    onCancel={() => setShowEditForm(false)}
                  />
                )}
                  
                <button onClick={() => handleDeleteGym(gym.id)}>
                  Delete Gym
                </button>
              </div>
            ) : (
              <p>Please log in to leave a review or manage gyms.</p>
            )}
          </li>
        ))}
      </ul>

      
  </div>
);
}

export default Gyms;
      