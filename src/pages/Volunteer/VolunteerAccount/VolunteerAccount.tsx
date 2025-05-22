import { NavLink, Outlet } from 'react-router-dom';
import { Home, ClipboardCheck, Clock, User, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { volunteer_get_MessagesvolunteerId } from '../../../reducers/volunteers/volunteerApicalls';
import { Response_ChatsTypes } from '../../../reducers/volunteers/volunteerApicalls';
import Header from '../../../components/beneficiary/Header/Header';

const navItems = [
  { label: 'Home', path: 'home', icon: <Home className="w-5 h-5" /> },
  { label: 'Takeup Stories', path: 'takeup-stories', icon: <ClipboardCheck className="w-5 h-5" /> },
  { label: 'Recent Stories', path: 'recent-stories', icon: <Clock className="w-5 h-5" /> },
  { label: 'Profile', path: 'profile', icon: <User className="w-5 h-5" /> },
  { label: 'Chat', path: 'chats', icon: <MessageSquare className="w-5 h-5" /> },
];

export default function VolunteerAccount() {
  const user = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch<AppDispatch>();
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      dispatch(volunteer_get_MessagesvolunteerId(user.id))
        .unwrap()
        .then((messages: Response_ChatsTypes[]) => {
          let unread = 0;
          messages.forEach((message) => {
            if (!message.isRead) unread++;
          });
          setUnreadChatCount(unread);
        });
    }
  }, [dispatch, user?.id]);

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
          <h2 className="text-xl font-bold text-green-700 mb-6">Volunteer Panel</h2>
          <nav className="space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-100 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                {item.label}
                {item.label === 'Chat' && unreadChatCount > 0 && (
                  <span
                    className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 leading-tight"
                    aria-label={`${unreadChatCount} unread messages`}
                  >
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}
