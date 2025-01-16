import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuthData } from '../store/slices/authSlice';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Clear Redux store
    dispatch(clearAuthData());

    // Redirect to login page
    navigate('/login');
  };

  const handleChangePassword = () => {
    // Implement change password functionality
    console.log('Change Password clicked');
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="https://www.canterburypilgrimages.com/wp-content/uploads/2021/04/dummy-logo-5b.png"
              alt="Company Logo"
              className="h-15 w-20"
            />
          </div>
        </div>

        {/* Right Section: Search, Links, and Profile */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              aria-label="Search"
              className="w-48 rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
              aria-hidden="true"
            >
              ⌘K
            </span>
          </div>

          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Profile"
                className="h-8 w-8 rounded-full border border-gray-300"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={handleChangePassword}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleChangePassword}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
