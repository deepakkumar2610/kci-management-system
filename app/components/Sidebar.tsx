"use client";

import api from "@/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Students", path: "/dashboard/students" },
    { name: "Fees", path: "/dashboard/fees" },
  ];

  const handleLogout = async () => {
    try {
      await api.get("/logout");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <h2>KCI Admin</h2>

        {menu.map((item) => (
          <div key={item.path} style={{ margin: "15px 0" }}>
            <Link href={item.path}>
              <span
                style={{
                  color: path === item.path ? "yellow" : "white",
                  cursor: "pointer",
                }}
              >
                {item.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
      <div>
        <h2 onClick={handleLogout} className="cursor-pointer">
          Logout
        </h2>
      </div>
    </div>
  );
}
