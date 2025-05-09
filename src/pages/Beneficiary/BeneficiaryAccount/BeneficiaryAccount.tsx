import { NavLink, Outlet } from 'react-router-dom';
import { Home, User, BookOpen, MessageSquare } from 'lucide-react';
import Header from '../../../components/beneficiary/Header/Header';

const navItems = [
  { label: 'Home', path: 'home', icon: <Home className="w-5 h-5" /> },
  { label: 'Profile', path: 'profile', icon: <User className="w-5 h-5" /> },
  { label: 'Stories', path: 'stories', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Chat', path: 'chats', icon: <MessageSquare className="w-5 h-5" /> },
];

export default function BeneficiaryAccount() {
  return (
    <>
      {/* Header */}
      <div className="bg-[#f5f5f5] mb-16">
        <Header />
      </div>

      {/* Layout */}
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-md p-6">
          <h2 className="text-xl font-bold text-brown-600 mb-6">My Accounts</h2>
          <nav className="space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}


