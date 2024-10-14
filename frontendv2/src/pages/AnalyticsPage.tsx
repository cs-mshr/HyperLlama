import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/logistics/admin';

const LogisticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        overview: null,
        bookingStats: null,
        tripStats: null,
        chartData: null,
        vehicles: [],
        drivers: [],
        bookings: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [
                    overviewResponse,
                    bookingStatsResponse,
                    tripStatsResponse,
                    chartDataResponse,
                    vehiclesResponse,
                    driversResponse,
                    bookingsResponse
                ] = await Promise.all([
                    axios.get(`${API_BASE_URL}/dashboard/overview/`, { headers }),
                    axios.get(`${API_BASE_URL}/bookings/stats/`, { headers }),
                    axios.get(`${API_BASE_URL}/trips/stats/`, { headers }),
                    axios.get(`${API_BASE_URL}/dashboard/charts/`, { headers }),
                    axios.get(`${API_BASE_URL}/vehicles/`, { headers }),
                    axios.get(`${API_BASE_URL}/drivers/`, { headers }),
                    axios.get(`${API_BASE_URL}/bookings/`, { headers })
                ]);

                setDashboardData({
                    overview: overviewResponse.data,
                    bookingStats: bookingStatsResponse.data,
                    tripStats: tripStatsResponse.data,
                    chartData: chartDataResponse.data,
                    vehicles: vehiclesResponse.data,
                    drivers: driversResponse.data,
                    bookings: bookingsResponse.data
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
                <span className="ml-2">Loading dashboard data...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Logistics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-lg mb-2">Active Drivers</h3>
                    <p className="text-gray-700">{dashboardData.overview?.active_drivers}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-lg mb-2">Total Bookings Today</h3>
                    <p className="text-gray-700">{dashboardData.overview?.total_bookings_today}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-lg mb-2">Revenue Today</h3>
                    <p className="text-gray-700">${dashboardData.overview?.revenue_today}</p>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 mb-6">
                <h3 className="font-semibold text-lg mb-4">Bookings Over Time</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dashboardData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Vehicle List</h3>
                    <ul className="list-disc pl-5">
                        {dashboardData.vehicles.map((vehicle) => (
                            <li key={vehicle.id} className="mb-2">
                                {vehicle.type} - {vehicle.license_plate} (Capacity: {vehicle.capacity}, Available: {vehicle.is_available ? 'Yes' : 'No'})
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Driver List</h3>
                    <ul className="list-disc pl-5">
                        {dashboardData.drivers.map((driver) => (
                            <li key={driver.id} className="mb-2">
                                Driver ID: {driver.id} - License: {driver.license_number}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
                <ul className="list-disc pl-5">
                    {dashboardData.bookings.slice(0, 5).map((booking) => (
                        <li key={booking.id} className="mb-2">
                            Booking ID: {booking.id} - Status: {booking.status} - From: {booking.pickup_location} To: {booking.dropoff_location}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LogisticsDashboard;
