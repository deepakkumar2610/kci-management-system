import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT SIDE */}
      <div style={{ width: "250px", background: "#111", color: "#fff" }}>
        <Sidebar />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
        {children}
      </div>
    </div>
  );
}
