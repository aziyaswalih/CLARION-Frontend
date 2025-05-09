import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchStories } from '../../../reducers/beneficiary/storyReducer';
import Header from '../../../components/beneficiary/Header/Header';
// import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

interface Story {
  _id: string;
  title: string;
  requestType: string;
  status: string;
  reason?: string;
  submittedAt: string;
  description?: string;
  documents?: string[];
  images?: string[];
  beneficiary: {
    _id: string;
  };
}

const StoryHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading, error } = useSelector((state: RootState) => state.stories as { stories: Story[], loading: boolean, error: string | null });
  const user = useSelector((state: RootState) => state.users.user);
  const id = user?.id;
  // const navigate = useNavigate();

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'title' | 'submittedAt'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;



  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const handleView = (story: Story) => {
    setSelectedStory(story);
    setDialogOpen(true);
  };

  const getStatusColorClass = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'rejected': return 'text-red-600 font-medium';
      case 'completed': return 'text-green-600 font-medium';
      case 'approved': return 'text-blue-600 font-medium';
      case 'pending':
      case 'submitted': return 'text-yellow-600 font-medium';
      default: return 'text-gray-700 font-medium';
    }
  };

  const filteredStories = useMemo(() => {
    return stories
      .filter(s => s.beneficiary._id === id)
      .filter(s =>
        (filterStatus === 'all' || s.status.toLowerCase() === filterStatus.toLowerCase()) &&
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [stories, id, searchTerm, filterStatus]);

  const sortedStories = useMemo(() => {
    return [...filteredStories].sort((a, b) => {
      const aValue = a[sortKey].toLowerCase?.() || a[sortKey];
      const bValue = b[sortKey].toLowerCase?.() || b[sortKey];
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }, [filteredStories, sortKey, sortOrder]);

  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStories.slice(start, start + itemsPerPage);
  }, [sortedStories, currentPage]);

  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f4f9ff] flex flex-col">
      <Header />
      <section className="flex-grow px-6 py-12 bg-[#e9f5ff]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 underline text-gray-800">My Submitted Stories</h2>

          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-md w-full sm:w-64"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as 'title' | 'submittedAt')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="submittedAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {loading && <p className="text-center text-blue-600 text-lg">Loading stories...</p>}
          {error && <p className="text-center text-red-600 text-lg">Error: {error}</p>}
          {!loading && !error && filteredStories.length === 0 && (
            <p className="text-center text-gray-600">No stories match your criteria.</p>
          )}

          {!loading && filteredStories.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-xl shadow border">
              <table className="min-w-full table-auto text-sm text-center">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-3 border">Title</th>
                    <th className="px-4 py-3 border">Request Type</th>
                    <th className="px-4 py-3 border">Status</th>
                    <th className="px-4 py-3 border">Submitted At</th>
                    <th className="px-4 py-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStories.map((story) => (
                    <tr key={story._id} className="hover:bg-blue-50">
                      <td className="px-4 py-2 border font-medium">{story.title}</td>
                      <td className="px-4 py-2 border capitalize">{story.requestType}</td>
                      <td className="px-4 py-2 border capitalize">
                        <span className={getStatusColorClass(story.status)}>
                          {story.status === 'rejected' && story.reason ? `${story.status} (${story.reason})` : story.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(story.submittedAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-2 border">
                        <Button variant="link" onClick={() => handleView(story)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
            <div className="inline-flex items-center gap-1 bg-white rounded-lg shadow px-4 py-2">
          
              {/* Prev Button */}
              <Button
                variant="ghost"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                ← Prev
              </Button>
          
              {/* First Page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant={currentPage === 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1"
                  >
                    1
                  </Button>
                  <span className="px-2 text-gray-400">...</span>
                </>
              )}
          
              {/* Dynamic Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (page) =>
                    page === currentPage ||
                    page === currentPage - 1 ||
                    page === currentPage + 1 ||
                    (currentPage === 1 && page <= 3) ||
                    (currentPage === totalPages && page >= totalPages - 2)
                )
                .map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className="px-3 py-1"
                  >
                    {page}
                  </Button>
                ))}
          
              {/* Last Page */}
              {currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <Button
                    variant={currentPage === totalPages ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
          
              {/* Next Button */}
              <Button
                variant="ghost"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                Next →
              </Button>
            </div>
          </div>
          
          
            // <div className="flex justify-center mt-6 gap-2">
            //   {[...Array(totalPages)].map((_, index) => (
            //     <Button
            //       key={index + 1}
            //       variant={currentPage === index + 1 ? 'default' : 'outline'}
            //       onClick={() => setCurrentPage(index + 1)}
            //     >
            //       {index + 1}
            //     </Button>
            //   ))}
            // </div>
          )}

          {/* <div className="flex justify-center mt-10">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div> */}
        </div>
      </section>

      {selectedStory && (
        // <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        //   <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl p-6">
        //     <DialogHeader>
        //       <DialogTitle className='underline font-serif text-2xl text-center mb-4'>{selectedStory.title}</DialogTitle>
        //       <DialogDescription className="space-y-3 text-sm">
        //         <p className="text-left">
        //           <strong>Request Type:</strong>{' '}
        //           <span className="capitalize">{selectedStory.requestType}</span>
        //         </p>
        //         <p className="text-left">
        //           <strong>Status:</strong>{' '}
        //           <span className={`${getStatusColorClass(selectedStory.status)} capitalize`}>
        //             {selectedStory.status}
        //             {selectedStory.status === 'rejected' && selectedStory.reason ? ` (${selectedStory.reason})` : ''}
        //           </span>
        //         </p>
        //         <p className="text-left">
        //           <strong>Submitted At:</strong>{' '}
        //           {new Date(selectedStory.submittedAt).toLocaleDateString('en-IN', {
        //             year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        //           })}
        //         </p>
        //         <div className="text-left pt-2">
        //           <strong>Description:</strong>
        //           <p className="mt-1 whitespace-pre-wrap text-gray-700 bg-gray-50 p-3 rounded border">
        //             {selectedStory.description || <span className="italic text-gray-500">No description provided.</span>}
        //           </p>
        //         </div>
        //       </DialogDescription>
        //     </DialogHeader>
        //   </DialogContent>
        // </Dialog>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl p-6">
    <DialogHeader>
      <DialogTitle className="underline font-serif text-2xl text-center mb-4">
        {selectedStory.title}
      </DialogTitle>
      <DialogDescription className="space-y-3 text-sm">
        {/* Request Type */}
        <p className="text-left">
          <strong>Request Type:</strong>{' '}
          <span className="capitalize">{selectedStory.requestType}</span>
        </p>

        {/* Status */}
        <p className="text-left">
          <strong>Status:</strong>{' '}
          <span className={`${getStatusColorClass(selectedStory.status)} capitalize`}>
            {selectedStory.status}
            {selectedStory.status === 'rejected' && selectedStory.reason
              ? ` (${selectedStory.reason})`
              : ''}
          </span>
        </p>

        {/* Submitted At */}
        <p className="text-left">
          <strong>Submitted At:</strong>{' '}
          {new Date(selectedStory.submittedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>

        {/* Description */}
        <div className="text-left pt-2">
          <strong>Description:</strong>
          <p className="mt-1 whitespace-pre-wrap text-gray-700 bg-gray-50 p-3 rounded border">
            {selectedStory.description || (
              <span className="italic text-gray-500">No description provided.</span>
            )}
          </p>
        </div>

        {/* Documents */}
        {selectedStory.documents && selectedStory.documents.filter(img => img.trim() !== "").length > 0 && (
          <div className="text-left pt-2">
            <strong>Documents:</strong>
            <ul className="list-disc pl-6 mt-2 text-blue-600">
              {selectedStory.documents.map((doc, index) => (
                <li key={index}>
                  <a href={`${import.meta.env.VITE_SOCKET_URL}/uploads/${doc}`} target="_blank" rel="noopener noreferrer" className="underline">
                    Document {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Images */}
        {selectedStory.images && selectedStory.images.filter(img => img.trim() !== "").length > 0 && (
          <div className="text-left pt-2">
            <strong>Images:</strong>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {selectedStory.images.map((image, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_SOCKET_URL}/uploads/${image}`}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto rounded-md"
                />
              ))}
            </div>
          </div>
        )}
  

      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

      )}
    </div>
  );
};

export default StoryHistory;