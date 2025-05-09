import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createDonation, verifyPayment, newDonation } from "../../../reducers/donors/donorReducer";
import { fetchWallet } from "../../../reducers/users/walletReducer";
import Header from "../../../components/beneficiary/Header/Header";

interface Cause {
  id: string;
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
  const { walletBalance, walletLoading } = useSelector((state:RootState) => state.wallet);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  const {  isLoading, error } = useSelector((state: RootState) => state.donor);

  const handlePayment = async () => {
    try {
      console.log(walletBalance,'wallet balance');
      
      // if(walletBalance>0 && walletBalance<amount){
      //   setAmount(amount-walletBalance)
      // }
      console.log(amount,'amount');
      if(walletBalance > 0 && amount < walletBalance){
        dispatch(newDonation({ causeId: cause.id, amount:amount })); 
        Swal.fire({
          title: "Payment Successful! Thank you for your donation! ❤️",
          text: "Your contribution has been successfully processed using your wallet balance.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => navigate("/latest_causes"));
      }
      else{
        const { payload } = await dispatch(createDonation({ amount:amount-walletBalance>0?amount-walletBalance:0, currency }));
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
            dispatch(newDonation({ causeId: cause.id, amount:amount  })); // Update the donation in the store
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
    }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <Header/>
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <img src={cause.image || "/placeholder.svg"} alt={cause.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{cause.title}</h2>
        <p className="text-gray-600 mb-4">Category: <strong>{cause.category}</strong></p>
        <p className="text-gray-600 mb-6">
          Raised: <strong>₹ {cause.raised.toLocaleString()}</strong> / Goal: <strong>₹ {cause.goal.toLocaleString()}</strong>
        </p>
        <div>
          {walletLoading ? <p>Loading Wallet...</p> : <p>Wallet Balance: ₹ {walletBalance}</p>}
        </div>
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
