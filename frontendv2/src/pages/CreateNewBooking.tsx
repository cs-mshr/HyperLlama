import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SelectableMap from '../components/SelectableMap';

const CreateNewBooking: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [vehicleType, setVehicleType] = useState('CAR');
  const [scheduledTime, setScheduledTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/logistics/bookings/create/',
        {
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          vehicle_type: vehicleType,
          scheduled_time: scheduledTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Booking created:', response.data);
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">Create New Booking</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupLocation">
            Pickup Location
          </label>
          <SelectableMap onLocationSelect={(lat, lng) => setPickupLocation({ latitude: lat, longitude: lng })} />
          {pickupLocation && (
            <p>
              Selected Pickup Location: Latitude: {pickupLocation.latitude}, Longitude: {pickupLocation.longitude}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropoffLocation">
            Dropoff Location
          </label>
          <SelectableMap onLocationSelect={(lat, lng) => setDropoffLocation({ latitude: lat, longitude: lng })} />
          {dropoffLocation && (
            <p>
              Selected Dropoff Location: Latitude: {dropoffLocation.latitude}, Longitude: {dropoffLocation.longitude}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleType">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
            <option value="TRUCK">Truck</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduledTime">
            Scheduled Time
          </label>
          <input
            id="scheduledTime"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewBooking;
