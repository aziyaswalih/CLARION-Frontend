import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Sidebar from "../../../components/admin/Dashboard/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Beneficiary {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  avatar?: string;
}

export function BeneficiariesList() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

    const navigate = useNavigate(); // Initialize the useNavigate hook
    useEffect(() => {

    const fetchBeneficiaries = async () => {
      try {
        const response =  await axios.get<{ success:boolean,token: string; message: string;beneficiaries:any }>(
            "http://localhost:5000/api/admin/beneficiaries"
          );
        if (!response.data.beneficiaries) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        
        // const data = await response.json();
        setBeneficiaries(response.data.beneficiaries);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
      }
    };

    
      

    fetchBeneficiaries();
  }, []);



  const handleEdit = async (id: string) => {
    navigate(`/admin/beneficiaries/edit/${id}`); // Navigate to the edit page
    }
const handleAdd = async () => {
    navigate(`/admin/beneficiaries/add`); // Navigate to the add page
    }

const handleBlock = async (id: string,isActive:boolean) => {
try {if(isActive){
    const response = await axios.put(
    `http://localhost:5000/api/admin/beneficiaries/block/${id}`
  );

  if (response.data.success) {
    // Update the beneficiaries list to reflect the blocked status
    setBeneficiaries((prev) =>
      prev.map((beneficiary) =>
        beneficiary._id === id ? { ...beneficiary, isActive: false } : beneficiary
      )
    );
    console.log("Beneficiary blocked successfully");
  } else {
    console.error("Failed to block beneficiary:", response.data.message);
  }
}else if(!isActive){
    const response = await axios.put(
    `http://localhost:5000/api/admin/beneficiaries/unblock/${id}`
  );

  if (response.data.success) {
    // Update the beneficiaries list to reflect the blocked status
    setBeneficiaries((prev) =>
      prev.map((beneficiary) =>
        beneficiary._id === id ? { ...beneficiary, isActive: true } : beneficiary
      )
    );
    console.log("Beneficiary unblocked successfully");
  } else {
    console.error("Failed to unblock beneficiary:", response.data.message);
  }
}

} catch (error) {
  console.error("Error blocking/unblocking beneficiary:", error);
}
};


  const filteredBeneficiaries = beneficiaries.filter(
    (beneficiary) =>
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBeneficiaries = filteredBeneficiaries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">BENEFICIARIES</h1>
          <Button className="bg-green-400 hover:bg-green-500 text-white"
          onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            ADD
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
                <th className="pb-4 font-medium text-gray-600">STATUS</th>
                <th className="pb-4 font-medium text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary._id} className="border-t">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <img
                          src={beneficiary.avatar || "/images/hero-background.jpg"}
                          alt={beneficiary.name}
                          className="w-8 h-8 rounded-full"
                        />
                      </Avatar>
                      <span>{beneficiary.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{beneficiary.email}</td>
                  <td className="py-4">{beneficiary.phone}</td>
                  <td className="py-4 max-w-xs truncate">{beneficiary.isActive?'Active':'Blocked'}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {/* <Button size="sm" className="bg-green-400 hover:bg-green-500 text-white px-6">
                        View
                      </Button> */}
                      {/* <Button size="sm" className="bg-blue-400 hover:bg-blue-500 text-white px-6"> */}
                      <Button
                        size="sm"
                        className="bg-blue-400 hover:bg-blue-500 text-white px-6"
                        onClick={() => handleEdit(beneficiary._id)}
                      >
                        Edit
                      </Button>
                      {/* <Button size="sm" className="bg-red-400 hover:bg-red-500 text-white px-6"> */}
                      <Button
                        size="sm"
                        className={beneficiary.isActive?"bg-red-400 hover:bg-red-500 text-white px-6":"bg-green-400 hover:bg-green-500 text-white px-6"}
                        onClick={() => handleBlock(beneficiary._id,beneficiary.isActive)}
                      >
                        {beneficiary.isActive?'Block':'Unblock'}
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
          SHOWING {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBeneficiaries.length)} OF{" "}
          {filteredBeneficiaries.length}
        </div>
      </div>
    </div>
  );
}
