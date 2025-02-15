import React from 'react'
import { Button } from '../components/ui/button'
// import { Card } from '../../../components/ui/card'
import { Progress } from '../components/ui/progress';
import { Target, Eye } from 'lucide-react';
import Footer from '../components/beneficiary/Footer/Footer'
import Header from '../components/beneficiary/Header/Header'
import LatestCauses from '../components/beneficiary/LatestCauses';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const register=()=>{
    navigate('/signup')
  }

  const stats = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      number: "4597+",
      label: "People Raised"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M16.5,12A2.5,2.5 0 0,0 19,9.5A2.5,2.5 0 0,0 16.5,7A2.5,2.5 0 0,0 14,9.5A2.5,2.5 0 0,0 16.5,12M9,11A3,3 0 0,0 12,8A3,3 0 0,0 9,5A3,3 0 0,0 6,8A3,3 0 0,0 9,11M16.5,14C14.67,14 11,14.92 11,16.75V19H22V16.75C22,14.92 18.33,14 16.5,14M9,13C6.67,13 2,14.17 2,16.5V19H9V16.75C9,15.9 9.33,14.41 11.37,13.28C10.5,13.1 9.66,13 9,13Z"/>
        </svg>
      ),
      number: "8945+",
      label: "Volunteers"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
        </svg>
      ),
      number: "10M+",
      label: "Poor People Saved"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
        </svg>
      ),
      number: "100+",
      label: "Contributors"
    }
  ];
  return (
    <div className="min-h-screen flex flex-col bg-[#e8e4da]">
      <Header />

      <section className="relative h-[600px]">
        <img
          src="/images/hero-background1.webp" 
          alt="Hero"
          className="w-full h-full object-cover brightness-100"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-5xl md:text-7xl font-thin text-[#3c3630] tracking-wider mb-6">
            BE A CHANGE
          </h2>
          <p className="text-lg md:text-xl text-[#3c3630] mb-8">
            Trust | Transparency | Donation | Clarity | Honesty
          </p>
          <Button className="bg-[#b8860b] hover:bg-[#956d09] text-white px-8 py-3 rounded text-lg mb-4" onClick={register}>
            Join With Us
          </Button>
          <p className="text-sm text-[#3c3630]">
            If You Want To Contribute Without Joining,{' '}
            <a href="#" className="text-[#64501c] hover:text-[#956d09] underline">
              Click Here
            </a>
          </p>
         
        </div>
      </section>

      <section className="bg-[#e8f4ff] min-h-[600px] flex items-center justify-center px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <span className="text-[#3c3630] text-lg mb-4 block">
          Give Hope For Homeless
        </span>
        
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
      <div className="relative min-h-[500px] flex items-center">
        {/* Background Image */}
        <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-[#f5f0e9] border-[15px] border-[#b8870b51]">
          <img
            src="/images/featured-1.jpeg"
            alt="Support Group"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Foreground Image */}
        <div className="absolute left-[200px] top-[150px] w-[360px] h-[378px] border-[15px] border-[#b8870b51]">
          <img
            src="/images/featured-2.jpeg"
            alt="Happy Volunteers"
            className="w-full h-full object-cover shadow-xl"
          />
        </div>

        {/* Content */}
        <div className="ml-auto w-full max-w-[600px] pl-8">
          <span className="text-[#b8860b] font-medium mb-2 block">About Us</span>
          <h2 className="text-4xl font-bold text-[#2c2520] mb-6">
            Your Support Is Really Powerful.
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We Strive To Help Others Live A Better Life And Never Give Up. We Believe That You Can Make The Lives Of The Poor The Blessed And The Helpless.
          </p>
          <Button className="bg-[#b8860b] hover:bg-[#956d09] text-white px-8 py-3">
            Read More
          </Button>
        </div>
      </div>
    </section>

    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <span className="text-[#b8860b] font-medium mb-2 block">Welcome To Charity</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#2c2520] leading-tight mb-4">
                Let Us Come Together<br />To Make A Difference
              </h2>
              <p className="text-gray-600 mb-8">
               No one has ever become poor from giving.
               Money is not the only commodity that is fun to give. We can give time, we can give our expertise, we can give our love, or simply give a smile.
               What does that cost? The point is, none of us can ever run out of something worthwhile to give.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Our Mission */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#b8860b]/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <h3 className="font-semibold text-[#2c2520]">Our Mission</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed enim vivendum.
                </p>
              </div>

              {/* Our Vision */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#b8860b]/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <h3 className="font-semibold text-[#2c2520]">Our Vision</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed enim vivendum.
                </p>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#2c2520]">Donations</span>
                  <span className="text-[#289581]">75%</span>
                </div>
                <Progress value={75} className="h-2 bg-gray-200" indicatorClassName="bg-[#289581]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#2c2520]">Medical Help</span>
                  <span className="text-[#289581]">90%</span>
                </div>
                <Progress value={90} className="h-2 bg-gray-200" indicatorClassName="bg-[#289581]" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            {/* gghhh */}
             {/* Background Image */}
        <div className="absolute left-0 top-[-250px] w-[350px] h-[350px] bg-[#f5f0e9] border-[15px] border-[#b8870b51]">
          <img
            src="/images/featured-4.jpeg"
            alt="Support Group"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Foreground Image */}
        <div className="absolute left-[200px] top-[-100px] w-[360px] h-[300px] border-[15px] border-[#b8870b51] bg-white">
          
          <ul className="space-y-3 pl-3 mt-5">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                  <span className="text-gray-700">Together We're Here To Make The Future</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                  <span className="text-gray-700">Children Where We Are Able To fulfill All</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                  <span className="text-gray-700">Their Requirements To Keep Them Safe From Different Areas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                  <span className="text-gray-700">A Better Life For Those Who Are Start Changing The World</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                  <span className="text-gray-700">Accept Safe Team From Our Community</span>
                </li>
              </ul>
        </div>
         
          </div>
        </div>
      </div>
    </section>

  
    <section className="py-20 bg-[#f7efe5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#b8860b] text-sm uppercase tracking-wider">Our Fun Facts</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2c2520] mt-4 max-w-2xl mx-auto">
            We Believe That We Can Save More Lives With You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#b8860b]/10 flex items-center justify-center text-[#b8860b]">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-[#2c2520] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  

    <LatestCauses />


      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Team</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <img
                    src={`/images/team-${index}.jpg`} // Add these images to your public folder
                    alt={`Team Member ${index}`}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
                <h4 className="text-white font-bold">John Doe</h4>
                <p className="text-gray-300">Volunteer</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage

