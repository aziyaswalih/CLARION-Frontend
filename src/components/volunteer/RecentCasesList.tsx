import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

interface CauseProps {
  id: number;
  category: string;
  title: string;
  image: string;
  raised: number;
  goal: number;
  progress: number;
  status: 'pending' | 'approved' | 'rejected';
}

const initialCauses: CauseProps[] = [
  {
    id: 1,
    category: 'Medical',
    title: "Donate For Poor People's Treatment And Medicine",
    image: '/images/medical-care.jpg',
    raised: 8500,
    goal: 15000,
    progress: 56,
    status: 'pending'
  },
  {
    id: 2,
    category: 'Education',
    title: 'Help For Education',
    image: '/images/education.jpg',
    raised: 8000,
    goal: 15000,
    progress: 53,
    status: 'pending'
  },
  {
    id: 3,
    category: 'Food',
    title: 'Help For Food',
    image: '/images/food-donation.jpg',
    raised: 8500,
    goal: 15000,
    progress: 56,
    status: 'pending'
  }
];

const VolunteerCauseApproval: React.FC = () => {
  const [causes, setCauses] = useState(initialCauses);

  const handleAction = (id: number, action: 'approved' | 'rejected') => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === id ? { ...cause, status: action } : cause
      )
    );
  };

  return (
    <section className="py-20 bg-[#fcfcfc]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-[#2c2520] mb-6">Pending Causes for Approval</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map(cause => (
            <div key={cause.id} className="bg-white rounded-lg overflow-hidden shadow-md p-6">
              <img src={cause.image} alt={cause.title} className="w-full h-48 object-cover mb-4" />
              <span className="bg-[#b8860b] text-white px-3 py-1 rounded-full text-sm">{cause.category}</span>
              <h3 className="text-lg font-semibold text-[#2c2520] mt-3 mb-2">{cause.title}</h3>
              {/* <Progress value={cause.progress} className="h-2 bg-gray-100" indicatorClassName="bg-[#289581]" /> */}
              <div className=" text-lg text-gray-600 my-3">
              <p className='text-sm text-gray-600'>Beneficiary Name : </p>
              <p className="text-sm text-gray-600">Category : {cause.category}</p>
                <p>Total Amount Required: Rs {cause.raised.toLocaleString()}</p>
                {/* <span>Goal: ${cause.goal.toLocaleString()}</span> */}
              </div>
              <div className='text-sm text-blue-600'>
              <Link to='/main'>View Details</Link>
              </div>
              {cause.status === 'pending' ? (
                <div className="flex gap-4 mt-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(cause.id, 'approved')}>Approve</Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleAction(cause.id, 'rejected')}>Reject</Button>
                  
                </div>
              ) : (
                <p className={`mt-4 font-bold ${cause.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                  {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerCauseApproval;
