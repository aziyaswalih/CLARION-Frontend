import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../../reducers/beneficiary/storyReducer';
import { RootState, AppDispatch } from '../../store/store';
import Swal from 'sweetalert2';
import { newBloodDonationAction } from '../../reducers/donors/donorReducer';
import { UserStateTypes } from '../../reducers/volunteers/volunteerApicalls';

interface IStoryCardProps {
  _id: string;
  title: string;
  beneficiary: UserStateTypes;
  requestType: 'financial' | 'blood' | 'organ';
  images?: string[];
  amount?: number;
  raisedAmount?: number;
  location?: string;
  bloodGroup?: string;
  organType?: string;
}

const CauseCard: React.FC<IStoryCardProps> = ({
  _id,
  title,
  beneficiary,
  requestType,
  images = [],
  amount,
  raisedAmount,
  location,
  bloodGroup,
  organType,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const imageUrl = images[0]
    ? `${import.meta.env.VITE_SOCKET_URL}/uploads/${images[0]}`
    : '/images/featured-4.jpeg';

  const progress = amount && raisedAmount ? Math.floor((raisedAmount / amount) * 100) : 0;

  const handleNavigate = () => {
    navigate("/donate", {
      state: {
        id: _id,
        title,
        category: requestType,
        image: imageUrl,
        goal: amount,
        raised: raisedAmount,
        location,
      },
    });
  };

  const handleDonateBlood = () => {
    Swal.fire({
      title: 'Are you sure you want to donate blood?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, donate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(newBloodDonationAction({causeId:_id})).unwrap() 
        .then((response:any) => {
          console.log(response, "blood donation response");
        Swal.fire(
          'Volunteer Will Connect You!',
          'Your blood donation has been recorded. Thank you!',
          'success'
        );
        dispatch(fetchStories()); // Refresh the stories after donation
        // window.location.reload();
      })
      .catch((error:any) => {
        console.error("Error in blood donation:", error);
      });

      }
    });
  };


  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-[#2c2520] capitalize">
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
            <Button onClick={handleNavigate} className="w-full bg-[#b8860b] hover:bg-[#956d09] text-white">
              Donate Now
            </Button>
          </div>
        )}

        {requestType === 'blood' && (
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>Blood Group:</strong> <span className="text-red-700">{bloodGroup}</span></p>
            <Button onClick={handleDonateBlood} className="bg-red-600 hover:bg-red-700 text-white w-full">
              Donate Blood
            </Button>
          </div>
        )}

        {requestType === 'organ' && (
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>Organ Needed:</strong> <span className="text-green-700">{organType}</span></p>
            <p><strong>Location:</strong> {location}</p>
            <Button onClick={handleNavigate} className="bg-green-600 hover:bg-green-700 text-white w-full">
              Pledge Organ
            </Button>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-100 text-sm text-gray-600">
      Any concerns regarding this cause? <br />
      <Button className='alert' onClick={()=>{navigate(`/concern/${beneficiary._id}`)}}>Report</Button>
      </div>
    </div>
  );
};

const LatestCauses: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading, error } = useSelector((state: RootState) => state.stories);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const approvedStories = stories.filter((story: any) => story.status === 'approved');
  const categorizedStories = {
    financial: approvedStories.filter((s: any) => s.requestType === 'financial'),
    blood: approvedStories.filter((s: any) => s.requestType === 'blood'),
    organ: approvedStories.filter((s: any) => s.requestType === 'organ'),
  };

  if (loading) return <p className="text-center py-20 text-gray-600">Loading latest causes...</p>;
  if (error) return <p className="text-center py-20 text-red-500">Error: {error}</p>;

  const isEmpty = Object.values(categorizedStories).every(arr => arr.length === 0);

  return (
    <section className="py-20 bg-[#fcfcfc]">
      {isEmpty ? (
        <div className="text-center text-xl font-bold text-[#2c2520] mt-12">
          <h1>🎉 Congratulations! 🎉</h1>
          <p>We’ve successfully completed all the causes! Thank you for your support.</p>
          <p>Stay tuned for more updates!</p>
          <Button onClick={() => navigate("/home")} className="mt-4">Go back to home</Button>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <span className="text-[#b8860b] text-2xl uppercase tracking-wider underline font-serif">Latest Causes</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#2c2520] mt-6">
                Find The Popular Cause<br />And Donate Them
              </h2>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-[#b8860b] hover:text-white">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-[#b8860b] hover:text-white">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(categorizedStories).map(([type, stories]) =>
              stories.map((story: any) => (
                <CauseCard key={story._id} {...story} />
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestCauses;
