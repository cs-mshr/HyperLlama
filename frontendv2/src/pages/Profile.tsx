import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfile {
  user_data: {
    id: number;
    phone_number: string;
    name: string;
    is_admin: boolean;
    is_driver: boolean;
    email: string;
  };
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/logistics/users/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setEmail(response.data.user_data.email || '');
        setPhoneNumber(response.data.user_data.phone_number || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://127.0.0.1:8000/logistics/users/profile/', {
        email,
        phone_number: phoneNumber,
        password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.response.data);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-royal-blue">My Profile</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <p><strong>Name:</strong> {profile.user_data.name}</p>
          <p><strong>Email:</strong> {profile.user_data.email}</p>
          <p><strong>Phone Number:</strong> {profile.user_data.phone_number}</p>
          <p><strong>Admin:</strong> {profile.user_data.is_admin ? 'Yes' : 'No'}</p>
          <p><strong>Driver:</strong> {profile.user_data.is_driver ? 'Yes' : 'No'}</p>
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <ProfileField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <ProfileField label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <ProfileField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>
  );
};

const ProfileField: React.FC<{ label: string; value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => {
  return (
      <div>
        <label className="font-semibold text-gray-700">{label}:</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="ml-2 p-2 border rounded"
        />
      </div>
  );
};

export default Profile;