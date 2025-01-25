import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';

interface CauseProps {
  category: string;
  title: string;
  image: string;
  raised: number;
  goal: number;
  progress: number;
}

const causes: CauseProps[] = [
  {
    category: 'Medical',
    title: 'Donate For Poor People\'s Treatment And Medicine',
    image: '/images/medical-care.jpg',
    raised: 8500,
    goal: 15000,
    progress: 56
  },
  {
    category: 'Homeless',
    title: 'Children We Work With',
    image: '/images/volunteers.jpg',
    raised: 9000,
    goal: 15000,
    progress: 60
  },
  {
    category: 'Education',
    title: 'Help For Education',
    image: '/images/education.jpg',
    raised: 8000,
    goal: 15000,
    progress: 53
  },
  {
    category: 'Food',
    title: 'Help For Food',
    image: '/images/food-donation.jpg',
    raised: 8500,
    goal: 15000,
    progress: 56
  },
  {
    category: 'Orphanage',
    title: 'Save The Children',
    image: '/images/orphanage.jpg',
    raised: 8500,
    goal: 15000,
    progress: 56
  },
  {
    category: 'Blood Donation',
    title: 'Donate Blood',
    image: '/images/blood-donation.jpg',
    raised: 8500,
    goal: 15000,
    progress: 85
  }
];

const CauseCard: React.FC<CauseProps> = ({ category, title, image, raised, goal, progress }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-[#2c2520]">
          {category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[#2c2520] mb-4 line-clamp-2">
          {title}
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-100" indicatorClassName="bg-[#289581]" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Raised: ${raised.toLocaleString()}</span>
              <span>Goal: ${goal.toLocaleString()}</span>
            </div>
          </div>
          <Button className="w-30 bg-[#b8860b] hover:bg-[#956d09] text-white">
            Donate Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const LatestCauses: React.FC = () => {
  return (
    <section className="py-20 bg-[#fcfcfc]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <span className="text-[#b8860b] text-sm uppercase tracking-wider">Latest Causes</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2c2520] mt-2">
              Find The Popular Cause<br />
              And Donate Them
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white shadow-md hover:bg-[#b8860b] hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full bg-white shadow-md hover:bg-[#b8860b] hover:text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause, index) => (
            <CauseCard key={index} {...cause} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCauses;

