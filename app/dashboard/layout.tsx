import Sidebar from "@/app/components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      {/* LEFT SIDE */}
      <div className="w-87.5 bg-[#0b2c5f] text-white">
        <Sidebar />
      </div>
      {/* RIGHT SIDE */}
      <div className=" flex-1 p-5 bg-[#ff6f8] flex flex-col">
        <div className="sticky top-0 z-50 bg-white">
          <Breadcrumb></Breadcrumb>
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
