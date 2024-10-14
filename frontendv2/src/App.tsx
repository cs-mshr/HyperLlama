import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import LogisticsDashboard from "./pages/AnalyticsPage";
import DriverHome from "./pages/DriverHome.tsx";
import CreateNewBooking from "./pages/CreateNewBooking.tsx";
import AvailableBookings from "./pages/AvailableBookings.tsx";
import RegisterDriver from "./pages/RegisterDriver.tsx";

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
            <Route path="booking/new" element={<CreateNewBooking />}/>
            <Route path="/home/driver" element={<DriverHome />} />
            <Route path="/bookings/available" element={<AvailableBookings />}/>
            <Route path="/register/driver" element={<RegisterDriver />} />
            {/*<Route path="booking/:bookingId/location" element={<BookingLiveLocation />} />*/}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
