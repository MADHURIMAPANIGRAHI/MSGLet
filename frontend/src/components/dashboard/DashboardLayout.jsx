import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";
import { NoiseTexture } from "./NoiseTexture.jsx";

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NoiseTexture />

      {/* Fixed Navbar */}
      <DashboardNavbar />

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};