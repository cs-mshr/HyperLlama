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

const AvailableBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/logistics/driver/bookings/available/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleAccept = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/logistics/driver/bookings/${bookingId}/accept/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'ACCEPTED' } : booking
        )
      );
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">Available Bookings</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-royal-blue text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Pickup</th>
              <th className="py-3 px-4 text-left">Dropoff</th>
              <th className="py-3 px-4 text-left">Vehicle</th>
              <th className="py-3 px-4 text-left">Scheduled Time</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{booking.id}</td>
                <td className="py-3 px-4">{booking.pickup_location}</td>
                <td className="py-3 px-4">{booking.dropoff_location}</td>
                <td className="py-3 px-4">{booking.vehicle_type}</td>
                <td className="py-3 px-4">{new Date(booking.scheduled_time).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 px-4">${booking.estimated_price}</td>
                <td className="py-3 px-4">
                  {booking.status === 'PENDING' && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleAccept(booking.id)}
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-200 text-yellow-800';
    case 'ACCEPTED':
      return 'bg-blue-200 text-blue-800';
    case 'EN_ROUTE':
      return 'bg-purple-200 text-purple-800';
    case 'DELIVERED':
      return 'bg-green-200 text-green-800';
    case 'CANCELLED':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export default AvailableBookings;
