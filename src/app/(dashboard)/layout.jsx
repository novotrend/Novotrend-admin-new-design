import ProtectedRoute from "@/components/auth/protected/ProtectedRoute";
import DashboardHistoryGuard from "@/components/auth/protected/DashboardHistoryGuard";
import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardHistoryGuard />
      {/* Desktop Sidebar */}
      <Sidebar />
      {/* Main Layout */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 min-w-0">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
