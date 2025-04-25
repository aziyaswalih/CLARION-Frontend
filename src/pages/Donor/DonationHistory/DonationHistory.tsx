// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserDonations } from '../../../reducers/donors/donorReducer'; 
// import { RootState, AppDispatch } from '../../../store/store';

// const DonationHistory: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { userDonations, isLoading, error } = useSelector((state: RootState) => state.donor);
// console.log(userDonations,'user donations');

//   useEffect(() => {
//     dispatch(fetchUserDonations());
//   }, [dispatch]);

//   return (
//     <section className="py-10 px-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold text-center mb-6 text-[#2c2520]">My Donation History</h1>

//       {isLoading ? (
//         <p className="text-center">Loading donations...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : userDonations.length === 0 ? (
//         <p className="text-center text-lg text-[#2c2520]">You haven’t made any donations yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {userDonations.map((donation: any) => (
//             <div key={donation._id} className="bg-white shadow rounded-lg p-4">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg font-semibold text-[#2c2520]">Story Title: {donation.storyId.title}</h3>
//                     <p className="text-sm text-gray-500">Category: {donation.storyId.requestType}</p>
//                   <p className="text-sm text-gray-500">Donated on: {new Date(donation.date).toLocaleDateString()}</p>
//                 </div>
//                 <span className="text-[#b8860b] font-bold text-xl">₹{donation.amount}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default DonationHistory
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDonations } from '../../../reducers/donors/donorReducer'; 
import { RootState, AppDispatch } from '../../../store/store';
import { useNavigate } from 'react-router-dom';

const DonationHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userDonations, isLoading, error } = useSelector((state: RootState) => state.donor);

  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 5;

  useEffect(() => {
    dispatch(fetchUserDonations());
  }, [dispatch]);

  // Pagination Logic
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = userDonations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(userDonations.length / donationsPerPage);

  const goToTransactionPage = () => {
    navigate('/donor/transaction_history');
  };

  return (
    <section className="py-10 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#2c2520]">My Donation History</h1>

      <div className="flex justify-end mb-4">
        <button 
          onClick={goToTransactionPage}
          className="bg-[#b8860b] hover:bg-[#956d09] text-white px-4 py-2 rounded"
        >
          View Transaction History
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Loading donations...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : userDonations.length === 0 ? (
        <p className="text-center text-lg text-[#2c2520]">You haven’t made any donations yet.</p>
      ) : (
        <div className="space-y-4">
          {currentDonations.map((donation: any) => (
            <div key={donation._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[#2c2520]">
                    Story Title: {donation.storyId.title}
                  </h3>
                  <p className="text-sm text-gray-500">Category: {donation.storyId.requestType}</p>
                  <p className="text-sm text-gray-500">
                    Donated on: {new Date(donation.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-[#b8860b] font-bold text-xl">₹{donation.amount}</span>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded text-[#2c2520] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded text-[#2c2520] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DonationHistory;
