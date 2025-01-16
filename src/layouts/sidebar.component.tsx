import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full">
      <h2 className="py-4 text-center text-xl font-bold">Menu</h2>
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `w-full px-4 py-3 text-left block ${
                isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`
            }
          >
            Roles and Permissions
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

