import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookingDetails from '../components/BookingDetails';
import FeedbackDetails from "../components/FeedBackDetails.tsx";

interface Booking {
  id: number;
  vehicle_type: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  scheduled_time: string;
  estimated_price: string;
}

interface DriverProfile {
  id: number;
  user: number;
  vehicle: string | null;
  license_number: string;
  current_location: string;
}

interface Feedback {
  id: number;
  booking: number;
  rating: number;
  comment: string;
}

interface DriverData {
  driver: DriverProfile;
  bookings: Booking[];
  feedbacks: Feedback[];
}

const DriverHome: React.FC = () => {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [acceptedBooking, setAcceptedBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/logistics/driver/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDriverData(response.data);

        const accepted = response.data.bookings.find((booking: Booking) => booking.status === 'ACCEPTED');
        setAcceptedBooking(accepted || null);
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };

    fetchDriverData();
  }, []);

  if (!driverData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">Driver Profile</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Driver Information</h2>
        <p>ID: {driverData.driver.id}</p>
        <p>License Number: {driverData.driver.license_number}</p>
        <p>Current Location: {driverData.driver.current_location}</p>
      </div>
      {acceptedBooking ? (
        <div>
          <h2 className="text-2xl font-bold">Accepted Booking</h2>
          <BookingDetails booking={acceptedBooking} />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold">Other Bookings</h2>
          {driverData.bookings.map((booking) => (
            <BookingDetails key={booking.id} booking={booking} />
          ))}
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Feedbacks</h2>
        {driverData.feedbacks.map((feedback) => (
          <FeedbackDetails key={feedback.id} feedback={feedback} />
        ))}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
        onClick={() => navigate('/bookings/available')}
      >
        Show Available Bookings
      </button>
    </div>
  );
};

export default DriverHome;
