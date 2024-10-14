import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Booking {
  booking_id: number;
  pickup_location: string;
  dropoff_location: string;
  vehicle_type: string;
  scheduled_time: string;
  status: string;
  estimated_price: number;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/logistics/bookings/', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            from_date: '2023-01-01',
            to_date: '2025-01-01'
          }
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">My Bookings</h1>
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
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{booking.booking_id}</td>
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

export default Bookings;