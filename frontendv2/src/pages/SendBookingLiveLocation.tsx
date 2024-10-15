import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LocationMap from '../components/LocationMap';
import {MapContainer} from "react-leaflet";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const SendBookingLiveLocation: React.FC = () => {
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const sendLocationUpdate = async (latitude: number, longitude: number) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://127.0.0.1:8000/logistics/driver/location/update/',
          { latitude, longitude },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Location update response:', response.data);
      } catch (error) {
        console.error('Error sending location update:', error);
      }
    };

    const updateLocation = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const timestamp = position.timestamp;

      const newLocation = { latitude, longitude, timestamp };
      setCurrentLocation(newLocation);

      setLocationData((prevData) => {
        const newData = [newLocation, ...prevData];
        return newData.slice(0, 10);
      });

      sendLocationUpdate(latitude, longitude);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Error getting location:', error);
    };

    const startLocationUpdates = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updateLocation, handleError, {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    startLocationUpdates();

    const intervalId = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">Live Location Tracking</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Latest 10 Location Updates</h2>
        <ul>
          {locationData.map((data, index) => (
            <li key={index}>
              Latitude: {data.latitude}, Longitude: {data.longitude}, Timestamp: {new Date(data.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      {currentLocation && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Current Location</h2>
        <MapContainer center={[currentLocation.latitude, currentLocation.longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <LocationMap location={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }} />
        </MapContainer>
        </div>
      )}
    </div>
  );
};

export default SendBookingLiveLocation;
