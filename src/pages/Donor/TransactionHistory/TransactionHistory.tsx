// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '../../../store/store';
// import clsx from 'clsx';
// import { fetchUserTransactions } from '../../../reducers/users/transactionReducer';
// // import Header from '../../../components/beneficiary/Header/Header';

// const statusColors: Record<string, string> = {
//   success: 'bg-green-100 text-green-700',
//   failed: 'bg-red-100 text-red-700',
//   pending: 'bg-yellow-100 text-yellow-700',
//   refunded: 'bg-blue-100 text-blue-700',
// };

// const getPurposeColorClass = (purpose: string): string => {
//   switch (purpose?.toLowerCase()) {
//     case 'donating':
//       return 'text-red-600 font-medium';
//     case 'refund':
//       return 'text-green-600 font-medium';
//     case 'transfer':
//       return 'text-blue-600 font-medium';
//     default:
//       return 'text-gray-700 font-medium'; // Default color for unknown purposes
//   }
// }

// const TransactionHistory: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { transactions, isLoading, error } = useSelector((state: RootState) => state.transaction);

//   useEffect(() => {
//     dispatch(fetchUserTransactions());
//   }, [dispatch]);

//   return (
//     <>  
//     <section className="py-10 px-6 max-w-5xl mx-auto mt-8">
//       <h1 className="text-3xl font-bold text-center mb-6 text-[#2c2520] underline">My Transactions</h1>

//       {isLoading ? (
//         <p className="text-center">Loading transactions...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : transactions.length === 0 ? (
//         <p className="text-center text-lg text-[#2c2520]">No transactions found.</p>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow rounded-lg">
//           <table className="min-w-full table-auto text-left">
//             <thead className="bg-[#f9f7f6] border-b">
//               <tr>
//                 <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Date</th>
//                 <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Amount (₹)</th>
//                 <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Mode</th>
//                 <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Purpose</th>
//                 <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions
//                 .slice()
//                 .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//                 .map((txn: any) => (
//                 <tr key={txn._id} className="border-b hover:bg-gray-50">
//                   <td className="px-6 py-4">{new Date(txn.date).toLocaleDateString()}</td>
//                   <td className="px-6 py-4 font-semibold">₹{txn.amount}</td>
//                   <td className="px-6 py-4 capitalize">{txn.mode}</td>
//                 <td className={`px-6 py-4 capitalize ${getPurposeColorClass(txn.purpose)}`}>{txn.purpose}</td>
//                   <td className="px-6 py-4">
//                     <span className={clsx("px-2 py-1 rounded text-sm font-medium", statusColors[txn.status])}>
//                       {txn.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </section>
//     </>
//   );
// };

// export default TransactionHistory;

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import clsx from 'clsx';
import { fetchUserTransactions } from '../../../reducers/users/transactionReducer';

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  refunded: 'bg-blue-100 text-blue-700',
};

const getPurposeColorClass = (purpose: string): string => {
  switch (purpose?.toLowerCase()) {
    case 'donating': return 'text-red-600 font-medium';
    case 'refund': return 'text-green-600 font-medium';
    case 'transfer': return 'text-blue-600 font-medium';
    default: return 'text-gray-700 font-medium';
  }
};

const ITEMS_PER_PAGE = 5;

const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, isLoading, error } = useSelector((state: RootState) => state.transaction);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchUserTransactions());
  }, [dispatch]);

  const filteredSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(txn =>
        txn.purpose.toLowerCase().includes(term) || txn.mode.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(txn => txn.status.toLowerCase() === filterStatus);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

    return filtered;
  }, [transactions, searchTerm, sortBy, sortOrder, filterStatus]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSortedTransactions, currentPage]);

  const totalPages = Math.ceil(filteredSortedTransactions.length / ITEMS_PER_PAGE);

  return (
    <section className="py-10 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#2c2520] underline">My Transactions</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by purpose or mode"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
        {/* <div className="flex gap-2 items-center">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div> */}
        <div className="flex gap-2 items-center">
          <label>Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="border px-2 py-1 rounded"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-blue-600 underline text-sm"
          >
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Loading transactions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredSortedTransactions.length === 0 ? (
        <p className="text-center text-lg text-[#2c2520]">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-[#f9f7f6] border-b">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount (₹)</th>
                <th className="px-6 py-3">Mode</th>
                <th className="px-6 py-3">Purpose</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((txn) => (
                <tr key={txn._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold">₹{txn.amount}</td>
                  <td className="px-6 py-4 capitalize">{txn.mode}</td>
                  <td className={`px-6 py-4 capitalize ${getPurposeColorClass(txn.purpose)}`}>
                    {txn.purpose}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx("px-2 py-1 rounded text-sm font-medium", statusColors[txn.status])}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={clsx(
                'px-3 py-1 border rounded',
                currentPage === i + 1 ? 'bg-blue-600 text-white' : ''
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default TransactionHistory;
