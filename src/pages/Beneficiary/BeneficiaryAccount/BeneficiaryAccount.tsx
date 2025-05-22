import { NavLink, Outlet } from 'react-router-dom';
import { Home, User, BookOpen, MessageSquare } from 'lucide-react';
import Header from '../../../components/beneficiary/Header/Header';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { User_get_MessagesUserId } from '../../../reducers/beneficiary/beneficiaryApicalls';
import { Response_ChatsTypes } from '../../../reducers/volunteers/volunteerApicalls';

const navItems = [
  { label: 'Home', path: 'home', icon: <Home className="w-5 h-5" /> },
  { label: 'Profile', path: 'profile', icon: <User className="w-5 h-5" /> },
  { label: 'Stories', path: 'stories', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Chat', path: 'chats', icon: <MessageSquare className="w-5 h-5" /> },
];

export default function BeneficiaryAccount() {
  const user = useSelector((state:RootState) => state.users.user)
  const dispatch = useDispatch<AppDispatch>();
  const [unreadChatCount, setUnreadChatCount] = useState(0); 

  useEffect(() => {
          if (user?.id) {
            console.log(user.id, "user id");
            
            dispatch(User_get_MessagesUserId(user.id))
              .unwrap()
              .then(async (messages: Response_ChatsTypes[]) => {
                console.log(messages);
                let prevCount = 0;
                // Extract unique connections based on sender and receiver
              //   const uniqueConnections = new Map<string, Response_ChatsTypes>();
      
                // Map over messages to build unique connections
                messages.forEach((message) => {
                  if(message.isRead===false && message.receiver===user.id){
                    prevCount++;
                    // setUnreadChatCount((prevCount) => prevCount + 1); // Increment unread count
                  }
             
              })
                setUnreadChatCount(prevCount);
                console.log(prevCount, "prev count");
              
              
          })
          }
        }, [dispatch]);

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
                {item.label === 'Chat' && unreadChatCount > 0 && (
                  <span
                    className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 leading-tight"
                    aria-label={`${unreadChatCount} unread messages`} // For accessibility
                  >
                    {unreadChatCount > 99 ? '99+' : unreadChatCount} {/* Display count, cap at 99+ */}
                  </span>
                )}
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


