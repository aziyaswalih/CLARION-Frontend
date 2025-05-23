import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../../components/admin/Dashboard/sidebar";
import { StatsCard } from "../../../components/admin/Dashboard/stats_card";
import { EventsChart } from "../../../components/admin/Dashboard/events_charts";
import { TransactionsChart } from "../../../components/admin/Dashboard/transactions_charts";
import { RecentCases } from "../../../components/admin/Dashboard/recent_cases";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchDonationReport } from "../../../reducers/admin/adminReducer";
// import RecentStories from "../RecentStories/RecentStories"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { report } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchDonationReport());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <Button variant="outline" onClick={() => navigate("/admin/logout")}>
            LOGOUT
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Donations Collected"
            amount={`₹${report.totalRaised.toLocaleString()}`}
            color="bg-blue-500"
          />
          <StatsCard
            title="Pending Amount"
            amount={`₹${report.totalRemaining.toLocaleString()}`}
            color="bg-purple-500"
          />
          <StatsCard
            title="Amount Spent"
            amount={`₹${report.totalCompleted.toLocaleString()}`}
            color="bg-emerald-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EventsChart />
          <TransactionsChart />
        </div>

        {/* Recent Cases */}
        <RecentCases />
        {/* <RecentStories /> */}
      </div>
    </div>
  );
}
