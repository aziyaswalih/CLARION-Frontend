import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import OTPVerification from "../pages/Beneficiary/signup/otpverify"; // Assuming this is a test page as per your routes
import BeneficiaryHome from "../pages/Beneficiary/HomePage/Home";
import HomePage from "../pages/HomePage"; // Landing page?
import NotFound from "../components/NotFound";
import ProfilePage from "../pages/Beneficiary/ProfilePage/ProfilePage";
import Story from "../pages/Beneficiary/Story/Story";
import StoryHistory from "../pages/Beneficiary/StoryHistory/StoryHistory";
import MEET from "../components/calls/VideoCall";
import IncomingCallPopup from "../components/notifications/incomingcall";
import socket from "../socket/socket";
import { CallData } from "../reducers/volunteers/volunteerApicalls"; // Define this type properly
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ChatList from "../pages/Beneficiary/Chat/ChatListUserSide";
import BeneficiaryAccount from "../pages/Beneficiary/BeneficiaryAccount/BeneficiaryAccount";
// import UserProtect from "../components/beneficiary/Protect/UserProtect"; // Uncomment if needed

const BeneficiaryRoutes = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const notificationSound = useRef(new Audio("/wet-431.mp3")); // Ensure this path is correct in your public folder
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const canPlaySoundRef = useRef(false);
  const navigate = useNavigate();
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Main useEffect for socket event listeners and user registration
  useEffect(() => {
    if (!user?.id) {
      console.log(
        "User not available, skipping socket registration and listeners."
      );
      return;
    }

    // Register user with socket server (assuming 'beneficiary' role)
    socket.emit("register", "beneficiary", user.id);
    console.log(`Socket: Registered user ${user.id} as beneficiary`);

    const handleIncomingCall = (data: CallData) => {
      console.log("Socket: Incoming call event received:", data);
      // If there's already an incoming call, you might want to ignore new ones or handle accordingly
      // For simplicity, this will replace the current incoming call.
      setIncomingCall(data);
    };

    const handleCallDisconnectedByRemote = (data: {
      roomId: string;
      reason?: string;
    }) => {
      console.log(
        "Socket: Received 'disconnect-call' (e.g., caller hung up or call ended):",
        data
      );
      setIncomingCall((currentCall) => {
        if (currentCall && currentCall.roomId === data.roomId) {
          notificationSound.current.pause();
          notificationSound.current.currentTime = 0;
          if (callTimeoutRef.current) {
            clearTimeout(callTimeoutRef.current);
            callTimeoutRef.current = null;
          }
          return null; // Clear the specific incoming call
        }
        return currentCall;
      });
    };

    socket.on("callIncoming", handleIncomingCall);
    socket.on("disconnect-call", handleCallDisconnectedByRemote); // Listen for explicit disconnects

    const enableSound = () => {
      canPlaySoundRef.current = true;
      document.removeEventListener("click", enableSound);
    };
    document.addEventListener("click", enableSound);

    return () => {
      console.log(
        "Cleaning up BeneficiaryRoutes main useEffect for user:",
        user.id
      );
      socket.off("callIncoming", handleIncomingCall);
      socket.off("disconnect-call", handleCallDisconnectedByRemote);
      document.removeEventListener("click", enableSound);
      // If you have an "unregister" event on your backend:
      // socket.emit("unregister", "beneficiary", user.id);
    };
  }, [user?.id]);

  // useEffect for managing call timeout
  useEffect(() => {
    // Always clear previous timeout when incomingCall or its properties change
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    if (incomingCall && incomingCall.roomId) {
      // Ensure roomId exists
      console.log(
        `Call Timeout: Starting 30s timeout for incoming call (Room: ${incomingCall.roomId})`
      );
      if (canPlaySoundRef.current) {
        notificationSound.current.loop = true; // Loop the sound
        notificationSound.current
          .play()
          .catch((err: any) =>
            console.error("Sound play error (incoming call):", err)
          );
      }

      callTimeoutRef.current = setTimeout(() => {
        console.warn(
          `Call Timeout: Call for room ${incomingCall.roomId} timed out.`
        );
        // Check if the call that timed out is still the current incomingCall
        setIncomingCall((currentCall) => {
          if (currentCall && currentCall.roomId === incomingCall.roomId) {
            socket.emit("call_missed", {
              // Or use 'rejectCall' with a reason
              senderId: incomingCall.senderId,
              receiverId: incomingCall.receiverId, // This user
              roomId: incomingCall.roomId,
              reason: "timeout",
            });
            console.log(
              `Socket: Emitted 'call_missed' for room ${incomingCall.roomId}`
            );
            notificationSound.current.pause();
            notificationSound.current.currentTime = 0;
            notificationSound.current.loop = false;
            return null; // Clear the incoming call from UI
          }
          return currentCall; // If it's a different call, don't alter it
        });
      }, 30000); // 30 seconds
    } else {
      // If there's no incoming call, ensure sound is stopped and not looping
      notificationSound.current.pause();
      notificationSound.current.currentTime = 0;
      notificationSound.current.loop = false;
    }

    // Cleanup for this effect
    return () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
        console.log(
          `Call Timeout: Cleared timeout for call (Room: ${incomingCall?.roomId}) due to effect cleanup.`
        );
      }
      // Ensure sound stops if the incoming call changes or component unmounts
      notificationSound.current.pause();
      notificationSound.current.currentTime = 0;
      notificationSound.current.loop = false;
    };
  }, [incomingCall]); // Re-run this effect only when incomingCall object reference changes

  const acceptCall = (callData: CallData) => {
    console.log("Call Action: Accepting call...", callData);

    if (!socket) {
      console.error("Socket is not available for acceptCall!");
      return;
    }
    if (!callData.roomId) {
      console.error("Missing Room ID in callData for acceptCall!");
      return;
    }

    // Clear the timeout and stop sound as the call is being handled
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    notificationSound.current.pause();
    notificationSound.current.currentTime = 0;
    notificationSound.current.loop = false;

    // Emit event to server that call is accepted
    // The 'volunteerId' here might need to be 'accepterId' or similar
    // Assuming callData.receiverId is the current user (beneficiary)
    socket.emit("acceptCall", {
      roomId: callData.roomId,
      userId: callData.receiverId, // ID of the user accepting the call
    });
    console.log(`Socket: Emitted 'acceptCall' for room ${callData.roomId}`);

    setIncomingCall(null); // Clear the incoming call UI

    // Navigate to the call page
    navigate(
      `/call?type=${callData.callType}&action=receiver&sender=${
        callData.senderId
      }&receiver=${callData.receiverId}&senderName=${
        callData.senderName
      }&roomId=${callData.roomId}&receiverName=${user?.name || "User"}`
    );
  };

  const rejectCall = (callData: CallData) => {
    console.log("Call Action: Rejecting call...", callData);
    if (!socket) {
      console.error("Socket is not available for rejectCall!");
      return;
    }
    if (!callData.roomId) {
      console.error("Missing Room ID in callData for rejectCall!");
      return;
    }

    // Clear the timeout and stop sound
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    notificationSound.current.pause();
    notificationSound.current.currentTime = 0;
    notificationSound.current.loop = false;

    setIncomingCall(null); // Clear the incoming call UI

    // Emit event to server that call is rejected
    socket.emit("rejectCall", {
      senderId: callData.senderId,
      receiverId: callData.receiverId, // This user
      roomId: callData.roomId,
      reason: "declined_by_user",
    });
    console.log(`Socket: Emitted 'rejectCall' for room ${callData.roomId}`);
  };

  return (
    <>
      {incomingCall &&
        incomingCall.roomId && ( // Ensure incomingCall and roomId are valid before rendering popup
          <IncomingCallPopup
            incomingCall={incomingCall}
            acceptCall={() => acceptCall(incomingCall)}
            rejectCall={() => rejectCall(incomingCall)}
          />
        )}
      <Routes>
        <Route path="home" element={<BeneficiaryHome />} />
        <Route path="landingpage" element={<HomePage />} />
        <Route path="test" element={<OTPVerification />} />{" "}
        {/* This seems like a test route */}
        <Route path="story" element={<Story />} />
        <Route path="/call" element={<MEET />} />
        {/* Nested Routes for Account Section */}
        <Route path="/account" element={<BeneficiaryAccount />}>
          <Route path="home" element={<Navigate to="/home" replace />} />{" "}
          {/* Redirect to home */}
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="stories" element={<StoryHistory />} />
          <Route path="chats" element={<ChatList />} />
          {/* Add other /account sub-routes here if needed */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default BeneficiaryRoutes;
