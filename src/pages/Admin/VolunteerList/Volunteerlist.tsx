import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Sidebar from "../../../components/admin/Dashboard/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  avatar?: string;
}

export function VolunteerTable() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get<{ success: boolean;message:string, volunteers: any }>(
          "http://localhost:5000/api/admin/volunteers"
        );

        if (!response.data.volunteers) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response.data);
        
        setVolunteers(response.data.volunteers);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/admin/volunteers/edit/${id}`);
  };

  const handleBlock = async (id: string,isActive:boolean) => {
    try {if(isActive){
        const response = await axios.put(
        `http://localhost:5000/api/admin/volunteers/block/${id}`
      );
    
      if (response.data.success) {
        // Update the volunteers list to reflect the blocked status
        setVolunteers((prev) =>
          prev.map((volunteers) =>
            volunteers._id === id ? { ...volunteers, isActive: false } : volunteers
          )
        );
        console.log("volunteers blocked successfully");
      } else {
        console.error("Failed to block volunteers:", response.data.message);
      }
    }else if(!isActive){
        const response = await axios.put(
        `http://localhost:5000/api/admin/volunteers/unblock/${id}`
      );
    
      if (response.data.success) {
        // Update the volunteers list to reflect the blocked status
        setVolunteers((prev) =>
          prev.map((volunteers) =>
            volunteers._id === id ? { ...volunteers, isActive: true } : volunteers
          )
        );
        console.log("volunteers unblocked successfully");
      } else {
        console.error("Failed to unblock volunteers:", response.data.message);
      }
    }
    
    } catch (error) {
      console.error("Error blocking/unblocking volunteers:", error);
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
          <Button className="bg-green-400 hover:bg-green-500 text-white">
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 font-medium text-gray-600">NAME</th>
                <th className="pb-4 font-medium text-gray-600">EMAIL</th>
                <th className="pb-4 font-medium text-gray-600">PHONE</th>
                <th className="pb-4 font-medium text-gray-600">isActive</th>
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
                  <td className="py-4 max-w-xs truncate">{volunteer.isActive}</td>
                  <td className="py-4">
                    <Button
                      size="sm"
                      className="bg-blue-400 hover:bg-blue-500 text-white px-6"
                      onClick={() => handleEdit(volunteer._id)}
                    >
                      Edit
                    </Button>
                    <Button
                        size="sm"
                        className={volunteer.isActive?"bg-red-400 hover:bg-red-500 text-white px-6":"bg-green-400 hover:bg-green-500 text-white px-6"}
                        onClick={() => handleBlock(volunteer._id,volunteer.isActive)}
                      >
                        {volunteer.isActive?'Block':'Unblock'}
                      </Button>
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
          SHOWING {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredVolunteers.length)} OF{" "}
          {filteredVolunteers.length}
        </div>
      </div>
    </div>
  );
}
