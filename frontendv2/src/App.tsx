import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import LogisticsDashboard from "./pages/AnalyticsPage";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<LogisticsDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;