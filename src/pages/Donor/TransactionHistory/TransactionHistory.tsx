import React, { useEffect } from 'react';
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

const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, isLoading, error } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(fetchUserTransactions());
  }, [dispatch]);

  return (
    <section className="py-10 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#2c2520]">My Transactions</h1>

      {isLoading ? (
        <p className="text-center">Loading transactions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-lg text-[#2c2520]">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-[#f9f7f6] border-b">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Date</th>
                <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Amount (₹)</th>
                <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Mode</th>
                <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Purpose</th>
                <th className="px-6 py-3 text-sm font-medium text-[#2c2520]">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((txn: any) => (
                <tr key={txn._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold">₹{txn.amount}</td>
                  <td className="px-6 py-4 capitalize">{txn.mode}</td>
                  <td className="px-6 py-4">{txn.purpose}</td>
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
    </section>
  );
};

export default TransactionHistory;

