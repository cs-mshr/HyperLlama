import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterDriver: React.FC = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/logistics/driver/register',
        {
          vehicle_id: vehicleId,
          license_number: licenseNumber,
          current_location: currentLocation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Driver registered:', response.data);
      navigate('/home/driver');
    } catch (error) {
      console.error('Error registering driver:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">Register as Driver</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleId">
            Vehicle ID
          </label>
          <input
            id="vehicleId"
            type="text"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="licenseNumber">
            License Number
          </label>
          <input
            id="licenseNumber"
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentLocation">
            Current Location
          </label>
          <input
            id="currentLocation"
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterDriver;
