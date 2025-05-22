import { useEffect, useState } from "react";
// import {  Plus } from "lucide-react";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Sidebar from "../../../components/admin/Dashboard/sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { fetchVolunteers, blockVolunteer, unblockVolunteer } from "../../../reducers/admin/adminReducer"; // update with your actual reducer path

export function VolunteerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { volunteers, loading, error } = useSelector((state: RootState) => state.admin); // assuming volunteer slice

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchVolunteers());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/admin/volunteers/edit/${id}`);
  };

  const handleBlockToggle = async (id: string, isActive: boolean) => {
    if (isActive) {
      await dispatch(blockVolunteer(id));
    } else {
      await dispatch(unblockVolunteer(id));
    }
  };

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVolunteers = filteredVolunteers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">VOLUNTEERS</h1>
          {/* <Button className="bg-green-400 hover:bg-green-500 text-white" onClick={() => navigate("/admin/volunteers/add")}>
            <Plus className="w-4 h-4 mr-2" />
            ADD
          </Button> */}
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
            <Button variant="outline" className="px-6">Status</Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
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
                  {currentVolunteers.map((volunteer) => (
                    <tr key={volunteer._id} className="border-t">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <img
                              src={volunteer.avatar || "/images/hero-background.jpg"}
                              alt={volunteer.name}
                              className="w-8 h-8 rounded-full"
                            />
                          </Avatar>
                          <span>{volunteer.name}</span>
                        </div>
                      </td>
                      <td className="py-4">{volunteer.email}</td>
                      <td className="py-4">{volunteer.phone}</td>
                      <td className="py-4">{volunteer.isActive ? "Active" : "Blocked"}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-400 hover:bg-blue-500 text-white px-6"
                            onClick={() => handleEdit(volunteer._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            className={volunteer.isActive ? "bg-red-400 hover:bg-red-500 text-white px-6" : "bg-green-400 hover:bg-green-500 text-white px-6"}
                            onClick={() => handleBlockToggle(volunteer._id, volunteer.isActive)}
                          >
                            {volunteer.isActive ? "Block" : "Unblock"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
              SHOWING {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredVolunteers.length)} OF {filteredVolunteers.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
