"use client";

import Image from "next/image";
import brandLogo from "@/public/assets/images/kci-institute-brand-logo.png";

import { MdDashboard } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { MdPayment } from "react-icons/md";
import { MdLogout } from "react-icons/md";

import api from "@/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
    {
      name: "Students",
      icon: PiStudentFill,
      path: "/dashboard/students",
    },
    { name: "Fees", icon: MdPayment, path: "/dashboard/fees" },
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
    <div className="h-screen flex flex-col">
      {/* TOP LOGO */}
      <div className="bg-orange-100 p-5">
        <Image src={brandLogo} alt="kci-branding-logo" height={80} />
      </div>

      {/* SIDEBAR CONTENT */}
      <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
        {/* MENU */}
        <div>
          <h2 className="text-white text-sm mb-4">KCI Admin Panel</h2>

          {menu.map(({ path, icon: Icon, name }) => (
            <div key={path} className="my-3">
              <Link href={path} className="flex items-center">
                <Icon
                  size={30}
                  className={`${
                    path === pathname ? "text-[#ffa200]" : "text-white"
                  }`}
                />

                <span
                  className={`ms-5 text-lg ${
                    path === pathname ? "text-[#ffa200]" : "text-white"
                  }`}
                >
                  {name}
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* LOGOUT (BOTTOM) */}
        <div className="text-center border-t pt-5">
          <h2
            onClick={handleLogout}
            className="cursor-pointer flex items-center justify-center text-white hover:text-red-400 transition"
          >
            <MdLogout size={30} />
            <span className="ms-2">Logout</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
