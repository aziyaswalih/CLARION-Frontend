// import { useLocation } from "react-router-dom";
// import { useState } from "react";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";

// const DonationPage: React.FC = () => {
//   const location = useLocation();
//   const cause = location.state || {};

//   const [amount, setAmount] = useState("");

//   const handleDonate = () => {
//     if (!amount) {
//       alert("Please enter a donation amount");
//       return;
//     }

//     // TODO: Integrate Payment Gateway (Stripe, Razorpay, PayPal)
//     console.log("Processing donation for:", cause.title, "Amount:", amount);
//   };

//   return (
    // <div className="container mx-auto px-4 py-20">
    //   <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
    //     <img src={cause.image || "/placeholder.svg"} alt={cause.title} className="w-full h-64 object-cover rounded-lg mb-6" />
    //     <h2 className="text-2xl font-bold text-gray-800 mb-2">{cause.title}</h2>
    //     <p className="text-gray-600 mb-4">Category: <strong>{cause.category}</strong></p>
    //     <p className="text-gray-600 mb-6">
    //       Raised: <strong>${cause.raised.toLocaleString()}</strong> / Goal: <strong>${cause.goal.toLocaleString()}</strong>
    //     </p>

    //     <Input
    //       type="number"
    //       placeholder="Enter donation amount"
    //       value={amount}
    //       onChange={(e) => setAmount(e.target.value)}
    //       className="w-full p-3 bcreateDonation rounded mb-4"
    //     />

    //     <Button onClick={handleDonate} className="w-full bg-[#b8860b] hover:bg-[#956d09] text-white p-3 rounded">
    //       Donate Now
    //     </Button>
    //   </div>
    // </div>
//   );
// };

// export default DonationPage;

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useDispatch } from "react-redux";
// import { create_createDonation } from "../../../reducers/donors/donorReducer";


// const DonationPage: React.FC = () => {
//   const location = useLocation();
//   const dispatch = useDispatch()
//   const navigate = useNavigate();
//   const cause = location.state || {};
  
//   const [amount, setAmount] = useState(0); // Default amount
//   const currency = "INR";

//   const handlePayment = async () => {
//     try {
//     //   1️⃣ Create createDonation from Backend
//     //   const data = dispatch(create_createDonation({amount:amount,currency:currency}))
//       const { data } = await axios.post("http://localhost:5000/api/payments/create-createDonation", {
//         amount,
//         currency,
//       });

//       const options = {
//         key: "rzp_test_Zn93B1LFTW2F1w", // Use the Key ID from Razorpay
//         amount: data.createDonation.amount,
//         currency: data.createDonation.currency,
//         name: "Charity Donation",
//         description: "Support a Cause",
//         createDonation_id: data.createDonation.id,
//         handler: async function (response: any) {
//             // 2️⃣ Verify Payment on Backend
//             const verifyRes = await axios.post("http://localhost:5000/api/payments/verify-payment", response);
//             if (verifyRes.data.success) {
//               Swal.fire({
//                 title: "Payment Successful!",
//                 text: "Thank you for your donation ❤️",
//                 icon: "success",
//                 confirmButtonColor: "#3085d6",
//                 confirmButtonText: "OK",
//               }).then(()=>{
//                 navigate('/latest_causes')
//               });
//             } else {
//               Swal.fire({
//                 title: "Payment Failed!",
//                 text: "Something went wrong. Please try again.",
//                 icon: "error",
//                 confirmButtonColor: "#d33",
//                 confirmButtonText: "Retry",
//               });
//             }
//           },
        
//         theme: {
//           color: "#b8860b",
//         },
//       };

//       // 3️⃣ Open Razorpay Checkout
//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Payment Error:", error);
//     }
//   };

//   return (

//     <div className="container mx-auto px-4 py-20">
//       <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
//         <img src={cause.image || "/placeholder.svg"} alt={cause.title} className="w-full h-64 object-cover rounded-lg mb-6" />
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">{cause.title}</h2>
//         <p className="text-gray-600 mb-4">Category: <strong>{cause.category}</strong></p>
//         <p className="text-gray-600 mb-6">
//           Raised: <strong>${cause.raised.toLocaleString()}</strong> / Goal: <strong>${cause.goal.toLocaleString()}</strong>
//         </p>

//         <Input
//           type="number"
//           placeholder="Enter donation amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full p-3 bcreateDonation rounded mb-4"
//         />

//         <Button onClick={handlePayment} className="w-full bg-[#b8860b] hover:bg-[#956d09] text-white p-3 rounded">
//           Donate Now
//         </Button>
//       </div>
//     </div>

//   );
// };

// export default DonationPage;

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createDonation, verifyPayment } from "../../../reducers/donors/donorReducer";

interface Cause {
  title: string;
  category: string;
  raised: number;
  goal: number;
  image?: string;
}

const DonationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cause: Cause = location.state || {};

  const [amount, setAmount] = useState<number>(0);
  const currency = "INR";

  const {  isLoading, error } = useSelector((state: RootState) => state.donor);

  const handlePayment = async () => {
    try {
      const { payload } = await dispatch(createDonation({ amount, currency }));
      console.log(payload,'payload');
      if (!payload?.createDonation?.id) {
        throw new Error("createDonation creation failed");
      }
      
      const options = {
        key: "rzp_test_Zn93B1LFTW2F1w",
        amount: payload.createDonation.amount,
        currency: payload.createDonation.currency,
        name: "Charity Donation",
        description: "Support a Cause",
        order_id: payload.createDonation.id,
        handler: async (response: any) => {
            console.log(response,'response ');
            
          const verifyRes = await dispatch(verifyPayment(response));
          console.log(verifyRes,'verify response');
          
          if (verifyRes.payload?.success) {
            Swal.fire({
              title: "Payment Successful!",
              text: "Thank you for your donation ❤️",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then(() => navigate("/latest_causes"));
          } else {
            Swal.fire({
              title: "Payment Failed!",
              text: "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "Retry",
            });
          }
        },
        theme: { color: "#b8860b" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <img src={cause.image || "/placeholder.svg"} alt={cause.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{cause.title}</h2>
        <p className="text-gray-600 mb-4">Category: <strong>{cause.category}</strong></p>
        <p className="text-gray-600 mb-6">
          Raised: <strong>${cause.raised.toLocaleString()}</strong> / Goal: <strong>${cause.goal.toLocaleString()}</strong>
        </p>

        <Input
          type="number"
          placeholder="Enter donation amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 bcreateDonation rounded mb-4"
        />

        <Button
          onClick={handlePayment}
          className="w-full bg-[#b8860b] hover:bg-[#956d09] text-white p-3 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Donate Now"}
        </Button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default DonationPage;
