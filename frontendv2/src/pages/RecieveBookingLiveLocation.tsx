import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Location {
  latitude: number;
  longitude: number;
}

const RecieveBookingLiveLocation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDriverId = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/logistics/bookings/${bookingId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDriverId(response.data.driver);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchDriverId();
  }, [bookingId]);

  useEffect(() => {
    if (driverId !== null) {
      const ws = new WebSocket(`ws://localhost:8000/ws/get_driver/location/${driverId}/`);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'location_update') {
          setLocation(data.location);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        ws.close();
      };
    }
  }, [driverId]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">Driver Live Location</h1>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default RecieveBookingLiveLocation;
