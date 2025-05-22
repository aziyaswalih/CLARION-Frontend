import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { clearStatus, fetchConcernById, updateConcernStatus } from '../../../reducers/concern/concernReducer';
import Header from '../../../components/beneficiary/Header/Header';
import Swal from 'sweetalert2';

export default function AdminConcernDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedConcern, loading, error, success } = useSelector((state: RootState) => state.concern);
  const [status, setStatus] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
    const navigate = useNavigate();
  useEffect(() => {
    if (id) dispatch(fetchConcernById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedConcern) {
      setStatus(selectedConcern.status);
      setResolutionNote(selectedConcern.resolutionNote || '');
    }
  }, [selectedConcern]);

  const handleUpdate = () => {
    if (!id || !status) return;
    dispatch(updateConcernStatus({ id, status, resolutionNote })).unwrap()
    .then(() => {
            Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Concern updated successfully!',
            }).then(() => {
                navigate('/admin/concerns');
            }
            );
        
          
    setTimeout(() => dispatch(clearStatus()), 3000)
       
   
  }).catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to update concern.',
    }); 
  });
};

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <>
    <div className="bg-[#f5f5f5] mb-16">
        <Header />
      </div>
    <div className="p-12 max-w-2xl mx-auto  bg-white shadow rounded">
        
      <h2 className="text-2xl  font-bold mb-4">Concern Details</h2>

      {success && <p className="text-green-600 mb-3">Updated successfully!</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <p><strong>Subject:</strong> {selectedConcern?.subject}</p>
      <p><strong>Description:</strong> {selectedConcern?.description}</p>
      <p><strong>Reporter:</strong> {selectedConcern?.reporterId?.name}</p>
      <p><strong>Reported Member:</strong> {selectedConcern?.reportedMemberId?.name}</p>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Status</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Resolution Note</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={4}
          value={resolutionNote}
          onChange={(e) => setResolutionNote(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Concern'}
      </button>
    </div>
    </>
  );
}
