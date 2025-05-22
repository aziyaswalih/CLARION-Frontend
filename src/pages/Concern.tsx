// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../store/store';
// import { clearStatus, fetchMembers, submitConcern } from '../reducers/concern/ConcernReducer';

// export default function RaiseConcernPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { members, loading, error, success } = useSelector((state: RootState) => state.concern);

//   const [reportedMemberId, setReportedMemberId] = useState('');
//   const [subject, setSubject] = useState('');
//   const [description, setDescription] = useState('');
//   const userId = localStorage.getItem('userId') || ''; // get reporterId

//   useEffect(() => {
//     dispatch(fetchMembers());
//   }, [dispatch]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!reportedMemberId || !subject || !description) return;
//     dispatch(submitConcern({ reporterId: userId, reportedMemberId, subject, description }));
//     setReportedMemberId('');
//     setSubject('');
//     setDescription('');
//     setTimeout(() => dispatch(clearStatus()), 3000);
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4 text-center">Raise a Concern</h2>

//       {success && <p className="text-green-600 mb-3">Concern submitted successfully!</p>}
//       {error && <p className="text-red-600 mb-3">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Reported Member</label>
//           <select
//             className="w-full border px-3 py-2 rounded"
//             value={reportedMemberId}
//             onChange={(e) => setReportedMemberId(e.target.value)}
//           >
//             <option value="">Select a member</option>
//             {members
//               .filter((m:any) => m._id !== userId)
//               .map((member:any) => (
//                 <option key={member._id} value={member._id}>
//                   {member.name} ({member.email})
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Subject</label>
//           <input
//             type="text"
//             className="w-full border px-3 py-2 rounded"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             placeholder="Subject of concern"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             className="w-full border px-3 py-2 rounded"
//             rows={5}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe the issue..."
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
//           disabled={loading}
//         >
//           {loading ? 'Submitting...' : 'Submit Concern'}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { clearStatus, submitConcern } from '../reducers/concern/concernReducer';
import { useParams } from 'react-router-dom';
import Header from '../components/beneficiary/Header/Header';



export default function RaiseConcernPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.concern);
const reportedMemberId = useParams().id; // get reportedMemberId from URL
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const userId = localStorage.getItem('userId') || ''; // reporter ID

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedMemberId || !subject || !description) return;

    dispatch(
      submitConcern({
        reporterId: userId,
        reportedMemberId,
        subject,
        description,
      })
    );

    setSubject('');
    setDescription('');
    setTimeout(() => dispatch(clearStatus()), 3000);
  };

  return (
    <>
    <Header />
    <div className="max-w-xl mx-auto p-6 bg-white mt-40 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Raise a Concern</h2>

      {success && <p className="text-green-600 mb-3">Concern submitted successfully!</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject of concern"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Concern'}
        </button>
      </form>
    </div>
    </>

  );
}
