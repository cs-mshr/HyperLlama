import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import axios from 'axios';

interface UserProfile {
  id: number;
  phone_number: string;
  name: string;
  is_admin: boolean;
  is_driver: boolean;
}

const Navbar: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/logistics/users/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data.user_data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/dj-rest-auth/logout/', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-royal-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Truck size={24} />
          <span className="text-xl font-bold">LogiTrack</span>
        </Link>
        <div className="space-x-4">
          {userProfile && (
            <>
              <Link to="/profile" className="hover:text-sea-pink">Profile</Link>
              {userProfile.is_admin && (
                <>
                  <Link to="/dashboard" className="hover:text-sea-pink">Dashboard</Link>
                  <Link to="/analytics" className="hover:text-sea-pink">Analytics</Link>
                </>
              )}
              {userProfile.is_driver && (
                <>
                  <Link to="/home/driver" className="hover:text-sea-pink">Home Driver</Link>
                  <Link to="/bookings/available" className="hover:text-sea-pink">Show Available Bookings</Link>
                </>
              )}
              {!userProfile.is_admin && !userProfile.is_driver && (
                <>
                  <Link to="/register/driver" className="hover:text-sea-pink">Register Driver</Link>
                  <Link to="/booking/new" className="hover:text-sea-pink">New Booking</Link>
                  <Link to="/bookings" className="hover:text-sea-pink">Bookings</Link>
                </>
              )}
            </>
          )}
          <Link to="/login" className="hover:text-sea-pink">Login</Link>
          <Link to="/register" className="hover:text-sea-pink">Register</Link>
          <button onClick={handleLogout} className="hover:text-sea-pink">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
