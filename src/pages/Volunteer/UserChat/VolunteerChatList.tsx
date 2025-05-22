import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import UserChatDetails from "./VolunteerChatDetails";
import { User_get_MessagesUserId, user_get_volunteerDetails } from "../../../reducers/beneficiary/beneficiaryApicalls";
import { Response_ChatsTypes, UserStateTypes } from "../../../reducers/volunteers/volunteerApicalls";
import socket from "../../../socket/socket";

const VolunteerChatList = ({userId=null}:{userId:string | null}) => {
  const volunteer  = useSelector((state: RootState) => state.users.user);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId);
  const [chatList, setChatList] = useState<Response_ChatsTypes[]>([]);
  const [userDetails, setUserDetails] = useState<Map<string, UserStateTypes>>(new Map()); // Store user details
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!volunteer?.id) {
      console.warn("User ID is missing!");
      return;
    }

    dispatch(User_get_MessagesUserId(volunteer.id))
      .unwrap()
      .then(async (messages: Response_ChatsTypes[]) => {
        console.log("User Messages:", messages);

        const uniqueConnections = new Map<string, Response_ChatsTypes>();

        messages.forEach((message) => {
          const otherUserId = message.sender === volunteer.id ? message.receiver : message.sender;
          if (!uniqueConnections.has(otherUserId)) {
            uniqueConnections.set(otherUserId, message);
          }
        });

        const VolunteerIds = Array.from(uniqueConnections.keys());

        const userDetailsPromises = VolunteerIds.map((empId) =>
        
          dispatch(user_get_volunteerDetails(empId.toString())).unwrap()
        );

        try {
          const userDetailsResults = await Promise.allSettled(userDetailsPromises);
          const userDetailsMap = new Map<string, UserStateTypes>();

          userDetailsResults.forEach((result, index) => {
            if (result.status === "fulfilled") {
              userDetailsMap.set(VolunteerIds[index], result.value);
            } else {
              console.warn(`Failed to fetch details for ${VolunteerIds[index]}`, result.reason);
            }
          });

          setUserDetails(userDetailsMap);
          setChatList(Array.from(uniqueConnections.values()));
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      })
      .catch((error:any) => {
        console.error("Error fetching chats:", error);
      });
  }, [dispatch, volunteer?.id]);
  const handleMessage = () => {
    // if (!volunteer?.id) {

    //   console.warn("User ID is missing!");
    //   return;
    // }

    // dispatch(User_get_MessagesUserId(volunteer.id))
    //   .unwrap()
    //   .then(async (messages: Response_ChatsTypes[]) => {
    //     console.log("User Messages:", messages);

    //     const uniqueConnections = new Map<string, Response_ChatsTypes>();

    //     messages.forEach((message) => {
    //       const otherUserId = message.sender === volunteer.id ? message.receiver : message.sender;
    //       if (!uniqueConnections.has(otherUserId)) {
    //         uniqueConnections.set(otherUserId, message);
    //       }
    //     });

    //     const VolunteerIds = Array.from(uniqueConnections.keys());

    //     const userDetailsPromises = VolunteerIds.map((empId) =>
        
    //       dispatch(user_get_volunteerDetails(empId.toString())).unwrap()
    //     );

    //     try {
    //       const userDetailsResults = await Promise.allSettled(userDetailsPromises);
    //       const userDetailsMap = new Map<string, UserStateTypes>();

    //       userDetailsResults.forEach((result, index) => {
    //         if (result.status === "fulfilled") {
    //           userDetailsMap.set(VolunteerIds[index], result.value);
    //         } else {
    //           console.warn(`Failed to fetch details for ${VolunteerIds[index]}`, result.reason);
    //         }
    //       });

    //       setUserDetails(userDetailsMap);
    //       setChatList(Array.from(uniqueConnections.values()));
    //     } catch (error) {
    //       console.error("Error fetching user details:", error);
    //     }
    //   })
    //   .catch((error:any) => {
    //     console.error("Error fetching chats:", error);
    //   });
    if (!volunteer?.id) {
      console.warn("User ID is missing!");
      return;
    }
    console.log("handleMessage called");
    

    dispatch(User_get_MessagesUserId(volunteer.id))
      .unwrap()
      .then(async (messages: Response_ChatsTypes[]) => {
        console.log("User Messages:", messages);

        const uniqueConnections = new Map<string, Response_ChatsTypes>();

        messages.forEach((message) => {
          const otherUserId = message.sender === volunteer.id ? message.receiver : message.sender;
          if (!uniqueConnections.has(otherUserId)) {
            uniqueConnections.set(otherUserId, message);
          }
        });

        const VolunteerIds = Array.from(uniqueConnections.keys());

        const userDetailsPromises = VolunteerIds.map((empId) =>
        
          dispatch(user_get_volunteerDetails(empId.toString())).unwrap()
        );

        try {
          const userDetailsResults = await Promise.allSettled(userDetailsPromises);
          const userDetailsMap = new Map<string, UserStateTypes>();

          userDetailsResults.forEach((result, index) => {
            if (result.status === "fulfilled") {
              userDetailsMap.set(VolunteerIds[index], result.value);
            } else {
              console.warn(`Failed to fetch details for ${VolunteerIds[index]}`, result.reason);
            }
          });

          setUserDetails(userDetailsMap);
          setChatList(Array.from(uniqueConnections.values()));
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      })
      .catch((error:any) => {
        console.error("Error fetching chats:", error);
      });
  }

      socket.on("chatMessage", handleMessage);

  return (
    <div className="flex h-screen bg-black text-gray-200">
      {/* Left: Chat List */}
      <div className="w-1/4 bg-gradient-to-b from-gray-900 to-gray-800 p-6 shadow-lg rounded-xl overflow-y-auto max-h-screen border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Chat List</h2>
          <button
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
            onClick={() => navigate(-1)}
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          {chatList.length > 0 ? (
            chatList.sort((a:any,b:any)=>(b-a)).map((chat) => {
              const { message, timestamp } = chat;
              const VolunteerID = chat.sender === volunteer?.id ? chat.receiver : chat.sender;
              const Volunteer = userDetails.get(VolunteerID) ?? {
              
                name: "Unknown",
                profilePic: "default-avatar.png",
              };
              {
                console.log(userDetails);
              }

              return (
                <div
                  key={VolunteerID}
                  className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-cyan-900 transition-transform duration-300 transform hover:-translate-y-1 shadow-lg"
                  onClick={() => setSelectedUserId(VolunteerID)}
                >
                  {/* Profile Picture */}
                  <img
                    src={`${import.meta.env.VITE_SOCKET_URL}${Volunteer.profilePic}` as string}
                    alt={Volunteer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold text-gray-100">{Volunteer.name}</h4>
                    <p className="text-sm text-gray-400 truncate">{message}</p>
                  </div>
                  <small className="text-sm text-gray-500">
                    {timestamp ? new Date(timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "N/A"}
                  </small>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No chat history found.</p>
          )}
        </div>
      </div>

      {/* Right: Chat Details */}
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 p-8 shadow-2xl rounded-xl overflow-hidden ml-5 max-h-screen border border-gray-700">
        {selectedUserId ? (
          <div className="h-full overflow-y-auto scrollbar-hide">
            <UserChatDetails userName={volunteer?.name||""} volunteerId={selectedUserId } userId={volunteer?.id||""} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-300">Start a Conversation</h2>
              <p className="text-gray-400 mt-2">Select a user from the list to begin chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerChatList;
