// import { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// // import {  Socket } from "socket.io-client";
// import { AppDispatch } from "../../../store/store";
// import ToastAlert from "../../../components/alert/ToastAlert";
// import socket from "../../../socket/socket";
// import { v4 as uuidv4 } from "uuid"; // Import UUID library
// import { useNavigate } from "react-router-dom";
// import { uploadFile } from "../../../utils/uploads";
// import MessageAttachment from "./MessageAttachment";
// import { uploadAudioandVideo } from "../../../utils/uploadAudio";
// import FileUploader from "./FileUpload";
// import AudioRecorder from "./AudioRecord";
// import { CallData, Response_ChatsTypes, UserStateTypes } from "../../../reducers/volunteers/volunteerApicalls";
// import { User_get_MessagesUserId, user_get_volunteerDetails } from "../../../reducers/beneficiary/beneficiaryApicalls";


// const UserChatDetails = ({ volunteerId, userId,userName }: { volunteerId: string; userId: string,userName:string }) => {
//   const [messages, setMessages] = useState<Response_ChatsTypes[]>([]);
//   const [userDetails, setUserDetails] = useState<UserStateTypes>();
//   const [inputMessage, setInputMessage] = useState("");
//   // const [sockets, setSocket] = useState<Socket | null>(null);
//   const dispatch: AppDispatch = useDispatch();
//   const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the end of the message container
//   const [chatEnabled, setChatEnabled] = useState(true);
//   // const [allCompleted, setAllCompleted] = useState(false);
// const [showwarning ,setShowWarning]=useState<boolean>(false)
// const navigate=useNavigate()
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);





// const handleSendFile = async (file: File) => {
//   if (!chatEnabled) {
//     setShowWarning(true);
//     return;
//   }

//   setIsUploading(true);
//   setUploadProgress(0);

//   try {
//     const uploadedFile = await uploadFile(file, (progress) =>
//       console.log(`Upload progress: ${progress}%`)
//     );

//     // socket.emit("register", "user", userId);

//     // Ensure that uploadedFile properties are correctly used
//     const messagePayload: Response_ChatsTypes = {
//       sender: userId,
//       receiver: volunteerId,
//       message: "image",
//       timestamp: new Date().toISOString(),
//       isRead: false,
//       userType: "volunteer",
//       attachment: {
//         type: uploadedFile.type,
//         url: uploadedFile.url, // ✅ Fixed: Use uploadedFile.url
//         name: uploadedFile.name, // ✅ Fixed: Use uploadedFile.name
//         size: uploadedFile.size, // ✅ Fixed: Use uploadedFile.size
//       },
//     };

//     socket.emit("sendMessage", messagePayload);
//     setMessages((prevMessages) => [...prevMessages, messagePayload]);
//   } catch (error) {
//     console.error("Error sending file:", error);
//     ToastAlert({
//       message: "Failed to send file",
//       type: "error",
//       onClose() {},
//     });
//   } finally {
//     setIsUploading(false);
//   }
// };



// const handleSendAudio = async (audioBlob: Blob) => {
//   if (!chatEnabled) {
//     setShowWarning(true);
//     return;
//   }

//   setIsUploading(true);
//   setUploadProgress(0);
  
//   try {
//     const fileName = `audio_message_${Date.now()}.wav`;
//     const audioFile = new File([audioBlob], `audio_${Date.now()}.mp3`, { type: "audio/mp3" });

//     const { url } = await uploadAudioandVideo(audioFile,
//       (progress) => setUploadProgress(progress)
//     );

//     console.log(url);
    
//     const messagePayload: Response_ChatsTypes = {
//       sender: userId,
//       receiver: volunteerId,
//       message: "[Audio Message]",
//       timestamp: new Date().toISOString(),
//       isRead: false,
//       userType: "volunteer",
//       attachment: {
//         type: "audio",
//         url,
//         name: fileName,
//         size: audioBlob.size
//       }
//     };
    
//     socket.emit("sendMessage", messagePayload);
//     setMessages((prevMessages) => [...prevMessages, messagePayload]);
//   } catch (error) {
//     console.error("Error sending audio:", error);
//     ToastAlert({ message: "Failed to send audio", type: "error",onClose(){} });
//   } finally {
//     setIsUploading(false);
//   }
// };





// //   useEffect(() => {
// //     if (userId) {
// //       dispatch(User_get_bookingHistories(userId))
// //         .unwrap()
// //         .then((result) => {
// //           if (!Array.isArray(result)) return;

// //           // Check if any booking is confirmed
// //           const hasConfirmedBooking = result.some((booking) => booking.status === "CONFIRMED");

// //           // Check if all bookings are completed
// //           const allJobsCompleted = result.every((booking) => booking.status === "COMPLETED");
// // console.log('hasConfirmedBooking',hasConfirmedBooking);
// // console.log('allJobsCompleted',allJobsCompleted);

// //           setChatEnabled(hasConfirmedBooking);
// //           setAllCompleted(allJobsCompleted);
// //         })
// //         .catch((error) => console.error("Error fetching bookings:", error));
// //     }
// //   }, [userId, dispatch]);

  





//   useEffect(() => {
//     if (volunteerId && userId) {
//       dispatch(User_get_MessagesUserId(userId))
//         .unwrap()
//         .then((result: Response_ChatsTypes[]) => {
//           console.log("resultttttttttttt",result);
          
//           const filteredMessages = result.filter(
//             (msg) =>
//               (msg.sender === volunteerId && msg.receiver === userId) ||
//               (msg.sender === userId && msg.receiver === volunteerId)
//           );
//           console.log("fileter",filteredMessages);
       
//             socket.emit("markAsRead", { sender: volunteerId, receiver: userId });
          
          
          
//           setMessages(filteredMessages);
//         })
//         .catch((error) => {
//           console.error("Error fetching messages:", error);
//         });

//       dispatch(user_get_volunteerDetails(volunteerId))
//         .unwrap()
//         .then((result) => {
//           setUserDetails(result);
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     }

//     // const newSocket = socket;
//     // setSocket(newSocket);

//     // newSocket.emit("register", "user", userId);

//     // newSocket.on("chatMessage", (data: Response_ChatsTypes) => {
//     //   setMessages((prevMessages) => [...prevMessages, data]);
//     // });

//     // return () => {
//     //   if (newSocket) {
//     //     newSocket.off('chatMessage');
        
//     //   }
//     // };
//   }, [dispatch, volunteerId, userId]);



//   useEffect(() => {
//     if (!socket) return; // Ensure socket exists
  
//     socket.emit("register", "user", userId);
  
//     const handleMessage = (data: Response_ChatsTypes) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
    
  
//       // Emit a read receipt if the received message is from the volunteer
//       if (data.sender === volunteerId) {
//         socket.emit("markAsRead", { sender: volunteerId, receiver: userId });
//       }
//     }
//     socket.on("chatMessage", handleMessage);
  
  
//     socket.on("messagesRead", ({ sender }) => {
//       console.log("✅ Messages read by:", sender);

//       setMessages((prevMessages) =>
//         prevMessages.map((msg) => (msg.sender === sender ? { ...msg, isRead: true } : msg))
//       );
//     });
//     return () => {
//       socket.off("chatMessage", handleMessage);
//       socket.off('messagesRead')
//     };
//   }, [userId,volunteerId]); // Run only when userId changes
  


//   useEffect(() => {
//     // Scroll to the bottom when messages are updated
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (chatEnabled) {
      
//       if (inputMessage.trim() && socket && volunteerId) {
//         const messagePayload: Response_ChatsTypes = {
//           sender: userId,
//           receiver: volunteerId,
//           message: inputMessage,
//           timestamp: new Date().toISOString(),
//           isRead: false, // New messages are unread by default

//           userType: "user",
//         };
  
//         socket.emit("sendMessage", messagePayload);
//         setMessages((prevMessages) => [...prevMessages, messagePayload]); // Optimistic UI update
//         setInputMessage("");
//       }
//     }else{
//       setShowWarning(true)
//     }
//   };
  
// const handleCall = (callType: "audio" | "video") => {


//   if (socket && volunteerId) {
//     const generatedRoomId = uuidv4(); // Generate a unique ID

//     const callData: CallData = {
//       senderId: userId,
//       senderName:userName,  
//       receiverId: volunteerId,
//       senderProfilePic:`http://localhost:5000/${userDetails?.profilePic}` as string||"",
//       callType,
//       roomId:generatedRoomId
//     };

//     socket.emit("call", callData);
//     console.log("socket id",socket.id);
   
    
//     navigate(`/volunteer/call?type=${callData.callType}&action=${'sender'}&sender=${callData.senderId}&receiver=${callData.receiverId}&senderName=${callData.senderName}&roomId=${callData.roomId}`)
//     console.log(`${callType} call initiated`);
  
//   } 
// };


// const handleAudioCall = () => handleCall("audio");
// const handleVideoCall = () => handleCall("video");


//   return (
    
//       <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-xl">
//               {showwarning && <ToastAlert message="Please Book now" type="error" onClose={() => setShowWarning(false)} />}
// {/* Header Section */}
// <div className="p-4 bg-gray-800 flex items-center justify-between rounded-t-xl shadow-lg">
//   <div className="flex items-center">
//     <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden border-2 border-cyan-400">
//       <img
//         src={`http://localhost:5000${userDetails?.profilePic}` as string|| "/default-avatar.png"}
//         alt="User Avatar"
//         className="w-full h-full object-cover"
//       />
//     </div>
//     <div className="ml-3">
//       <h3 className="text-base font-semibold text-gray-200">
//         {userDetails?.name || "User"}
//       </h3>
//       <p className="text-xs text-gray-400">Online</p>
//     </div>
//   </div>

//   {/* Call Buttons */}
//   <div className="flex gap-3">
//     <button 
//       onClick={handleAudioCall} 
//       className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition"
//     >
//       📞
//     </button>
//     <button 
//       onClick={handleVideoCall} 
//       className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition"
//     >
//       🎥
//     </button>
//   </div>
// </div>

    
//         {/* Chat Messages Section */}
//        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 scrollbar-hide">




//    {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex items-end ${
//                 msg.sender === userId ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`relative max-w-xs p-3 rounded-xl text-sm shadow-md ${
//                   msg.sender === userId
//                     ? "bg-cyan-600 text-gray-100"
//                     : "bg-gray-800 text-gray-200"
//                 }`}
//               >
//                             { 
//               msg.attachment?.url?"":
//               <p className="text-sm">{msg.message}
              
//               </p>}

                
//                     {msg.attachment?.url && <MessageAttachment attachment={msg.attachment}/>}


                
//                 <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
//                   <span>
//                     {new Date(msg.timestamp).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                      {msg.sender === userId && (
//                   <span  className="text-cyan-400">{msg.isRead ? "✓✓" : "✓"}</span>
//                 )}
                  
              
//                 </div>
//                 <span
//                   className={`absolute w-3 h-3 ${
//                     msg.sender === userId
//                       ? "-right-1 bg-cyan-600"
//                       : "-left-1 bg-gray-800"
//                   } rotate-45 transform`}
//                 />
//               </div>
//             </div>
//           ))}

// {isUploading && (
//           <div className="fixed bottom-20 right-4 bg-gray-800 p-3 rounded-lg shadow-lg">
//             <div className="w-64">
//               <p className="text-sm text-white mb-1">Uploading...</p>
//               <div className="w-full bg-gray-700 rounded-full h-2.5">
//                 <div 
//                   className="bg-blue-500 h-2.5 rounded-full" 
//                   style={{ width: `${uploadProgress}%` }}
//                 ></div>
//               </div>
//               <p className="text-xs text-gray-400 mt-1 text-right">{uploadProgress}%</p>
//             </div>
//           </div>
//         )}
    
//           {/* Scroll to bottom ref */}
//           <div ref={messagesEndRef} />
    
//           {/* Chat Status Message (Placed at the Bottom) */}
//           {/* <div className="mt-4 text-center">
//             {chatEnabled ? (
//               <button className="bg-blue-500 text-white p-2 rounded hidden">Open Chat</button>
//             ) : allCompleted ? (
//               <p className="text-gray-600">Already Completed Job</p>
//             ) : (
//               <p className="text-gray-600">Waiting for Confirmation...</p>
//             )}
//           </div> */}
//         </div>
    
//         {/* Input Section */}
//         <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center rounded-b-xl">
//            <div className="flex items-center gap-2 mr-2">
//                     <FileUploader 
//                       onFileSelect={handleSendFile}
//                       disabled={!chatEnabled}
//                     />
//                     <AudioRecorder 
//                       onRecordingComplete={handleSendAudio}
//                       disabled={!chatEnabled}
//                     />
//                   </div>
//           <input
//             type="text"
//             className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
//             placeholder="Type a message..."
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//           />

          
//           <button
//             className="ml-3 px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition text-sm"
//             onClick={handleSendMessage}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     );
    

// };

// export default UserChatDetails;


import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
// import {  Socket } from "socket.io-client";
import { AppDispatch } from "../../../store/store"; // Added RootState
import ToastAlert from "../../../components/alert/ToastAlert";
import socket from "../../../socket/socket";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../../utils/uploads";
import MessageAttachment from "./MessageAttachment"; // Assuming this path is correct
import { uploadAudioandVideo } from "../../../utils/uploadAudio";
import FileUploader from "./FileUpload"; // Assuming this path is correct
import AudioRecorder from "./AudioRecord"; // Assuming this path is correct
import { CallData, Response_ChatsTypes, UserStateTypes } from "../../../reducers/volunteers/volunteerApicalls"; // Assuming CallData and UserStateTypes are here
import { User_get_MessagesUserId, user_get_volunteerDetails } from "../../../reducers/beneficiary/beneficiaryApicalls";
import { FaTrash } from "react-icons/fa"; // Import trash icon
// import { useSelector } from 'react-redux'; // Import useSelector


// Assuming Response_ChatsTypes has an _id field from MongoDB
interface Response_ChatsTypesWithId extends Response_ChatsTypes {
    messageId?: string; // Make _id optional if optimistic updates use temporary IDs
}


const UserChatDetails = ({ volunteerId, userId,userName }: { volunteerId: string; userId: string,userName:string }) => {
  const [messages, setMessages] = useState<Response_ChatsTypesWithId[]>([]);
  const [userDetails, setUserDetails] = useState<UserStateTypes>(); // Details of the Volunteer they are chatting with
  const [inputMessage, setInputMessage] = useState("");
  // const [sockets, setSocket] = useState<Socket | null>(null); // Note: You are not using 'sockets' state here
  const dispatch: AppDispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the end of the message container
  const [chatEnabled, setChatEnabled] = useState(true); // Assuming chat is always enabled based on recent code
  // const [allCompleted, setAllCompleted] = useState(false); // Assuming this logic is no longer used
  const [showwarning ,setShowWarning]=useState<boolean>(false) // Assuming this is tied to chatEnabled
  const navigate=useNavigate()
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null); // State for incoming call notification

  // Get logged-in user details from Redux (assuming they are stored here)
  // const loggedInUser = useSelector((state: RootState) => state.auth.user); // Adjust state path

    // Function to handle sending files (images, pdfs, etc.)
    const handleSendFile = async (file: File) => {
        if (!chatEnabled) {
            setShowWarning(true);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Note: Assuming uploadFile returns { url: string, type: string, name: string, size: number }
            const uploadedFile = await uploadFile(file, (progress: any) =>
                console.log(`Upload progress: ${progress}%`) // Added console log
            );

            console.log("Uploaded file details:", uploadedFile); // Added console log


            const messagePayload: Response_ChatsTypes = {
                sender: userId, // User is sending
                receiver: volunteerId, // Volunteer is receiving
                message: uploadedFile.type === 'image' ? 'Image' : 'File', // More specific message
                messageId:Date.now().toString() + Math.random(),
                timestamp: new Date().toISOString(),
                isRead: false,
                userType: "volunteer", // The volunteer receiving is a 'volunteer' type
                attachment: {
                    type: uploadedFile.type,
                    url: uploadedFile.url,
                    name: uploadedFile.name,
                    size: uploadedFile.size,
                },
            };

            socket.emit("sendMessage", messagePayload);
            console.log("Emitted sendMessage with file"); // Added console log

            // Optimistically add message (assuming backend will add _id) - may need adjustment if backend adds _id differently
            setMessages((prevMessages) => [...prevMessages, {...messagePayload}]); // Use a temp ID for optimistic update

        } catch (error) {
            console.error("Error sending file:", error);
            ToastAlert({
                message: "Failed to send file",
                type: "error",
                onClose() { },
            });
        } finally {
            setIsUploading(false);
        }
    };


    // Function to handle sending audio
    const handleSendAudio = async (audioBlob: Blob) => {
        if (!chatEnabled) {
            setShowWarning(true);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const fileName = `audio_message_${Date.now()}.wav`;
            const audioFile = new File([audioBlob], `audio_${Date.now()}.mp3`, { type: "audio/mp3" }); // Consider using the original mime type from audioBlob

            const { url } = await uploadAudioandVideo(audioFile,
                (progress: any) => setUploadProgress(progress)
            );

            console.log("Uploaded audio URL:", url); // Added console log

            const messagePayload: Response_ChatsTypes = {
                sender: userId, // User is sending
                receiver: volunteerId, // Volunteer is receiving
                message: "[Audio Message]",
                messageId:Date.now().toString() + Math.random(),
                timestamp: new Date().toISOString(),
                isRead: false,
                userType: "volunteer", // The volunteer receiving is a 'volunteer' type
                attachment: {
                    type: "audio",
                    url,
                    name: fileName, // Or use a more descriptive name if possible
                    size: audioBlob.size
                }
            };

            socket.emit("sendMessage", messagePayload);
            console.log("Emitted sendMessage with audio"); // Added console log

            // Optimistically add message (assuming backend will add _id) - may need adjustment if backend adds _id differently
            setMessages((prevMessages) => [...prevMessages, {...messagePayload, messageId: Date.now().toString() + Math.random()} as Response_ChatsTypesWithId]); // Use a temp ID for optimistic update

        } catch (error) {
            console.error("Error sending audio:", error);
            ToastAlert({ message: "Failed to send audio", type: "error", onClose() { } });
        } finally {
            setIsUploading(false);
        }
    };

    // --- NEW: Function to handle message deletion ---
    const handleDeleteMessage = (messageId: string) => {
        console.log(`Attempting to delete message ID: ${messageId}`);
        // Optimistically remove the message from UI
        setMessages(prevMessages => prevMessages.filter(msg => msg.messageId !== messageId));
        console.log("Optimistically removed message from UI");


        // Emit delete event to the backend
        if (socket) {
            // Send message ID and IDs of participants so backend knows the conversation
            // Participants are the sender (user) and the receiver (volunteer)
            socket.emit("deleteMessage", { messageId, participants: [userId, volunteerId] });
            console.log(`Emitted 'deleteMessage' for message ID: ${messageId} with participants: ${userId}, ${volunteerId}`);
        } else {
            console.error("Socket not connected, cannot emit delete message");
            // Optionally revert the optimistic update or show an error ToastAlert
             ToastAlert({ message: "Socket not connected, cannot delete.", type: "error", onClose() { } });
        }
    };
    // --- END NEW ---


    // --- Commented out chatEnabled logic - uncomment if needed ---
    // useEffect(() => {
    //   if (userId) {
    //     dispatch(User_get_bookingHistories(userId))
    //       .unwrap()
    //       .then((result) => {
    //         if (!Array.isArray(result)) return;

    //         const hasConfirmedBooking = result.some((booking) => booking.status === "CONFIRMED");
    //         const allJobsCompleted = result.every((booking) => booking.status === "COMPLETED");

    //         setChatEnabled(hasConfirmedBooking && !allJobsCompleted); // Chat enabled only if confirmed and NOT completed
    //         // setAllCompleted(allJobsCompleted); // If needed for status message
    //       })
    //       .catch((error) => console.error("Error fetching bookings:", error));
    //   }
    // }, [userId, dispatch]);


    // Effect to fetch initial messages and volunteer details
  useEffect(() => {
    if (volunteerId && userId) {
      dispatch(User_get_MessagesUserId(userId)) // Assuming this fetches messages relevant to the user
        .unwrap()
        .then((result: Response_ChatsTypesWithId[]) => { // Ensure your API returns _id and type is correct
          console.log("Fetched and filtered messages result:", result); // Added console log

          const filteredMessages = result.filter(
            (msg) =>
              (msg.sender === volunteerId && msg.receiver === userId) || // Messages from volunteer to user
              (msg.sender === userId && msg.receiver === volunteerId) // Messages from user to volunteer
          );
          console.log("Filtered messages:", filteredMessages); // Added console log

             // Emit markAsRead for messages sent by the volunteer when chat is opened
             // This assumes the user is viewing the chat, so they read messages from the volunteer
            socket.emit("markAsRead", { sender: volunteerId, receiver: userId }); // Sender is Volunteer, Receiver is User
             console.log("Emitted markAsRead on mount");


          setMessages(filteredMessages); // Update message state
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });

      dispatch(user_get_volunteerDetails(volunteerId)) // Assuming this fetches details of the VOLUNTEER
        .unwrap()
        .then((result) => {
          setUserDetails(result); // Set details of the person they are chatting with
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [dispatch, volunteerId, userId]); // Dependencies added


    // Effect for Socket.IO listeners
  useEffect(() => {
    if (!socket) return; // Ensure socket exists

        console.log("Setting up Socket.IO listeners for chat"); // Added console log

    socket.emit("register", "user", userId); // Register the user
        console.log(`Emitted 'register' for user ID: ${userId}`); // Added console log


        // Handler for receiving new chat messages
    const handleMessage = (data: Response_ChatsTypesWithId) => { // Ensure data includes _id
      console.log("Received 'chatMessage':", data); // Added console log
      setMessages((prevMessages) => [...prevMessages, data]); // Add new message to state


             // Emit a read receipt if the received message is from the volunteer
      if (data.sender === volunteerId) {
        console.log("Received message is from the volunteer, emitting markAsRead"); // Added console log
        socket.emit("markAsRead", { sender: volunteerId, receiver: userId }); // Sender is Volunteer, Receiver is User
      }
    };
    socket.on("chatMessage", handleMessage);

        // Handler for messages being marked as read by the volunteer
    socket.on("messagesRead", ({ sender }: { sender: string }) => { // 'sender' here is the volunteer who read the messages
      console.log("✅ Messages read by:", sender); // Added console log
      // Update messages in state to mark them as read if they were sent by the current user
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          // Only mark messages as read that were sent by the current user to the volunteer
          (msg.sender === userId && msg.receiver === volunteerId && msg.isRead === false) // Add receiver check
                   ? { ...msg, isRead: true }
                   : msg
               )
      );
    });

        // --- NEW: Handler for message deletion confirmation ---
        const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
             console.log(`Received 'messageDeleted' for ID: ${messageId}`); // Added console log
             // If you didn't do optimistic update, you would filter here
             // setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
             ToastAlert({ message: "Message deleted.", type: "info", onClose() { } }); // Optional: Show confirmation
        };
        socket.on("messageDeleted", handleMessageDeleted);
        // --- END NEW ---

        // --- NEW: Handler for call invitation ---
        const handleIncomingCall = (callData: CallData) => {
            console.log("Received 'callIncoming':", callData); // Added console log
            setIncomingCall(callData); // Set state to show incoming call notification UI
        };
        socket.on("callIncoming", handleIncomingCall);
        // --- END NEW ---


    // Cleanup function to remove listeners when component unmounts
    return () => {
            console.log("Cleaning up Socket.IO listeners for chat"); // Added console log
      socket.off('chatMessage', handleMessage);
      socket.off('messagesRead');
            socket.off('messageDeleted', handleMessageDeleted); // Clean up new listener
            socket.off('callIncoming', handleIncomingCall); // Clean up new listener

            // You might want to emit an 'unregister' or 'offline' event here
            // socket.emit('unregister', userId);
    };
  }, [userId, volunteerId]); // Dependencies added


    // Effect to scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


    // Function to handle sending a text message
  const handleSendMessage = () => {
    if (chatEnabled) { // Check if chat is enabled based on booking status
      console.log("Attempting to send text message:", inputMessage); // Added console log

      if (inputMessage.trim() && socket && volunteerId) {
        const messagePayload: Response_ChatsTypes = {
          sender: userId, // User is sending
          receiver: volunteerId, // Volunteer is receiving
          message: inputMessage,
          messageId:Date.now().toString() + Math.random(),
          timestamp: new Date().toISOString(),
          isRead: false, // New messages are unread by default
          userType: "volunteer", // The volunteer receiving is a 'volunteer' type
        };

        socket.emit("sendMessage", messagePayload);
        console.log("Emitted sendMessage with text from volunteer"); // Added console log

         // Optimistically add message (assuming backend will add _id) - may need adjustment if backend adds _id differently
        setMessages((prevMessages) => [...prevMessages, {...messagePayload} as Response_ChatsTypesWithId]); // Use a temp ID for optimistic update
        setInputMessage(""); // Clear input field
      } else {
          console.log("Input is empty, socket not connected, or volunteerId missing, not sending message"); // Added console log
      }
    }else{
      setShowWarning(true) // Show warning if chat is not enabled
    }
  };

    // --- NEW: Call Initiation Logic ---
    const handleCall = (callType: "audio" | "video") => {
        console.log(`Attempting to initiate ${callType} call...`); // Added console log

        if (socket && volunteerId && userId && userName) { // Ensure all necessary data is available
            const generatedRoomId = uuidv4(); // Generate a unique ID for the call room

            const callData: CallData = {
                senderId: userId, // User is initiating
                senderName: userName,
                receiverId: volunteerId, // Volunteer is the receiver
                // Note: senderProfilePic URL might need careful construction, or pass the path and construct on receiver side
                senderProfilePic: `${import.meta.env.VITE_SOCKET_URL}${userDetails?.profilePic}` as string || "", // Using http for clarity, adjust if using https
                callType,
                roomId: generatedRoomId
            };

            console.log("Emitting 'call' event with data:", callData); // Added console log
            socket.emit("call", callData); // Emit the call event to the backend

            // Navigate to the call page
            // Include all necessary data as query parameters
            navigate(`/volunteer/call?type=${callData.callType}&action=${'sender'}&sender=${callData.senderId}&receiver=${callData.receiverId}&senderName=${encodeURIComponent(callData.senderName)}&roomId=${callData.roomId}&senderProfilePic=${encodeURIComponent(callData.senderProfilePic)}`);
            console.log(`Navigating to call page: /call?...`); // Added console log

        } else {
            console.log("Socket not connected or missing user/volunteer data, cannot initiate call."); // Added console log
            // Optionally show a warning or error
            ToastAlert({ message: "Unable to start call. Please try again.", type: "error", onClose() { } });
        }
    };

    const handleAudioCall = () => handleCall("audio");
    const handleVideoCall = () => handleCall("video");
    // --- END NEW ---


     // --- NEW: Incoming Call UI and Handlers ---
    const acceptCall = (callData: CallData) => {
      console.log("User accepting call:", callData); // Added console log
      if(socket) {
        socket.emit('acceptCall', { roomId: callData.roomId, employeeId: volunteerId }); // 'employeeId' might need to be 'volunteerId' or generic 'userId'
        // Navigate to the call page (same as sender)
         const receiverId = userId; // Current user is the receiver
         const receiverName = userName; // Current user's name
         const receiverProfilePic = `${import.meta.env.VITE_SOCKET_URL}${userDetails?.profilePic}` as string || ""; // Assuming you have user's profile pic state

        // Navigate to the call page with receiver action
        window.open(`/call?type=${callData.callType}&action=receiver&sender=${callData.senderId}&receiver=${receiverId}&senderName=${encodeURIComponent(callData.senderName)}&receiverName=${encodeURIComponent(receiverName)}&roomId=${callData.roomId}&senderProfilePic=${encodeURIComponent(callData.senderProfilePic)}&receiverProfilePic=${encodeURIComponent(receiverProfilePic)}`, '_blank'); // Open in new tab? or navigate within app

      }
      setIncomingCall(null); // Hide the notification
    };

     const rejectCall = (callData: CallData) => {
      console.log("User rejecting call:", callData); // Added console log
       if(socket) {
         socket.emit('rejectCall', { roomId: callData.roomId, senderId: callData.senderId }); // Notify the sender
       }
      setIncomingCall(null); // Hide the notification
    };
    // --- END NEW ---


  return (

      <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-xl">
              {showwarning && <ToastAlert message="Please Book now" type="error" onClose={() => setShowWarning(false)} />}
{/* Header Section */}
<div className="p-4 bg-gray-800 flex items-center justify-between rounded-t-xl shadow-lg">
  <div className="flex items-center">
    <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden border-2 border-cyan-400">
      <img
        src={`${import.meta.env.VITE_SOCKET_URL}${userDetails?.profilePic}` as string|| "/default-avatar.png"} // Corrected path prefix
        alt="Volunteer Avatar" // Changed alt text
        className="w-full h-full object-cover"
      />
    </div>
    <div className="ml-3">
      <h3 className="text-base font-semibold text-gray-200">
        {userDetails?.name || "Volunteer"} {/* Changed default name */}
      </h3>
      <p className="text-xs text-gray-400">Online</p> {/* Status might need Socket.IO presence logic */}
    </div>
  </div>

  {/* Call Buttons */}
  <div className="flex gap-3">
    <button
      onClick={handleAudioCall}
      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition"
    >
      📞
    </button>
    <button
      onClick={handleVideoCall}
      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition"
    >
      🎥
    </button>
  </div>
</div>

      {/* --- NEW: Incoming Call Notification UI --- */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> {/* Overlay */}
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg mb-4">
                    {incomingCall.senderName || "Someone"} is calling you ({incomingCall.callType})...
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition"
                        onClick={() => acceptCall(incomingCall)}
                    >
                        Accept
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md shadow-md transition"
                        onClick={() => rejectCall(incomingCall)}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
      )}
      {/* --- END NEW --- */}

        {/* Chat Messages Section */}
       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 scrollbar-hide">

   {messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((msg, index) => (
            <div
              key={msg.messageId || index} // Use msg._id for key, fallback to index
              className={`flex items-end ${
                msg.sender === userId ? "justify-end" : "justify-start" // Check if message is from current user (userId)
              }`}
            >
              <div
                className={`relative max-w-xs p-3 rounded-xl text-sm shadow-md group ${ // Added 'group' class for hover effects
                  msg.sender === userId // Check if message is from current user (userId)
                    ? "bg-cyan-600 text-gray-100"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                            {
              msg.attachment?.url ? <MessageAttachment attachment={msg.attachment}/> :
              <p className="text-sm">{msg.message}</p>}

                    {/* Timestamp and Read Status */}
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                     {msg.sender === userId && ( // Only show read status for messages sent by the current user
                  <span  className="text-cyan-400">{msg.isRead ? "✓✓" : "✓"}</span>
                )}

                </div>

                {/* --- NEW: Delete Icon --- */}
                {msg.messageId && msg.sender === userId && ( // Only show delete for messages sent by the current user AND if message has an ID
                  <button
                    className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteMessage(msg.messageId as string)}
                    title="Delete message"
                  >
                    <FaTrash size={10}/> {/* Using the imported icon */}
                  </button>
                )}
                {/* --- END NEW --- */}

                <span
                  className={`absolute w-3 h-3 ${
                    msg.sender === userId
                      ? "-right-1 bg-cyan-600"
                      : "-left-1 bg-gray-800"
                  } rotate-45 transform`}
                />
              </div>
            </div>
          ))}

            {/* Upload progress indicator */}
            {isUploading && (
          <div className="fixed bottom-20 right-4 bg-gray-800 p-3 rounded-lg shadow-lg">
            <div className="w-64">
              <p className="text-sm text-white mb-1">Uploading...</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{uploadProgress}%</p>
            </div>
          </div>
        )}


          {/* Scroll to bottom ref */}
          <div ref={messagesEndRef} />

          {/* Chat Status Message */}
          {/* <div className="mt-4 text-center">
            {chatEnabled ? (
              <button className="bg-blue-500 text-white p-2 rounded hidden">Open Chat</button>
            ) : allCompleted ? (
              <p className="text-gray-600">Already Completed Job</p>
            ) : (
              <p className="text-gray-600">Waiting for Confirmation...</p>
            )}
          </div> */}
        </div>

        {/* Input Section */}
        <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center rounded-b-xl">
           <div className="flex items-center gap-2 mr-2">
                    <FileUploader
                      onFileSelect={handleSendFile}
                      disabled={!chatEnabled}
                    />
                    <AudioRecorder
                      onRecordingComplete={handleSendAudio}
                      disabled={!chatEnabled}
                    />
                  </div>
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />


          <button
            className="ml-3 px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition text-sm"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    );


};

export default UserChatDetails;