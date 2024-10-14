import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/logistics/register/', {
        username,
        email,
        password1,
        password2
      });
      localStorage.setItem('token', response.data.key);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error (show message to user)
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-royal-blue">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            id="username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password1" className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            id="password1"
            className="input"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password2" className="block mb-2 font-medium">Confirm Password</label>
          <input
            type="password"
            id="password2"
            className="input"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;