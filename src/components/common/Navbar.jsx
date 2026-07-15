import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart size={20} /> },
  ];

  return (
    <nav className="bg-card dark:bg-[#0b0f19] w-full md:w-64 md:h-screen border-b md:border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between fixed md:relative z-10 bottom-0 md:bottom-auto">
      <div>
        {/* Brand Header */}
        <div className="hidden md:flex items-center gap-3 px-6 h-20 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Startup CRM</h1>
            <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">LITE V1.0</span>
          </div>
        </div>

        {/* Navigation list */}
        <ul className="flex md:flex-col justify-around md:justify-start md:mt-6 p-2 md:p-4 gap-2 items-center md:items-stretch w-full">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all border ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-950 dark:hover:text-gray-100'
                  }`
                }
              >
                {item.icon}
                <span className="hidden md:inline text-sm">{item.name}</span>
              </NavLink>
            </li>
          ))}
          <li className="md:hidden">
            <DarkModeToggle minimal={true} />
          </li>
        </ul>
      </div>
      
      {/* Bottom Area */}
      <div className="hidden md:flex flex-col border-t border-gray-200 dark:border-gray-800">
        {/* Theme switch row */}
        <div className="flex items-center justify-between p-4">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Theme</span>
          <div className="w-16">
            <DarkModeToggle minimal={true} />
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">John Doe</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">john@startup.co</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
