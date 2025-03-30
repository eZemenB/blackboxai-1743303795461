import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="w-64 bg-white shadow-sm">
      <div className="p-4">
        <nav className="mt-6">
          <div className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
              }
            >
              <span className="truncate">Dashboard</span>
            </NavLink>
            
            <NavLink
              to="/projects/new"
              className={({ isActive }) => 
                `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
              }
            >
              <span className="truncate">New Project</span>
            </NavLink>

            {user?.is_staff && (
              <NavLink
                to="/admin"
                className={({ isActive }) => 
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                }
              >
                <span className="truncate">Admin Panel</span>
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;