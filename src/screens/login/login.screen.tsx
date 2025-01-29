import React, { useState } from 'react';
import { postRequest } from '../../core-services/rest-api/apiHelpers';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value, // Dynamically update the state based on input `id`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null); // Reset error state if needed
   
  
    try {
      const response = await axios.post('http://localhost:3000/gateway/ssologin', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const { accessToken, user } = response.data;
  
      dispatch(setAuthData({ accessToken, user }));
  
      toast.success(`Login successful! Welcome ${user.name}`, {
        position: 'bottom-right',
        autoClose: 3000, // Closes automatically after 3 seconds
      });
  
      navigate('/clients');
    } catch (err: any) {
      console.error('Login failed:', err.response?.data?.message || err.message);
  
      toast.error(err.response?.data?.message || 'An error occurred while logging in.', {
        position: 'bottom-right',
        autoClose: 3000, // Closes automatically after 3 seconds
      });
  
      // setError(err.response?.data?.message || 'An error occurred while logging in.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-left text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-left text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 py-2 font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
