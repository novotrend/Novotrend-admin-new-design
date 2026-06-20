import AnalyticsChart from "@/components/layout/dashboard-layout/AnalyticsChart";
import DashboardCards from "@/components/layout/dashboard-layout/DashboardCards";
import SupportTicketTable from "@/components/layout/dashboard-layout/SupportTicketTable";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardCards />
      <AnalyticsChart />
      <SupportTicketTable />
    </div>
  );
}
