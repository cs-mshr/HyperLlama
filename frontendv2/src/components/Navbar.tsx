import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import axios from 'axios';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

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
            <Link to="/login" className="hover:text-sea-pink">Login</Link>
            <Link to="/register" className="hover:text-sea-pink">Register</Link>
            <button onClick={handleLogout} className="hover:text-sea-pink">Logout</button>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;