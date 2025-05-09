import { useEffect, useState } from "react";
import {  Plus } from "lucide-react";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Sidebar from "../../../components/admin/Dashboard/sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchDonors, blockDonor, unblockDonor } from "../../../reducers/admin/adminReducer";

export function DonorsList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { donors, loading, error } = useSelector((state: RootState) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchDonors());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/admin/donors/edit/${id}`);
  };

  const handleBlock = (id: string, isActive: boolean) => {
    if (isActive) {
      dispatch(blockDonor(id));
    } else {
      dispatch(unblockDonor(id));
    }
  };

  const filteredDonors = donors.filter(
    (donor) =>
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDonors = filteredDonors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">DONORS</h1>
          <Button className="bg-green-400 hover:bg-green-500 text-white" onClick={() => navigate("/admin/donors/add")}>
            <Plus className="w-4 h-4 mr-2" />
            ADD +
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by name/email/phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white"
              />
            </div>
            <Button className="bg-black hover:bg-gray-800 text-white px-6">SEARCH</Button>
            <Button variant="outline" className="px-6">
              Status
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading donors...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 font-medium text-gray-600">NAME</th>
                  <th className="pb-4 font-medium text-gray-600">EMAIL</th>
                  <th className="pb-4 font-medium text-gray-600">PHONE</th>
                  <th className="pb-4 font-medium text-gray-600">STATUS</th>
                  <th className="pb-4 font-medium text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentDonors.map((donor) => (
                  <tr key={donor._id} className="border-t">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img
                            src={donor.avatar || "/images/hero-background.jpg"}
                            alt={donor.name}
                            className="w-8 h-8 rounded-full"
                          />
                        </Avatar>
                        <span>{donor.name}</span>
                      </div>
                    </td>
                    <td className="py-4">{donor.email}</td>
                    <td className="py-4">{donor.phone}</td>
                    <td className="py-4">{donor.isActive ? "Active" : "Blocked"}</td>
                    <td className="py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-400 hover:bg-blue-500 text-white px-6"
                        onClick={() => handleEdit(donor._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className={
                          donor.isActive
                            ? "bg-red-400 hover:bg-red-500 text-white px-6"
                            : "bg-green-400 hover:bg-green-500 text-white px-6"
                        }
                        onClick={() => handleBlock(donor._id, donor.isActive)}
                      >
                        {donor.isActive ? "Block" : "Unblock"}
                      </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentPage === page
                  ? "bg-[#b8860b] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500 mt-4 text-center">
          SHOWING {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDonors.length)} OF {filteredDonors.length}
        </div>
      </div>
    </div>
  );
}
