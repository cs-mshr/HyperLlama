import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', {
        username,
        password,
        email
      });
      localStorage.setItem('token', response.data.key);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-royal-blue">Login</h2>
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
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium">Password</label>
            <input
                type="password"
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>
      </div>
  );
};

export default Login;