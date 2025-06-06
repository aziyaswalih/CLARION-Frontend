import React from "react";
import { Eye } from "lucide-react";
import Footer from "../../../components/beneficiary/Footer/Footer";
import Header from "../../../components/beneficiary/Header/Header";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LatestCauses from "../../../components/beneficiary/LatestCauses";

const DonorHome: React.FC = () => {
  const navigate = useNavigate();
  const token: string | null = localStorage.getItem("authToken");

  let donorName = "Guest";
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      donorName = decoded?.name || "Guest";
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const goToProfile = () => {
    navigate("/donor/account/profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fffdf8] to-[#f9f7f4]">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 py-24 bg-gradient-to-r from-[#fde6c6] to-[#fef9f3] shadow-md rounded-b-3xl">
        <div className="w-full md:w-1/2 mt-10 md:mt-0 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-serif text-[#b45d02] font-bold leading-snug mb-4">
            Welcome, Donor!
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#a75c04] mb-4">
            Dear {donorName}
          </h3>
          <p className="text-xl text-[#3a21bd] italic mb-6">
            "Your generosity can create ripples of change in countless lives."
          </p>
          <p className="text-lg text-[#4c4130] mb-6">
            Thank you for being a part of this mission. Together, we can achieve
            more!
          </p>
          <div
            onClick={goToProfile}
            className="inline-flex items-center space-x-2 text-[#3c3630] hover:text-[#1c1b18] transition cursor-pointer"
          >
            <Eye className="w-5 h-5" />
            <span className="underline text-lg font-medium">Go to profile</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/images/featured-1.jpeg"
            alt="Hero"
            className="rounded-2xl shadow-lg w-[80%] object-cover mt-10 md:mt-0"
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#e4f4fd] py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#4c4130] text-lg font-medium block mb-4">
            Make A Difference
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#425664] mb-6 leading-tight font-bold">
            Your Contributions <br /> Build A Brighter Tomorrow
          </h1>
          <p className="text-[#5b544d] max-w-2xl mx-auto mb-8 text-lg">
            Every donation helps transform lives. Join hands with us to bring
            hope and change to those in need.
          </p>
          <button
            onClick={() => navigate("/latest_causes")}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-10 py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200"
          >
            Donate Now
          </button>
        </div>
      </section>

      {/* Latest Causes */}
      <section id="latest_cause" className="container mx-auto py-20 px-6">
        <LatestCauses />
      </section>

      <Footer />
    </div>
  );
};

export default DonorHome;
