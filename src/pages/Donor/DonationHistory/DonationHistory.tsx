import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDonations } from "../../../reducers/donors/donorReducer";
import { RootState, AppDispatch } from "../../../store/store";
import { useNavigate } from "react-router-dom";
// import DonationCertificate from '../DonationCertificate/DonationCertificate';

const DonationHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userDonations, isLoading, error } = useSelector(
    (state: RootState) => state.donor
  );
  const user = useSelector((state: RootState) => state.users.user);

  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchUserDonations());
  }, [dispatch]);

  const handleClick = (
    requestType: "blood" | "organ" | "financial",
    blood = null,
    organ = null,
    amount = null,
    date: Date
  ) => {
    navigate("/donor/certificate", {
      state: {
        donorName: user?.name as string,
        requestType: requestType,
        bloodGroup: blood,
        date: date,
        organ: organ,
        amount: amount,
      },
    });
  };

  // Search
  const filteredDonations = userDonations.filter((donation:any) => {
    const matchesSearch = donation.storyId?.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" ||
      donation.storyId?.requestType === filterCategory;
    return matchesSearch && matchesCategory;
  });

 

  // Sort
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (sortOption === "amountH") return b.amount - a.amount;
    if (sortOption === "amountL") return a.amount - b.amount;
    if (sortOption === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0;
  });

  // Pagination
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = sortedDonations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );
  const totalPages = Math.ceil(sortedDonations.length / donationsPerPage);

  const goToTransactionPage = () => {
    navigate("/donor/account/transactions");
  };

  // Unique categories for filter dropdown
  const categories = [
    "All",
    ...new Set(userDonations.map((d: any) => d.storyId?.requestType)),
  ];

  return (
    <section className="py-10 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#2c2520] underline">
        My Donation History
      </h1>

      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <button
          onClick={goToTransactionPage}
          className="bg-[#b8860b] hover:bg-[#956d09] text-white px-4 py-2 rounded"
        >
          View Transaction History
        </button>

        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="amountL">Amount low-high</option>
          <option value="amountH">Amount high-low</option>
          <option value="date">Date</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-center">Loading donations...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : sortedDonations.length === 0 ? (
        <p className="text-center text-lg text-[#2c2520]">
          No matching donations found.
        </p>
      ) : (
        <div className="space-y-4">
          {currentDonations.map((donation: any) => (
            <div key={donation._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[#2c2520]">
                    Story Title: {donation.storyId.title}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    Category: {donation.storyId.requestType}
                  </p>
                  <p className="text-sm text-gray-500">
                    Donated on: {new Date(donation.date).toLocaleDateString()}
                  </p>
                  {/* <p className='text-sm text-gray-500 font-serif'>
                  <a href={<DonationCertificate donorName="Aziya Hafees"  requestType="blood" bloodGroup="O+"  date="2025-05-08"/>} className='text-blue-500 hover:text-blue-800 underline font-serif'>Click Here</a> to download the Donation Certificate
                  </p> */}
                  <p>
                    <button
                      onClick={() =>
                        handleClick(
                          donation.storyId.requestType,
                          donation.storyId.bloodGroup,
                          donation.storyId.organType,
                          donation.amount,
                          donation.date
                        )
                      }
                      className="text-blue-500 hover:text-blue-800 underline font-serif"
                    >
                      Click Here
                    </button>{" "}
                    to download the Donation Certificate
                  </p>
                </div>
                <span className="text-[#b8860b] font-bold text-xl">
                  ₹{donation.amount}
                </span>
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
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
