import React, { useEffect, useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

const DriverLocation: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const driverId = 26; // Hardcoded driver_id

  useEffect(() => {
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

export default DriverLocation;
