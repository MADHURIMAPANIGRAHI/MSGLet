// src/app/user/layout.js
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { NoiseTexture } from "@/components/dashboard/NoiseTexture";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NoiseTexture />

      {/* Navbar */}
      <DashboardNavbar />

      <div className="flex pt-16">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}