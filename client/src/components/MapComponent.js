import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = ({ gyms }) => {
  const [gymLocations, setGymLocations] = useState([]);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  
  const apiKey = 'AIzaSyAB8kLha-OmS7CCm2uaTs7IJpWlFzFtm7A'; // Make sure to keep your API key secure

  useEffect(() => {
    const fetchGymsWithCoordinates = async () => {
      const updatedGyms = [];
      let totalLat = 0;
      let totalLng = 0;

      for (const gym of gyms) {
        try {
          const { lat, lng } = await geocodeAddress(gym.address);
          updatedGyms.push({ ...gym, latitude: lat, longitude: lng });
          totalLat += lat;
          totalLng += lng;
        } catch (error) {
          console.error(`Error geocoding address for gym ${gym.id}:`, error);
        }
      }

      // Calculate the center of the map (average of all gym locations)
      if (updatedGyms.length > 0) {
        setCenter({
          lat: totalLat / updatedGyms.length,
          lng: totalLng / updatedGyms.length,
        });
        setGymLocations(updatedGyms);
      }
    };

    fetchGymsWithCoordinates();
  }, [gyms]);

  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: apiKey,
        },
      });

      if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error('Geocoding failed');
      }
    } catch (error) {
      throw new Error(`Geocoding failed for address ${address}: ${error.message}`);
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {gymLocations.map((gym) => (
          <Marker
            key={gym.id}
            position={{ lat: gym.latitude, lng: gym.longitude }}
            label={gym.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;