import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../Navbar';

const EVotingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = 'abhinavx04'; // This should come from your auth context

  // Fix the paths to match App.tsx route configuration
  const navItems = [
    { name: 'Active Issues', path: '/vote' },
    { name: 'Create Issue', path: '/vote/create' }, // Changed from /evoting/createIssue
    { name: 'My Votes', path: '/vote/my-votes' },
  ];

  // Updated active path check to handle nested routes
  const isActivePath = (path: string) => {
    if (path === '/vote') {
      return location.pathname === '/vote';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      
      <Navbar currentUser={currentUser} />

      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-['Syncopate'] text-white mb-4 tracking-wider">
            E-VOTING PORTAL
          </h1>
          <p className="text-gray-400">
            Raise and vote on city issues. Top voted issues will be addressed within 30 days.
          </p>
        </div>

        {/* Updated Navigation using Links instead of buttons */}
        <div className="flex space-x-4 mb-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300
                ${isActivePath(item.path)
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/50'
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Issues"
            value="12"
            icon="📝"
            trend="+2 this week"
          />
          <StatCard
            title="Total Votes"
            value="156"
            icon="🗳️"
            trend="+23 today"
          />
          <StatCard
            title="Issues Resolved"
            value="8"
            icon="✅"
            trend="75% resolution rate"
          />
          <StatCard
            title="Days Until Next Review"
            value="15"
            icon="⏳"
            trend="Next: Mar 7"
          />
        </div>

        {/* Main Content Area */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
    <div className="flex items-center justify-between mb-4">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-green-400">{trend}</span>
    </div>
    <div className="space-y-2">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-3xl text-white font-semibold">{value}</p>
    </div>
  </div>
);

export default EVotingDashboard;