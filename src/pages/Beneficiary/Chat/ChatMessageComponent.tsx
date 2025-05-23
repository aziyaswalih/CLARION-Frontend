import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CallData,
  Response_ChatsTypes,
  UserStateTypes,
  volunteer_get_MessagesvolunteerId,
  volunteer_get_UserDetails,
} from "../../../reducers/volunteers/volunteerApicalls";
import { AppDispatch } from "../../../store/store";
import socket from "../../../socket/socket";
import ToastAlert from "../../../components/alert/ToastAlert";

import { uploadFile } from "../../../utils/uploads";
import { uploadAudioandVideo } from "../../../utils/uploadAudio";
// import { Socket } from "socket.io-client";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import MessageAttachment from "../../Volunteer/UserChat/MessageAttachment";
import FileUploader from "../../Volunteer/UserChat/FileUpload";
import AudioRecorder from "../../Volunteer/UserChat/AudioRecord";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// Assuming Response_ChatsTypes has an _id field from MongoDB
interface Response_ChatsTypesWithId extends Response_ChatsTypes {
  messageId?: string; // Make _id optional if optimistic updates use temporary IDs
}

const ChatDetails = ({
  volunteerId,
  userId,
}: {
  volunteerId: string;
  userId: string;
}) => {
  const [messages, setMessages] = useState<Response_ChatsTypesWithId[]>([]);
  const [userDetails, setUserDetails] = useState<UserStateTypes>(); // Details of the User they are chatting with
  const [inputMessage, setInputMessage] = useState("");
  //   const [sockets, setSocket] = useState<Socket  | null>(null); // Note: You are not using 'sockets' state here
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null); // State for incoming call notification (if implemented)
  const dispatch: AppDispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Function to handle sending audio
  const handleSendAudio = async (audioBlob: Blob) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = `audio_message_${Date.now()}.wav`;
      const audioFile = new File([audioBlob], `audio_${Date.now()}.mp3`, {
        type: "audio/mp3",
      }); // Consider using the original mime type from audioBlob

      const { url } = await uploadAudioandVideo(audioFile, (progress: any) =>
        setUploadProgress(progress)
      );

      console.log("Uploaded audio URL:", url); // Added console log

      const messagePayload: Response_ChatsTypes = {
        sender: volunteerId, // Volunteer is sending
        receiver: userId, // User is receiving
        message: "[Audio Message]",
        messageId: Date.now().toString() + Math.random(), // Optional: Add a message ID if needed`
        timestamp: new Date().toISOString(),
        isRead: false,
        userType: "user", // The user receiving is a 'user' type
        attachment: {
          type: "audio",
          url,
          name: fileName, // Or use a more descriptive name if possible
          size: audioBlob.size,
        },
      };

      socket.emit("sendMessage", messagePayload);
      // Optimistically add message (assuming backend will add _id) - may need adjustment if backend adds _id differently
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messagePayload,
          messageId: Date.now().toString() + Math.random(),
        } as Response_ChatsTypesWithId,
      ]); // Use a temp ID for optimistic update
      console.log("Emitted sendMessage with audio");
    } catch (error) {
      console.error("Error sending audio:", error);
      ToastAlert({
        message: "Failed to send audio",
        type: "error",
        onClose() {},
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle sending files (images, pdfs, etc.)
  const handleSendFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Note: Assuming uploadFile returns { url: string, type: string, name: string, size: number }
      const { url, type } = await uploadFile(file, (progress: any) =>
        setUploadProgress(progress)
      );
      console.log("Uploaded file URL:", url, "Type:", type); // Added console log

      if (socket) {
        console.log("Socket is alive, emitting file message"); // Added console log
        console.log("Socket ID:", socket.id); // Added console log

        const messagePayload: Response_ChatsTypes = {
          sender: volunteerId, // Volunteer is sending
          receiver: userId, // User is receiving
          message: `${
            type === "image" ? "Image" : type === "audio" ? "Audio" : "File"
          }`, // More specific message
          messageId: Date.now().toString() + Math.random(), // Optional: Add a message ID if needed
          timestamp: new Date().toISOString(),
          isRead: false,
          userType: "user", // The user receiving is a 'user' type
          attachment: {
            type,
            url,
            name: file.name,
            size: file.size,
          },
        };
        socket.emit("sendMessage", messagePayload);
        // Optimistically add message (assuming backend will add _id) - may need adjustment if backend adds _id differently
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...messagePayload } as Response_ChatsTypesWithId,
        ]); // Use a temp ID for optimistic update
        console.log("Emitted sendMessage with file");
      }
    } catch (error) {
      console.error("Error sending file:", error);
      ToastAlert({
        message: "Failed to send file",
        type: "error",
        onClose() {},
      });
    } finally {
      setIsUploading(false);
    }
  };

  // --- NEW: Function to handle message deletion ---
  const handleDeleteMessage = (messageId: string) => {
    console.log(`Attempting to delete message ID: ${messageId}`);
    // Optimistically remove the message from UI
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.messageId !== messageId)
    );
    console.log("Optimistically removed message from UI");

    // Emit delete event to the backend
    if (socket) {
      socket.emit("deleteMessage", {
        messageId,
        participants: [volunteerId, userId],
      });
      console.log(
        `Emitted 'deleteMessage' for message ID: ${messageId} with participants: ${volunteerId}, ${userId}`
      );
    } else {
      console.error("Socket not connected, cannot emit delete message");

      ToastAlert({
        message: "Socket not connected, cannot delete.",
        type: "error",
        onClose() {},
      });
    }
  };

  // Effect to fetch initial messages and user details
  useEffect(() => {
    if (volunteerId && userId) {
      dispatch(volunteer_get_MessagesvolunteerId(volunteerId)) // Assuming this fetches messages relevant to the volunteer
        .unwrap()
        .then((result: Response_ChatsTypesWithId[]) => {
          // Ensure your API returns _id and type is correct
          const filteredMessages = result.filter(
            (msg) =>
              (msg.sender === userId && msg.receiver === volunteerId) || // Messages from user to volunteer
              (msg.sender === volunteerId && msg.receiver === userId) // Messages from volunteer to user
          ); // Sort by timestamp descending
          console.log("Fetched and filtered messages:", filteredMessages); // Added console log
          setMessages(filteredMessages);

          socket.emit("markAsRead", { sender: userId, receiver: volunteerId }); // Sender is User, Receiver is Volunteer
          console.log("Emitted markAsRead on mount");
        })
        .catch((error: any) =>
          console.error("Error fetching messages:", error)
        );

      dispatch(volunteer_get_UserDetails(userId)) // Assuming this fetches details of the USER (beneficiary)
        .unwrap()
        .then(setUserDetails)
        .catch(console.error);
    }
  }, [dispatch, volunteerId, userId]); // Dependencies added

  // Effect for Socket.IO listeners
  useEffect(() => {
    if (!socket) return; // Ensure socket exists

    console.log("Setting up Socket.IO listeners for chat"); // Added console log

    socket.emit("register", "volunteer", volunteerId); // Register the volunteer
    console.log(`Emitted 'register' for volunteer ID: ${volunteerId}`); // Added console log

    // Handler for receiving new chat messages
    const handleMessage = (data: Response_ChatsTypesWithId) => {
      // Ensure data includes _id
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log("Received 'chatMessage':", data); // Added console log
      // Emit a read receipt if the received message is from the user (beneficiary)
      if (data.sender === userId) {
        console.log("Received message is from the user, emitting markAsRead"); // Added console log
        socket.emit("markAsRead", { sender: userId, receiver: volunteerId }); // Sender is User, Receiver is Volunteer
      }
    };
    socket.on("chatMessage", handleMessage);

    // Handler for messages being marked as read by the user (beneficiary)
    socket.on("messagesRead", ({ sender }: { sender: string }) => {
      // 'sender' here is the user who read the messages
      console.log("✅ Messages read by:", sender); // Added console log // Update messages in state to mark them as read if they were sent by the current volunteer
      setMessages((prevMessages) =>
        prevMessages.map(
          (
            msg // Only mark messages as read that were sent by the current volunteer to the user
          ) =>
            msg.sender === volunteerId &&
            msg.receiver === userId &&
            msg.isRead === false // Add receiver check
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
      ToastAlert({ message: "Message deleted.", type: "info", onClose() {} }); // Optional: Show confirmation
    };
    socket.on("messageDeleted", handleMessageDeleted);
    // --- END NEW ---

    // --- NEW: Handler for call invitation ---
    const handleIncomingCall = (callData: CallData) => {
      console.log("Received 'callIncoming':", callData); // Added console log
      setIncomingCall(callData); // Set state to show incoming call notification UI
    };
    socket.on("callIncoming", handleIncomingCall);

    // Cleanup function to remove listeners when component unmounts
    return () => {
      console.log("Cleaning up Socket.IO listeners for chat"); // Added console log
      socket.off("chatMessage", handleMessage);
      socket.off("messagesRead");
      socket.off("messageDeleted", handleMessageDeleted); // Clean up new listener
      socket.off("callIncoming", handleIncomingCall); // Clean up new listener
    };
  }, [volunteerId, userId]); // Dependencies added

  // Effect to scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to handle sending a text message
  const handleSendMessage = () => {
    console.log("Attempting to send text message:", inputMessage); // Added console log

    if (inputMessage.trim() && socket) {
      // Check if input is not empty and socket exists
      const messagePayload: Response_ChatsTypes = {
        sender: volunteerId, // Volunteer is sending
        receiver: userId, // User is receiving
        message: inputMessage,
        messageId: Date.now().toString() + Math.random(), // Optional: Add a message ID if needed
        timestamp: new Date().toISOString(),
        isRead: false,
        userType: "user", // The user receiving is a 'user' type
      };
      socket.emit("sendMessage", messagePayload);
      console.log("Emitted sendMessage with text from user"); // Added console log

      // Optimistically add message (assuming backend will add _id) - may need adjustment if backend adds _id differently
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messagePayload } as Response_ChatsTypesWithId,
      ]); // Use a temp ID for optimistic update
      setInputMessage(""); // Clear input field
    } else {
      console.log(
        "Input is empty or socket not connected, not sending message"
      ); // Added console log
    }
  };

  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-100 to-white shadow-xl rounded-xl">
           {" "}
      <div className="p-4 bg-white flex items-center rounded-t-xl shadow-lg">
               {" "}
        <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-cyan-400">
                   {" "}
          <img
            src={
              (`${import.meta.env.VITE_SOCKET_URL}${
                userDetails?.profilePic
              }` as string) || "/default-avatar.png"
            } // Corrected path prefix
            alt="User Avatar" // Changed alt text
            className="w-full h-full object-cover"
          />
                 {" "}
        </div>
               {" "}
        <div className="ml-3">
                   {" "}
          <h3 className="text-base font-semibold text-gray">
                        {userDetails?.name || "User"}{" "}
            {/* Changed default name */}         {" "}
          </h3>
                    <p className="text-xs text-gray-800">Online</p>{" "}
          {/* Status might need Socket.IO presence logic */}       {" "}
        </div>
        <div className="flex gap-3 ml-auto">
          <Button
            onClick={() => {
              navigate(`/concern/${userId}`);
            }}
          >
            Report volunteer
          </Button>
        </div>
        {/* --- NEW: Call Buttons (Add if Volunteer can initiate calls) --- */}
        {/* <div className="flex gap-3 ml-auto"> // Add ml-auto to push to the right
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
          </div> */}
        {/* --- END NEW --- */}     {" "}
      </div>
      {/* --- NEW: Incoming Call Notification UI --- */}
      {/* {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> {/* Overlay *
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg text-center">
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
      )} */}
      {/* --- END NEW --- */}     {" "}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 scrollbar-hide">
               {" "}
        {messages
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .map((msg, index) => (
            <div
              key={msg.messageId || index}
              className={`flex items-end ${
                msg.sender === volunteerId ? "justify-end" : "justify-start"
              }`}
            >
              {" "}
              {/* Use msg._id for key */}           {" "}
              <div
                className={`relative max-w-xs p-3 rounded-xl text-sm shadow-md group ${
                  msg.sender === volunteerId
                    ? "bg-cyan-600 text-gray-100"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {" "}
                {/* Added 'group' class */}           {" "}
                {msg.attachment?.url ? (
                  <MessageAttachment attachment={msg.attachment} />
                ) : (
                  <p className="text-sm">{msg.message}</p>
                )}
                                  {/* Timestamp and Read Status */}             {" "}
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                                 {" "}
                  <span>
                                     {" "}
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                                     {" "}
                  </span>
                                 {" "}
                  {msg.sender === volunteerId && ( // Only show read status for messages sent by the current volunteer
                    <span className="text-cyan-400">
                      {msg.isRead ? "✓✓" : "✓"}
                    </span>
                  )}
                               {" "}
                </div>
                {/* --- NEW: Delete Icon --- */}
                {msg.messageId &&
                  msg.sender === volunteerId && ( // Only show delete for messages sent by the current volunteer AND if message has an ID
                    <button
                      className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        handleDeleteMessage(msg.messageId as string)
                      }
                      title="Delete message"
                    >
                      <FaTrash size={10} /> {/* Using the imported icon */}
                    </button>
                  )}
                {/* --- END NEW --- */}
                               {" "}
                <span
                  className={`absolute w-3 h-3 ${
                    msg.sender === volunteerId
                      ? "-right-1 bg-cyan-600"
                      : "-left-1 bg-gray-800"
                  } rotate-45 transform`}
                />
                             {" "}
              </div>
                         {" "}
            </div>
          ))}
               
        {isUploading && (
          <div className="fixed bottom-20 right-4 bg-gray-800 p-3 rounded-lg shadow-lg">
                       {" "}
            <div className="w-64">
                           {" "}
              <p className="text-sm text-white mb-1">Uploading...</p>           
               {" "}
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                               {" "}
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                             {" "}
              </div>
                           {" "}
              <p className="text-xs text-gray-400 mt-1 text-right">
                {uploadProgress}%
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                <div ref={messagesEndRef} />     {" "}
      </div>
           {" "}
      <div className="p-4 bg-white-800 border-t border-gray-700 flex items-center rounded-b-xl">
                   {" "}
        <div className="flex items-center gap-2 mr-2">
                                   {" "}
          <FileUploader
            onFileSelect={handleSendFile} // disabled={!chatEnabled} // Re-add if chatEnabled logic is needed
          />
                                   {" "}
          <AudioRecorder
            onRecordingComplete={handleSendAudio} // disabled={!chatEnabled} // Re-add if chatEnabled logic is needed
          />
                                 {" "}
        </div>
               {" "}
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-100 border border-gray-600 text-black-300 focus:ring-2 focus:ring-cyan-400 outline-none"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
               {" "}
        <button
          className="ml-3 px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition text-sm"
          onClick={handleSendMessage}
        >
                    Send        {" "}
        </button>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default ChatDetails;
