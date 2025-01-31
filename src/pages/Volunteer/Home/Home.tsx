import React from 'react';
import { Button } from '../../../components/ui/button';
import { Eye } from 'lucide-react';
import Footer from '../../../components/beneficiary/Footer/Footer';
import Header from '../../../components/beneficiary/Header/Header';
import LatestCauses from '../../../components/beneficiary/LatestCauses';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const token: string | null = localStorage.getItem('authToken');

  let volunteerName = 'Guest';
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      volunteerName = decoded?.name || 'Guest';
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const goToProfile = () => {
    navigate('/volunteer/profile');
  };

  const stats = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
      number: '4597+',
      label: 'People Raised',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M16.5,12A2.5,2.5 0 0,0 19,9.5A2.5,2.5 0 0,0 16.5,7A2.5,2.5 0 0,0 14,9.5A2.5,2.5 0 0,0 16.5,12M9,11A3,3 0 0,0 12,8A3,3 0 0,0 9,5A3,3 0 0,0 6,8A3,3 0 0,0 9,11M16.5,14C14.67,14 11,14.92 11,16.75V19H22V16.75C22,14.92 18.33,14 16.5,14M9,13C6.67,13 2,14.17 2,16.5V19H9V16.75C9,15.9 9.33,14.41 11.37,13.28C10.5,13.1 9.66,13 9,13Z" />
        </svg>
      ),
      number: '8945+',
      label: 'Volunteers',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#efede8]">
        
      <Header />
      <section className=" flex items-center bg-[#f7f6f3]">
  <div className="w-1/2 h-full">
    <img
      src="/images/volunteers.jpg"
      alt="Hero"
      className="w-4/5 h-full object-cover brightness-100 mt-20 m-16 p-4 bg-[#fae09186]"
    />
  </div>
  <div className="w-1/2 h-full flex flex-col items-center justify-center text-gray-500 p-8">
    <h2 className="text-5xl md:text-7xl font-serif text-[#b16003] tracking-wider mb-6">
      Welcome, {volunteerName}!
    </h2>
    <p className="text-xl md:text-2xl text-[#2f22bd] mb-8 italic">
      "The best way to find yourself is to lose yourself in the service of others."
    </p>
    <p className="text-lg md:text-xl text-[#3c3630] mb-8">
      We're glad to have you with us. Your efforts make a real difference!
    </p>
    <div
      className="flex items-center space-x-4 cursor-pointer text-[#3c3630]"
      onClick={goToProfile}
    >
      <Eye className="w-6 h-6" />
      <span className="text-lg font-medium underline">Go to profile</span>
    </div>
  </div>
</section>

      <section className="bg-[#e8f4ff] min-h-[600px] flex items-center justify-center px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-[#3c3630] text-lg mb-4 block">Give Hope For Homeless</span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#8b7e75] mb-6 leading-tight">
            Helping Each Other <br />
            Can Make World Better
          </h1>
          <p className="text-[#5c5652] max-w-2xl mx-auto mb-8 text-lg">
            We Seek Out World Changers And Difference Makers Around The Globe And Equip Them To Fulfill Their Unique Purpose.
          </p>
          <Button className="bg-[#b8860b] hover:bg-[#956d09] text-white px-8 py-3 rounded-md text-lg transition-colors duration-200">
            Donate Now
          </Button>
        </div>
      </section>
      <section className="container mx-auto py-20 px-4">
        <LatestCauses />
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
