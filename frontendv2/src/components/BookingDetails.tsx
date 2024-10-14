import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: number;
  vehicle_type: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  scheduled_time: string;
  estimated_price: string;
}

const BookingDetails: React.FC<{ booking: Booking }> = ({ booking }) => {
  const navigate = useNavigate();

  const updateBookingStatus = async (status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://127.0.0.1:8000/logistics/driver/bookings/${booking.id}/status/`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Status updated:', response.data);
      if (status === 'EN_ROUTE') {
        navigate(`/booking/${booking.id}/location`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div className="mb-4 p-4 border rounded shadow">
      <p>ID: {booking.id}</p>
      <p>Pickup Location: {booking.pickup_location}</p>
      <p>Dropoff Location: {booking.dropoff_location}</p>
      <p>Vehicle Type: {booking.vehicle_type}</p>
      <p>Scheduled Time: {new Date(booking.scheduled_time).toLocaleString()}</p>
      <p>Status: {booking.status}</p>
      <p>Estimated Price: ${booking.estimated_price}</p>
      {booking.status === 'ACCEPTED' && (
        <div className="mt-4 space-x-2">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => updateBookingStatus('EN_ROUTE')}
          >
            START
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => updateBookingStatus('CANCELLED')}
          >
            CANCEL
          </button>
        </div>
      )}
      {booking.status === 'EN_ROUTE' && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate(`/booking/${booking.id}/location`)}
        >
          Location Sharing Page
        </button>
      )}
      {(booking.status !== 'CANCELLED' && booking.status !== 'DELIVERED' && booking.status !== 'ACCEPTED') && (
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => updateBookingStatus('DELIVERED')}
        >
          MARK COMPLETED
        </button>
      )}
    </div>
  );
};

export default BookingDetails;
