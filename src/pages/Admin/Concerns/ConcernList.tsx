import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchAllConcerns } from "../../../reducers/concern/concernReducer";
import Sidebar from "../../../components/admin/Dashboard/sidebar";

export default function AdminConcernListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { allConcerns, loading, error } = useSelector(
    (state: RootState) => state.concern
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const concernsPerPage = 2;

  useEffect(() => {
    dispatch(fetchAllConcerns());
  }, [dispatch]);

  const filteredConcerns = useMemo(() => {
    let filtered = [...allConcerns];

    if (search.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.subject.toLowerCase().includes(search.toLowerCase()) ||
          c.reporterId?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt);
      const dateB = new Date(b.createdAt || b.updatedAt);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    return filtered;
  }, [allConcerns, search, statusFilter, sortOrder]);

  const paginatedConcerns = useMemo(() => {
    const start = (currentPage - 1) * concernsPerPage;
    return filteredConcerns.slice(start, start + concernsPerPage);
  }, [filteredConcerns, currentPage]);

  const totalPages = Math.ceil(filteredConcerns.length / concernsPerPage);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="ml-64 p-8">
        <h2 className="text-2xl font-semibold mb-16 mt-4 underline">
          ALL REPORTED CONCERNS
        </h2>

        <div className="flex flex-wrap gap-14 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject or reporter"
            className="border px-3 py-2 rounded w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Sort by Date: {sortOrder === "asc" ? "Oldest" : "Newest"}
          </button>
        </div>

        {loading && <p>Loading concerns...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <table className="w-full border table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Reporter</th>
              <th className="p-2 border">Reported</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Submitted Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedConcerns.map((c: any) => (
              <tr key={c._id}>
                <td className="p-2 border">{c.subject}</td>
                <td className="p-2 border">{c.reporterId?.name || "N/A"}</td>
                <td className="p-2 border">
                  {c.reportedMemberId?.name || "N/A"}
                </td>
                <td className="p-2 border">{c.status}</td>
                <td className="p-2 border">
                  {new Date(
                    c.createdAt || c.submittedDate
                  ).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => navigate(`/admin/concerns/${c._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
