import HomePage from "../pages/Volunteer/Home/Home";
import NotFound from "../components/NotFound";
import { Navigate, Route, Routes } from "react-router-dom";
import ProfilePage from "../pages/Volunteer/ProfilePage/ProfilePage";
import StoryDetailsPage from "../pages/Volunteer/StoryDetailsPage/StoryDetailsPage";
import MEET from "../components/calls/VideoCall";
import VolunteerAccount from "../pages/Volunteer/VolunteerAccount/VolunteerAccount";
import VolunteerChatList from "../pages/Volunteer/UserChat/VolunteerChatList";
import { TakeupStories } from "../pages/Volunteer/Stories/TakeupStories";
import { RecentStories } from "../pages/Volunteer/Stories/RecentStories";


const VolunteerRoutes = () => {
  //   const  volunteer  = useSelector((state: RootState) => state.users.user);
  //   const notificationSound = useRef(new Audio("/wet-431.mp3"));
  //   const [incomingCall, setIncomingCall] = useState<CallData | null>(null);

  //   const canPlaySoundRef = useRef(false); // ✅ Use ref to track state outside React
  // const navigate=useNavigate()
  //   useEffect(() => {
  //     socket.emit("register", "volunteer", volunteer?.id);

  //     socket.off("callIncoming");

  //     socket.on("callIncoming", (data: CallData) => {
  //       console.log("Incoming call:", data);
  //       setIncomingCall(data);
  //     });
  //     socket.on("disconnect-call", (data) => {
  //       console.log("Incoming call:", data);
  //       setIncomingCall(null);
  //     });

  //     // Enable sound when user clicks
  //     const enableSound = () => {
  //       canPlaySoundRef.current = true; // ✅ Update ref to keep track of state
  //       document.removeEventListener("click", enableSound);
  //     };

  //     document.addEventListener("click", enableSound);

  //     // Listen for new booking notifications
  //     socket.on("bookingNotification", (booking) => {
  //       if (!Array.isArray(booking)) return;

  //       const matchedBooking = booking.find((emp) => emp?.volunteerId === volunteer?.id);

  //       if (matchedBooking) {
  //         console.log("Received New Booking:", matchedBooking);

  //         // ✅ Check `canPlaySoundRef` instead of state
  //         if (canPlaySoundRef.current) {
  //           notificationSound.current.play().catch((err) => console.error("Sound play error:", err));
  //         }

  //         // // Show toast notification
  //         // toast.info(`New Booking Available`, {
  //         //   position: "top-right",
  //         //   autoClose: 5000,
  //         //   hideProgressBar: false,
  //         //   closeOnClick: true,
  //         //   pauseOnHover: true,
  //         //   draggable: true,
  //         // });
  //       }
  //     });

  //     return () => {
  //       socket.off("bookingNotification");
  //       document.removeEventListener("click", enableSound);
  //       socket.off('callIncoming')
  //     };
  //   }, [volunteer?.id]);

  //   const acceptCall = (callData: CallData) => {
  //     console.log("📞 Call accepted function triggered with:", callData);

  //     if (!socket) {
  //         console.error("❌ Socket is undefined!");
  //         return;
  //     }

  //     if (!callData.roomId) {
  //         console.error("❌ Missing Room ID!");
  //         return;
  //     }

  //     console.log("✅ Emitting 'callAccepted' event...");
  //     setTimeout(() => {
  //       socket.emit("acceptCall", { roomId: callData.roomId, volunteerId: callData.receiverId });
  //     }, 500);

  //     setIncomingCall(null)
  //     navigate(`/volunteer/call?type=${callData.callType}&action=${'receiver'}&sender=${callData.senderId}&receiver=${callData.receiverId}&senderName=${callData.senderName}&roomId=${callData.roomId}`)

  //     console.log("🔄 Removing 'callIncoming' listener...");
  //     socket.off('acceptCall');
  // };

  // const rejectCall=(callData:CallData)=>{
  //   setIncomingCall(null)
  //   socket.emit('rejectCall',{senderId:callData.senderId,roomId:callData.roomId})

  //   socket.off('rejectCall')
  // }

  //   return (
  //     <>

  // {incomingCall && (

  //         <IncomingCallPopup incomingCall={incomingCall} acceptCall={()=>acceptCall(incomingCall)}  rejectCall={()=>rejectCall(incomingCall)}/>
  //       )}
  return (
    <Routes>
      <Route path="home" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/account" element={<VolunteerAccount />}>
        <Route path="home" element={<Navigate to="/volunteer/home" />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* <Route path="stories" element={<StoryDetailsPage />} /> */}
        <Route path="chats" element={<VolunteerChatList userId={null} />} />
        <Route path="takeup-stories" element={<TakeupStories />} />
        <Route path="recent-stories" element={<RecentStories />} />
      </Route>
      <Route path="profile" element={<ProfilePage />} />
      <Route path="story/:id" element={<StoryDetailsPage />} />
      <Route path="/call" element={<MEET />} />

      {/* <Route path="call" element = {<UserChatDetails volunteerId={""} userId={""} userName={""}/>} /> */}
      {/* <Route path="call" element={<VideoCall />} /> */}
    </Routes>
    // </>
  );
};

export default VolunteerRoutes;
