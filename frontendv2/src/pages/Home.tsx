import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserData {
    id: number;
    phone_number: string;
    name: string;
    is_admin: boolean;
    is_driver: boolean;
}

interface Booking {
    booking_id: number;
    user_id: number;
    driver_id: number | null;
    vehicle_type: string;
    pickup_location: string;
    dropoff_location: string;
    status: string;
    created_at: string;
    updated_at: string;
    scheduled_time: string;
    estimated_price: number;
    actual_price: number | null;
}

interface ProfileData {
    user_data: UserData;
    bookings: Booking[];
}

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/logistics/users/profile/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-royal-blue">Profile</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">User Information</h2>
                <p><strong>Name:</strong> {profileData.user_data.name}</p>
                <p><strong>Phone Number:</strong> {profileData.user_data.phone_number}</p>
                <p><strong>Admin:</strong> {profileData.user_data.is_admin ? 'Yes' : 'No'}</p>
                <p><strong>Driver:</strong> {profileData.user_data.is_driver ? 'Yes' : 'No'}</p>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
                {profileData.bookings.map((booking) => (
                    <div key={booking.booking_id} className="mb-4 p-4 border rounded-lg shadow-md">
                        <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                        <p><strong>Vehicle Type:</strong> {booking.vehicle_type}</p>
                        <p><strong>Pickup Location:</strong> {booking.pickup_location}</p>
                        <p><strong>Dropoff Location:</strong> {booking.dropoff_location}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Scheduled Time:</strong> {new Date(booking.scheduled_time).toLocaleString()}</p>
                        <p><strong>Estimated Price:</strong> ${booking.estimated_price}</p>
                        <p><strong>Actual Price:</strong> {booking.actual_price ? `$${booking.actual_price}` : 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;