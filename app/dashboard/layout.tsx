import Sidebar from "@/app/components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-screen">
        {/* LEFT SIDE */}
        <div className="w-87.5 bg-[#0b2c5f] text-white">
          <Sidebar />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 p-5 bg-[#ff6f8] overflow-y-auto scroll-smooth">
          <Breadcrumb></Breadcrumb>
          {children}
        </div>
      </div>
    </div>
  );
}
