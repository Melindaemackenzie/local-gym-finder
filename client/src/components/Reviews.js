import React, { useEffect, useState } from "react";
import axios from "axios";


function Reviews() {
    const [gymName, setGymName] = useState('');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get('/reviews')
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }, []);

    const handleSearch = () => {
        axios.get(`/reviews?gym_name=${gymName}`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    };

    return (
        <div>
            <h1>Reviews</h1>
            <input
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="Enter gym name to search"
            />
            <button onClick={handleSearch}>Search</button>

            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <p>{review.content}</p>
                        <p>Rating: {review.rating}</p>
                        <p>Gym: {review.gym.name}</p> {/* Assuming 'gym' contains a 'name' property */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Reviews;