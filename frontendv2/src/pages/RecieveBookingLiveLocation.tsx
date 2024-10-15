import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  latitude: number;
  longitude: number;
}

const LocationMap: React.FC<{ location: Location }> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([location.latitude, location.longitude], 13);
  }, [location, map]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[location.latitude, location.longitude]}>
        <Popup>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Popup>
      </Marker>
    </>
  );
};

const RecieveBookingLiveLocation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

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
        <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <LocationMap location={location} />
        </MapContainer>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default RecieveBookingLiveLocation;
