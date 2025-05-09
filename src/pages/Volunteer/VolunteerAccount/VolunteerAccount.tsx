import { NavLink, Outlet } from 'react-router-dom';
import { Home, UserIcon, ListChecks, Clock, MessageCircle } from 'lucide-react';
import Header from '../../../components/beneficiary/Header/Header';

const volunteerNavItems = [
  { label: 'Home', path: 'home', icon: <Home className="w-5 h-5" /> },
  { label: 'Profile', path: 'profile', icon: <UserIcon className="w-5 h-5" /> },
  { label: 'Takeup Stories', path: 'takeup-stories', icon: <ListChecks className="w-5 h-5" /> },
  { label: 'Recent Stories', path: 'recent-stories', icon: <Clock className="w-5 h-5" /> },
  { label: 'Chat', path: 'chat', icon: <MessageCircle className="w-5 h-5" /> },
];

export default function VolunteerAccount() {
  return (
    <>
      <div className="bg-[#f5f5f5] mb-16">
        <Header />
      </div>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-blue-700">Volunteer Panel</h2>
          <nav className="space-y-3">
            {volunteerNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}
