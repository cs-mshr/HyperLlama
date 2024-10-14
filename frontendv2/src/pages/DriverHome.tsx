import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
          <div key={feedback.id} className="mb-4">
            <p>Booking ID: {feedback.booking}</p>
            <p>Rating: {feedback.rating}</p>
            <p>Comment: {feedback.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookingDetails: React.FC<{ booking: Booking }> = ({ booking }) => {
  return (
    <div className="mb-4 p-4 border rounded shadow">
      <p>ID: {booking.id}</p>
      <p>Pickup Location: {booking.pickup_location}</p>
      <p>Dropoff Location: {booking.dropoff_location}</p>
      <p>Vehicle Type: {booking.vehicle_type}</p>
      <p>Scheduled Time: {new Date(booking.scheduled_time).toLocaleString()}</p>
      <p>Status: {booking.status}</p>
      <p>Estimated Price: ${booking.estimated_price}</p>
    </div>
  );
};

export default DriverHome;
