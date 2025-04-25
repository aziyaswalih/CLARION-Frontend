// // components/StoryHistory.tsx
// import React, { useEffect } from 'react';
// // import { useAppDispatch, useAppSelector } from '../hooks';
// import { fetchStories } from '../../../reducers/beneficiary/storyReducer';
// // import moment from 'moment';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../../store/store';
// import Header from '../../../components/beneficiary/Header/Header';

// const StoryHistory: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { stories, loading, error } = useSelector((state : RootState) => state.stories);

//   useEffect(() => {
//     dispatch(fetchStories());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen flex flex-col bg-[#f4f9ff]">
//         <Header />
//         <section className="flex items-center bg-[#e9f5ff]">
//       <h2 className="text-2xl font-semibold mb-4">My Submitted Stories</h2>

//       {loading && <p>Loading stories...</p>}
//       {error && <p className="text-red-600">Error: {error}</p>}

//       {!loading && stories.length === 0 && <p>No stories found.</p>}

//       {!loading && stories.length > 0 && (
//         <div className="overflow-x-auto shadow border rounded-md">
//           <table className="min-w-full table-auto border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 border">Title</th>
//                 <th className="px-4 py-2 border">Request Type</th>
//                 <th className="px-4 py-2 border">Status</th>
//                 <th className="px-4 py-2 border">Submitted At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stories.map((story) => (
//                 <tr key={story._id} className="text-center">
//                   <td className="px-4 py-2 border">{story.title}</td>
//                   <td className="px-4 py-2 border">{story.requestType}</td>
//                   <td className="px-4 py-2 border capitalize">{story.status}</td>
//                   <td className="px-4 py-2 border">{new Date(story.submittedAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
      
//     </section>
//     </div>
//   );
// };

// export default StoryHistory;


// components/StoryHistory.tsx
import React, { useEffect } from 'react';
import { fetchStories } from '../../../reducers/beneficiary/storyReducer';
import { useDispatch, useSelector} from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import Header from '../../../components/beneficiary/Header/Header';
import { useNavigate } from 'react-router-dom';

const StoryHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading, error } = useSelector((state: RootState) => state.stories);
const user = useSelector((state: RootState) => state.users.user);
  const id = user?.id;
  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f9ff]">
      {/* Header stays at the top */}
      <Header />

      {/* Centered section content */}
      <section className="flex-grow flex flex-col mt-24 items-center px-10 py-12 bg-[#e9f5ff]">
        <h2 className="text-2xl font-semibold mb-6 underline">My Submitted Stories</h2>

        {loading && <p>Loading stories...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && stories.length === 0 && <p>No stories found.</p>}

        {!loading && stories.length > 0 && (
          <div className="overflow-x-auto shadow border rounded-md bg-white w-full max-w-4xl">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Request Type</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {stories.filter((s) => s.beneficiary._id === id).map((story) => (
                  <tr key={story._id} className="text-center">
                    <td className="px-4 py-2 border">{story.title}</td>
                    <td className="px-4 py-2 border">{story.requestType}</td>
                    <td className="px-4 py-2 border capitalize">{story.status}</td>
                    <td className="px-4 py-2 border">
                      {new Date(story.submittedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button  onClick={()=>navigate(-1)}className="mt-10 px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
        ← Back
        </button>

      </section>
    </div>
  );
};

export default StoryHistory;
