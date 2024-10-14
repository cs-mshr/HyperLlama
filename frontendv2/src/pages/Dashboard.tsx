import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Truck, Users } from 'lucide-react';

interface DashboardData {
  active_drivers: number;
  total_bookings_today: number;
  revenue_today: number;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/logistics/admin/dashboard/overview/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-royal-blue">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          icon={<Truck className="w-8 h-8 text-royal-blue" />}
          title="Active Drivers"
          value={dashboardData.active_drivers}
        />
        <DashboardCard
          icon={<Package className="w-8 h-8 text-cornflower-blue" />}
          title="Bookings Today"
          value={dashboardData.total_bookings_today}
        />
        <DashboardCard
          icon={<Users className="w-8 h-8 text-dodger-blue" />}
          title="Revenue Today"
          value={`$${dashboardData.revenue_today.toFixed(2)}`}
        />
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string }> = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-royal-blue">{value}</p>
    </div>
  );
};

export default Dashboard;