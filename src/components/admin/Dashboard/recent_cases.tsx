import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import RecentStories from "../../../pages/Admin/RecentStories/RecentStories"
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { fetchStories } from "../../../reducers/beneficiary/storyReducer";

const cases = [
  {
    id: "001",
    name: "Sarah Reading",
    amount: "$500",
    status: "Completed",
    date: "2024-01-25",
  },
  {
    id: "002",
    name: "David Anderson",
    amount: "$750",
    status: "Pending",
    date: "2024-01-24",
  },
  {
    id: "003",
    name: "Mark Stanley",
    amount: "$1000",
    status: "Processing",
    date: "2024-01-23",
  },
  {
    id: "004",
    name: "Rachel Harrison",
    amount: "$250",
    status: "Completed",
    date: "2024-01-22",
  },
]

export function RecentCases() {

  const dispatch = useDispatch<AppDispatch>();
  //   const navigate = useNavigate();
  
    const { stories, loading, error } = useSelector((state: RootState) => state.stories);
  
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  
    useEffect(() => {
      dispatch(fetchStories());
    }, [dispatch]);

    const approvedStories = stories.filter(
      (story: any) =>
        story.status === "approved" &&
        (story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.requestType.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  


// const filteredStories = stories.filter(
//   (story: any) =>
//     story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     story.requestType.toLowerCase().includes(searchTerm.toLowerCase())
// );


const totalPages = Math.ceil(approvedStories.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentStories = approvedStories.slice(startIndex, startIndex + itemsPerPage);



// const getStatusColorClass = (status: string): string => {
//   switch (status?.toLowerCase()) {
//     case 'rejected':
//       return 'text-red-600 font-medium';
//     case 'completed':
//       return 'text-green-600 font-medium';
//     case 'approved':
//       return 'text-blue-600 font-medium';
//     case 'pending':
//     case 'submitted':
//       return 'text-yellow-600 font-medium';
//     default:
//       return 'text-gray-700 font-medium'; // Keep font-medium for consistency
//   }
// };
  return (
    <div className="bg-white p-6 rounded-lg">
     <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">RECENT CASES</h1>
        </div>
    <div className="overflow-x-auto">
                  <table className="w-full table-auto bg-white rounded shadow">
                    <thead className="bg-[#eee]">
                      <tr className="text-left">
                        <th className="p-4">Title</th>
                        <th className="p-4">Reviewed By</th>
                        <th className="p-4">Request Type</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Goal</th>
                        <th className="p-4">Raised</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStories.map((story: any) => (
                        <tr key={story._id} className="border-b hover:bg-gray-100">
                          <td className="p-4">{story.title}</td>
                          <td className="p-4">{story.reviewedBy?.name}</td>
                          {/* Assuming reviewedBy is a string, if it's an object, adjust accordingly */}
                          <td className="p-4 capitalize">{story.requestType}</td>
                          <td className="p-4 text-green-600 font-semibold capitalize">{story.status}</td>
                            
                            {/* <td className="p-4">{story.status}</td> */}
                          <td className="p-4">₹{story.amount?.toLocaleString()}</td>
                          <td className="p-4">₹{story.raisedAmount?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
    
                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
          </div>
  )
}

