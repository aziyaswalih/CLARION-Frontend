import Sidebar  from "../../../components/admin/Dashboard/sidebar"
import { StatsCard } from "../../../components/admin/Dashboard/stats_card"
import { EventsChart } from "../../../components/admin/Dashboard/events_charts"
import { TransactionsChart } from "../../../components/admin/Dashboard/transactions_charts"
import { RecentCases } from "../../../components/admin/Dashboard/recent_cases"
import { Button } from "../../../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function DashboardPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <Button variant="outline" onClick={() => navigate('/admin/login')}>LOGOUT</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Donations Collected" amount="₹52,000" color="bg-blue-500" />
          <StatsCard title="Pending Amount" amount="₹70,000" color="bg-purple-500" />
          <StatsCard title="Amount Spent" amount="₹53,000" color="bg-emerald-500" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EventsChart />
          <TransactionsChart />
        </div>

        {/* Recent Cases */}
        <RecentCases />

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-lg ${
                page === 1 ? "bg-[#b8860b] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

