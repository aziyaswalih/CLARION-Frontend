import React from 'react';
import { Button } from '../../../components/ui/button';
import { Heart } from 'lucide-react';
import Footer from '../../../components/beneficiary/Footer/Footer';
import Header from '../../../components/beneficiary/Header/Header';
// import FeaturedProjects from '../../../components/beneficiary/FeaturedProjects';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import LatestCauses from '../../../components/beneficiary/LatestCauses';

const DonorHome: React.FC = () => {
  const navigate = useNavigate();

  const token: string | null = localStorage.getItem('authToken');

  let donorName = 'Guest';
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      donorName = decoded?.name || 'Guest';
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const goToDonations = () => {
    navigate('/donor/donations');
  };

  const stats = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
      number: '25,000+',
      label: 'Lives Impacted',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
      number: '10,000+',
      label: 'Donors',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />
      <section className="flex items-center bg-[#f3efe8]">
        <div className="w-1/2 h-full">
          <img
            src="/images/featured-1.jpeg"
            alt="Hero"
            className="w-4/5 h-full object-cover brightness-100 mt-20 m-16 p-4 bg-[#f9e7b286]"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col items-center justify-center text-gray-500 p-8">
          <h2 className="text-5xl md:text-7xl font-serif text-[#b45d02] tracking-wider mb-6">
            Welcome, Donor!
          </h2>
          <h3 className="text-3xl md:text-3xl font-serif text-[#b45d02] tracking-wider mb-6">
            Dear {donorName}
            </h3>
          <p className="text-xl md:text-2xl text-[#3a21bd] mb-8 italic">
            "Your generosity can create ripples of change in countless lives."
          </p>
          <p className="text-lg md:text-xl text-[#4c4130] mb-8">
            Thank you for being a part of this mission. Together, we can achieve more!
          </p>
          <div
            className="flex items-center space-x-4 cursor-pointer text-[#4c4130]"
            onClick={goToDonations}
          >
            <Heart className="w-6 h-6" />
            <span className="text-lg font-medium underline">View Your Donations</span>
          </div>
        </div>
      </section>

      <section className="bg-[#e4f4fd] min-h-[600px] flex items-center justify-center px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-[#4c4130] text-lg mb-4 block">Make A Difference</span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#8c7e6d] mb-6 leading-tight">
            Your Contributions <br />
            Build A Brighter Tomorrow
          </h1>
          <p className="text-[#5b544d] max-w-2xl mx-auto mb-8 text-lg">
            Every donation helps transform lives. Join hands with us to bring hope and change to those in need.
          </p>
          <Button className="bg-[#c8960b] hover:bg-[#a97509] text-white px-8 py-3 rounded-md text-lg transition-colors duration-200">
            Donate Now
          </Button>
        </div>
      </section>

      <section className="container mx-auto py-20 px-4">
        {/* <FeaturedProjects /> */}
        <LatestCauses/>
      </section>
      <Footer />
    </div>
  );
};

export default DonorHome;
