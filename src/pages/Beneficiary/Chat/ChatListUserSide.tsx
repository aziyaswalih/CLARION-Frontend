import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { volunteer_get_MessagesvolunteerId, volunteer_get_UserDetails } from "../../../reducers/volunteers/volunteerApicalls";
import { AppDispatch, RootState } from "../../../store/store";
import ChatDetails from "./ChatMessageComponent";
// import { useNavigate } from "react-router-dom";
import { Response_ChatsTypes, UserStateTypes } from "../../../reducers/volunteers/volunteerApicalls";
import socket from "../../../socket/socket";

const ChatList = () => {
  const volunteer  = useSelector((state: RootState) => state.users.user);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<Response_ChatsTypes[]>([]);
  const [userDetails, setUserDetails] = useState<Map<string, UserStateTypes>>(new Map()); // Map to store user details
  const dispatch: AppDispatch = useDispatch();
// const navigate=useNavigate()

  useEffect(() => {
    if (volunteer?.id) {
      console.log(volunteer.id, "volunteer id");
          // Handler for receiving new chat messages
   
      
      dispatch(volunteer_get_MessagesvolunteerId(volunteer.id))
        .unwrap()
        .then(async (messages: Response_ChatsTypes[]) => {
          console.log(messages);

          // Extract unique connections based on sender and receiver
          const uniqueConnections = new Map<string, Response_ChatsTypes>();

          // Map over messages to build unique connections
          messages.forEach((message) => {
            const otherUserId =
              message.sender === volunteer.id ? message.receiver : message.sender;

            if (!uniqueConnections.has(otherUserId)) {
              uniqueConnections.set(otherUserId, message);
            }
          });

          // Now fetch user details for each unique user
          const userIds = Array.from(uniqueConnections.keys());
          const userDetailsPromises = userIds.map((userId) =>
            dispatch(volunteer_get_UserDetails(userId)).unwrap() // Unwrap the payload to access user data
          );
          
          try {
            // Wait for all user details to be fetched
            const details = await Promise.all(userDetailsPromises);

            // Create a map of user details with userId as key
            const userDetailsMap = new Map<string, UserStateTypes>();
            details.forEach((user:any, index:any) => {
              userDetailsMap.set(userIds[index], user); // Map userId to user data
            });
            console.log(userDetailsMap, "user details map");
            console.log(userDetailsPromises, "user details promises");
            
            setUserDetails(userDetailsMap); // Store user details in state
            setChatList(Array.from(uniqueConnections.values())); // Store the unique chat list
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        })
        .catch((error:any) => {
          console.error("Error fetching chats:", error);
        });
    }
  }, [dispatch, volunteer?.id]);
  const handleMessage = () => { // Ensure data includes _id
    if (!volunteer?.id) {
      console.warn("User ID is missing!");
      throw new Error("User ID is missing!");
    }
          dispatch(volunteer_get_MessagesvolunteerId(volunteer.id))
        .unwrap()
        .then(async (messages: Response_ChatsTypes[]) => {
          console.log(messages);

          // Extract unique connections based on sender and receiver
          const uniqueConnections = new Map<string, Response_ChatsTypes>();

          // Map over messages to build unique connections
          messages.forEach((message) => {
            const otherUserId =
              message.sender === volunteer?.id ? message.receiver : message.sender;

            if (!uniqueConnections.has(otherUserId)) {
              uniqueConnections.set(otherUserId, message);
            }
          });

          // Now fetch user details for each unique user
          const userIds = Array.from(uniqueConnections.keys());
          const userDetailsPromises = userIds.map((userId) =>
            dispatch(volunteer_get_UserDetails(userId)).unwrap() // Unwrap the payload to access user data
          );
          
          try {
            // Wait for all user details to be fetched
            const details = await Promise.all(userDetailsPromises);

            // Create a map of user details with userId as key
            const userDetailsMap = new Map<string, UserStateTypes>();
            details.forEach((user:any, index:any) => {
              userDetailsMap.set(userIds[index], user); // Map userId to user data
            });
            console.log(userDetailsMap, "user details map");
            console.log(userDetailsPromises, "user details promises");
            
            setUserDetails(userDetailsMap); // Store user details in state
            setChatList(Array.from(uniqueConnections.values())); // Store the unique chat list
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        })
        .catch((error:any) => {
          console.error("Error fetching chats:", error);
        });
        };
      socket.on("chatMessage", handleMessage);

  return (
    <>
 <div className="flex h-screen bg-gray text-black-200">
  {/* Left side: Chat list */}
  <div className="w-1/4 bg-gradient-to-b from-white-900 to-white-800 p-6 shadow-lg rounded-xl overflow-y-auto max-h-screen border border-gray-700">
  <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-cyan-400">Chat List</h2>
  {/* <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition" onClick={()=>navigate(-1)}>
    Close
  </button> */}
</div>

    <div className="space-y-6">
      {chatList.map((chat) => {
        // chat = Object.values(chat).sort((a:any,b:any)=>(b.timestamp-a.timestamp))
        const { message, timestamp } = chat;
        const userId = chat.sender === volunteer?.id ? chat.receiver : chat.sender;

        const user = userDetails.get(userId); // Fetch the user details
        console.log(user, "user details");
        
        return (
          <div
            key={userId}
            className="flex items-center p-4 bg-white rounded-lg cursor-pointer hover:bg-cyan-900 transition-transform duration-300 transform hover:-translate-y-1 shadow-lg"
            onClick={() => setSelectedUserId(userId)}
          >
            {/* Profile Picture */}
            <img
              src={`${import.meta.env.VITE_SOCKET_URL}${user?.profilePic}` as string|| "default-avatar.png"}
              alt={user?.name || "User"}
              className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400"
            />
            <div className="ml-4 flex-1">
              <h4 className="text-lg font-semibold text-black-200">{user?.name}</h4>
              <p className="text-sm text-black-400 truncate">{message}</p>
            </div>
            <small className="text-sm text-gray-500">
              {timestamp ? new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }) : "N?A"}
            </small>
          </div>
        );
      })}
    </div>
  </div>

  {/* Right side: Chat details */}
  <div className="flex-1 bg-gradient-to-b from-gray-100 to-white p-8 shadow-2xl rounded-xl overflow-hidden ml-5 max-h-screen border border-gray-700">
  {selectedUserId ? (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <ChatDetails volunteerId={volunteer?.id || ""} userId={selectedUserId} />
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-500">Start a Conversation</h2>
        <p className="text-gray-600 mt-2">Select a user from the list to begin chatting.</p>
      </div>
    </div>
  )}
</div>
</div>


      </>
  );
};

export default ChatList;
