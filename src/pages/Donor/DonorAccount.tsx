import { NavLink, Outlet } from 'react-router-dom';
import { UserIcon, CreditCardIcon, HeartIcon, Home } from 'lucide-react';
import Header from '../../components/beneficiary/Header/Header';

const navItems = [
  { label : 'Home', path: 'home', icon: <Home className="w-5 h-5" /> }, 
  { label: 'Profile', path: 'profile', icon: <UserIcon className="w-5 h-5" /> },
  { label: 'Transactions', path: 'transactions', icon: <CreditCardIcon className="w-5 h-5" /> },
  { label: 'Donations', path: 'donations', icon: <HeartIcon className="w-5 h-5" /> },
];

export default function DonorAccount() {
  return (
    <>  
    <div className="bg-[#f5f5f5] mb-16">
        <Header />
    </div>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">My Account</h2>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 ${
                  isActive ? 'bg-gray-200 text-blue-600 font-semibold' : 'text-gray-700'
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
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
    </>
  );
}
