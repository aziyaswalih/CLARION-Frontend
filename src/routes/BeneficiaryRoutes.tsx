import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import OTPVerification from "../pages/Beneficiary/signup/otpverify";
import BeneficiaryHome from "../pages/Beneficiary/HomePage/Home";
import HomePage from "../pages/HomePage";
import NotFound from "../components/NotFound";
import ProfilePage from "../pages/Beneficiary/ProfilePage/ProfilePage";
import Story from "../pages/Beneficiary/Story/Story";
import StoryHistory from "../pages/Beneficiary/StoryHistory/StoryHistory";
import MEET from "../components/calls/VideoCall";
import IncomingCallPopup from "../components/notifications/incomingcall";
import socket from "../socket/socket";
import { CallData } from "../reducers/volunteers/volunteerApicalls";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ChatList from "../pages/Beneficiary/Chat/ChatListUserSide";
import BeneficiaryAccount from "../pages/Beneficiary/BeneficiaryAccount/BeneficiaryAccount";
// import UserProtect from "../components/beneficiary/Protect/UserProtect";

const BeneficiaryRoutes = () => {
  const  user  = useSelector((state: RootState) => state.users.user);
    const notificationSound = useRef(new Audio("/wet-431.mp3"));
    const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  
    const canPlaySoundRef = useRef(false); // ✅ Use ref to track state outside React
  const navigate=useNavigate()
    useEffect(() => {
      socket.emit("register", "volunteer", user?.id);
  
  
      socket.off("callIncoming");
  
      socket.on("callIncoming", (data: CallData) => {
        console.log("Incoming call:", data);
        setIncomingCall(data);
      });
      socket.on("disconnect-call", (data) => {
        console.log("Incoming call:", data);
        setIncomingCall(null);
      });
  
     
      // Enable sound when user clicks
      const enableSound = () => {
        canPlaySoundRef.current = true; // ✅ Update ref to keep track of state
        document.removeEventListener("click", enableSound);
      };
  
      document.addEventListener("click", enableSound);
  
      // Listen for new booking notifications
      socket.on("bookingNotification", (booking) => {
        if (!Array.isArray(booking)) return;
  
        const matchedBooking = booking.find((emp) => emp?.volunteerId === user?.id);
  
        if (matchedBooking) {
          console.log("Received New Booking:", matchedBooking);
  
          // ✅ Check `canPlaySoundRef` instead of state
          if (canPlaySoundRef.current) {
            notificationSound.current.play().catch((err:any) => console.error("Sound play error:", err));
          }
  
          // // Show toast notification
          // toast.info(`New Booking Available`, {
          //   position: "top-right",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          // });
        }
      });
  
      return () => {
        socket.off("bookingNotification");
        document.removeEventListener("click", enableSound);
        socket.off('callIncoming')
      };
    }, [user?.id]);
    
  
    const acceptCall = (callData: CallData) => {
      console.log("📞 Call accepted function triggered with:", callData);
  
      if (!socket) {
          console.error("❌ Socket is undefined!");
          return;
      }
  
      if (!callData.roomId) {
          console.error("❌ Missing Room ID!");
          return;
      }
  
      
      console.log("✅ Emitting 'callAccepted' event...");
      setTimeout(() => {
        socket.emit("acceptCall", { roomId: callData.roomId, volunteerId: callData.receiverId });
      }, 500);
  
      setIncomingCall(null)
      navigate(`/call?type=${callData.callType}&action=${'receiver'}&sender=${callData.senderId}&receiver=${callData.receiverId}&senderName=${callData.senderName}&roomId=${callData.roomId}`)
      
      console.log("🔄 Removing 'callIncoming' listener...");
      socket.off('acceptCall');
  };
  
  
  const rejectCall=(callData:CallData)=>{
    setIncomingCall(null)
    socket.emit('rejectCall',{senderId:callData.senderId,roomId:callData.roomId})
  
    socket.off('rejectCall')  
  }
  
    
  
    return (
      <>
  
  {incomingCall && (
         
          <IncomingCallPopup incomingCall={incomingCall} acceptCall={()=>acceptCall(incomingCall)}  rejectCall={()=>rejectCall(incomingCall)}/>
        )}
  {/* return ( */}
    <Routes>
      <Route path="home" element={<BeneficiaryHome />} />
      {/* <Route path="profile" element={<ProfilePage />} /> */}
      <Route path="landingpage" element={<HomePage />} />
      <Route path="test" element={<OTPVerification />} />
      <Route path="*" element = {<NotFound />} />
      <Route path="story" element={<Story/>} />
      {/* <Route path="stories" element={<StoryHistory/>} /> */}
      <Route path="/call" element={<MEET/>}/>
      {/* <Route path="chats" element={<ChatList/>} /> */}
      <Route path="/account" element={<BeneficiaryAccount />}>
        <Route path="home" element={<Navigate to="/home" />} />
        <Route path="stories" element={<StoryHistory />} />
        <Route path="chats" element={<ChatList />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
    </>
  );
};

export default BeneficiaryRoutes;
