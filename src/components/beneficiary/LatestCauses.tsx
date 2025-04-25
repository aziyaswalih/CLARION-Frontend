import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../../reducers/beneficiary/storyReducer'; // Adjust the import path as necessary
import { RootState, AppDispatch } from '../../store/store'; // Adjust if your root reducer is in another path
import Swal from 'sweetalert2';

interface IStoryCardProps {
  _id: string;
  title: string;
  requestType: string;
  images?: string[];
  amount?: number;
  raisedAmount?: number;
  location?: string;
  bloodGroup?: string;
}

const CauseCard: React.FC<IStoryCardProps> = ({
  _id,
  title,
  requestType,
  images = [],
  amount,
  raisedAmount,
  location,
  bloodGroup
}) => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    navigate("/donate", { state: { id:_id, title,category: requestType,image: images?.[0]?`http://localhost:5000/uploads/${images?.[0]}`:"/images/featured-4.jpeg",goal: amount,raised: raisedAmount } });
  };


  const handleDonateBlood = () => {
    Swal.fire({
      title: 'Are you sure you want to donate blood?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, donate it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Volunteer Will Connect You!',
          'Your blood donation has been recorded. Thank you!',
          'success'
        )
      }
    }
    )
    navigate("/donateBlood", { state: { id:_id, title,category: requestType,image: images?.[0]?`http://localhost:5000/uploads/${images?.[0]}`:"/images/featured-4.jpeg",location:location} });
  }
  

  const progress = amount && raisedAmount ? Math.floor((raisedAmount / amount) * 100) : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={images?.[0]?`http://localhost:5000/uploads/${images?.[0]}`:"/images/featured-4.jpeg"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-[#2c2520]">
          {requestType}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[#2c2520] mb-4 line-clamp-2">{title}</h3>
        {requestType === 'financial' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-gray-100" indicatorClassName="bg-[#289581]" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Raised: ₹{raisedAmount?.toLocaleString()}</span>
                <span>Goal: ₹{amount?.toLocaleString()}</span>
              </div>
            </div>
            <Button
              onClick={handleDonateClick}
              className="w-30 bg-[#b8860b] hover:bg-[#956d09] text-white"
            >
              Donate Now
            </Button>
          </div>
        )}


        {requestType === "blood" && (
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>Blood Group:</strong> <span className="text-red-700">{bloodGroup}</span></p>
            {/* <p><strong>Location:</strong> {location}</p> */}
            <Button onClick={handleDonateBlood} className="bg-red-600 hover:bg-red-700 text-white">
              Donate Blood
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};




// interface IStoryCardProps {
//   _id: string;
//   title: string;
//   requestType: string;
//   images?: string[];
//   // progress?: number;
//   raisedAmount?: number;
//   amount?: number;
//   bloodGroup?: string;
//   organType?: string;
//   location?: string;
  
// }

// const CauseCard: React.FC<IStoryCardProps> = ({
//   _id,
//   title,
//   requestType,
//   images,
//   // progress,
//   raisedAmount,
//   amount,
//   bloodGroup,
//   organType,
//   location,
//   // handleDonateClick,
// }) => {

//   const navigate = useNavigate();
//   const handleDonateClick = () => {
//     navigate("/donate", { state: { id:_id, title,category: requestType,image: images?.[0]?`http://localhost:5000/uploads/${images?.[0]}`:"/images/featured-4.jpeg",goal: amount,raised: raisedAmount } });
//   };

//   const progress = amount && raisedAmount ? Math.floor((raisedAmount / amount) * 100) : 0;
//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
//       <div className="relative h-48">
//         <img
//           src={images?.[0] ? `http://localhost:5000/uploads/${images[0]}` : "/images/featured-4.jpeg"}
//           alt={title}
//           className="w-full h-full object-cover"
//         />
//         <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-[#2c2520] capitalize">
//           {requestType}
//         </span>
//       </div>

//       <div className="p-6">
//         <h3 className="text-lg font-semibold text-[#2c2520] mb-4 line-clamp-2">{title}</h3>

//         {requestType === "financial" && (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Progress value={progress ?? 0} className="h-2 bg-gray-100" indicatorClassName="bg-[#289581]" />
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Raised: ₹{raisedAmount?.toLocaleString()}</span>
//                 <span>Goal: ₹{amount?.toLocaleString()}</span>
//               </div>
//             </div>
//             <Button onClick={handleDonateClick} className="w-30 bg-[#b8860b] hover:bg-[#956d09] text-white">
//               Donate Now
//             </Button>
//           </div>
//         )}

        // {requestType === "blood" && (
        //   <div className="space-y-3 text-sm text-gray-700">
        //     <p><strong>Blood Group:</strong> <span className="text-red-700">{bloodGroup}</span></p>
        //     <p><strong>Location:</strong> {location}</p>
        //     <Button onClick={handleDonateClick} className="bg-red-600 hover:bg-red-700 text-white">
        //       Donate Blood
        //     </Button>
        //   </div>
        // )}

//         {requestType === "organ" && (
//           <div className="space-y-3 text-sm text-gray-700">
//             <p><strong>Organ Needed:</strong> <span className="text-green-700">{organType}</span></p>
//             <p><strong>Location:</strong> {location}</p>
//             <Button onClick={handleDonateClick} className="bg-green-600 hover:bg-green-700 text-white">
//               Pledge Organ
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const LatestCauses: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading, error } = useSelector((state: RootState) => state.stories);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const financialStories = stories.filter((story: any) => story.requestType === 'financial' && story.status === 'approved');
  const medicalStories = stories.filter((story: any) => story.requestType === 'blood' && story.status === 'approved');
  const organStories = stories.filter((story: any) => story.requestType === 'organ' && story.status === 'approved');

  const BackButton = () => {
    navigate("/home");
  }
  return (
    <section className="py-20 bg-[#fcfcfc]">
      {financialStories.length === 0 ? (
      <div className="text-center text-xl font-bold text-[#2c2520] mt-12">
        <h1>🎉 Congratulations! 🎉</h1><br></br>
        <p>We’ve successfully completed all the causes! Thank you for your support.</p>
        <p>Stay tuned for more updates!</p><br></br>
        <Button onClick={BackButton}>Go back to home</Button>
      </div>
    ) : (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <span className="text-[#b8860b] text-2xl uppercase tracking-wider underline">Latest Causes</span><br />
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

        {loading ? (
          <p className="text-center">Loading causes...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {financialStories.map((story: any) => (
              <CauseCard key={story._id} {...story} />
            ))}

            {medicalStories.map((story: any) => (
              <CauseCard key={story._id} {...story} />
            ))}

            {organStories.map((story: any) => (
              <CauseCard key={story._id} {...story} />
            ))}
          </div>

          
        )}
      </div>
    )}
    </section>
  );
};

export default LatestCauses;
