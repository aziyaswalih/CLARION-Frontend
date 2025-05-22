import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Footer from '../components/beneficiary/Footer/Footer';
import Header from '../components/beneficiary/Header/Header';

const AboutUsPage: React.FC = () => {
  const heroImageUrl = '/images/hero-background.jpg';
  const missionImageUrl = '/images/featured-1.jpeg';
  const teamMember1Url = '/images/featured-2.jpeg';
  const teamMember2Url = '/images/featured-3.jpeg';
  const impactStatIconUrl = '/images/featured-4.jpeg';

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section
          className="opacity-75 bg-cover bg-center text-white py-20 md:py-32 relative"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
              Bringing [Hope, Education, Health] to [Your Target Community/Cause]
            </h1>
            <p className="text-lg md:text-xl mb-8 animate-fade-in-up">
              [Empowering vulnerable children through quality education.]
            </p>
            <Button size="lg" className="animate-fade-in-up delay-200" asChild>
              <Link to="/donate">Support Our Mission</Link>
            </Button>
          </div>
        </section>

        <main className="flex-grow bg-gray-50">
          {/* Our Story */}
          <section className="py-16 md:py-24 container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  The Spark That Ignited Change
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Every story has a beginning. Ours started in [Year] when [Founders] witnessed the pressing need for [Problem] in [Location].
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Driven by compassion and belief that [every child deserves a chance], [Charity Name] was born. We started small with [Initial action].
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img src={missionImageUrl} alt="Our Mission" className="w-full h-auto object-cover" />
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16 md:py-24 bg-blue-50">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Our Purpose</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-white p-8 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To empower [who you serve] by [your key methods], ensuring [desired outcome].
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We envision a future where [your ideal state - e.g., all children can thrive].
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="py-16 md:py-24 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Making a Measurable Difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <img src={impactStatIconUrl} alt="Impact Icon" className="h-12 w-12 mx-auto mb-4 bg-blue-500 rounded-full p-2" />
                <p className="text-4xl font-bold text-blue-600 mb-2">5,000+</p>
                <p className="text-gray-600">Meals Served Last Year</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <img src={impactStatIconUrl} alt="Impact Icon" className="h-12 w-12 mx-auto mb-4 bg-green-500 rounded-full p-2" />
                <p className="text-4xl font-bold text-green-600 mb-2">95%</p>
                <p className="text-gray-600">Success Rate in Program X</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <img src={impactStatIconUrl} alt="Impact Icon" className="h-12 w-12 mx-auto mb-4 bg-yellow-500 rounded-full p-2" />
                <p className="text-4xl font-bold text-yellow-600 mb-2">200+</p>
                <p className="text-gray-600">Families Supported</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <a href="/impact-report.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Our Full Impact Report
              </a>
            </div>
          </section>

          {/* Meet the Team */}
          <section className="py-16 md:py-24 bg-gray-100">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Meet the Hearts Behind the Mission</h2>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-center">
                  <img src={teamMember1Url} alt="Aziya Hafees" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md" />
                  <h4 className="text-lg font-semibold text-gray-800">Aziya Hafees</h4>
                  <p className="text-sm text-blue-600">Founder & CEO</p>
                  <p className="text-xs text-gray-500 mt-1">"Passionate about creating sustainable change."</p>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-center">
                  <img src={teamMember2Url} alt="Amal Swalih" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md" />
                  <h4 className="text-lg font-semibold text-gray-800">Amal Swalih</h4>
                  <p className="text-sm text-blue-600">Program Director</p>
                  <p className="text-xs text-gray-500 mt-1">"Dedicated to empowering communities."</p>
                </div>
              </div>
              {/* Optional team page link */}
              {/* <div className="mt-10">
                <Link to="/team" className="text-blue-600 hover:underline">See Our Full Team</Link>
              </div> */}
            </div>
          </section>

          {/* Get Involved */}
          <section className="py-16 md:py-24 container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Join Us in Making a Difference</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
              Your support is crucial. Whether you donate, volunteer your time, or spread the word, you become part of the change we create together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link to="/donate">Donate Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/volunteer">Become a Volunteer</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutUsPage;
