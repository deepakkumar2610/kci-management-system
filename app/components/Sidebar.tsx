"use client";

import Image from "next/image";
import brandLogoWithName from "@/public/assets/images/kci-institute-brand-logo.png";
import brandLogo from "@/public/assets/images/logo.png";

import { MdDashboard } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { MdAssignmentAdd } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import { MdAddCard } from "react-icons/md";
import { TbReceiptRupeeFilled } from "react-icons/tb";

import apiHandler from "@/lib/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    {
      title: "KCI Admin Dashboard",
      subMenu: [
        {
          name: "Dashboard",
          icon: MdDashboard,
          path: "/dashboard",
        },
      ],
    },
    {
      title: "Manage Class",
      subMenu: [
        {
          name: "Add Classes / Grades",
          icon: MdAssignmentAdd,
          path: "/dashboard/grades/add",
        },
        {
          name: "Classes Details",
          icon: BiDetail,
          path: "/dashboard/grades/details",
        },
      ],
    },
    {
      title: "Manage Students",
      subMenu: [
        {
          name: "Add Student",
          icon: MdGroupAdd,
          path: "/dashboard/students/add",
        },
        {
          name: "Student Details",
          icon: FaAddressCard,
          path: "/dashboard/students/details",
        },
      ],
    },
    {
      title: "Manage Fees",
      subMenu: [
        {
          name: "Add Fees",
          icon: MdAddCard,
          path: "/dashboard/fees/add",
        },
        {
          name: "Student Fees Details",
          icon: TbReceiptRupeeFilled,
          path: "/dashboard/fees/details",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await apiHandler.get("/logout");

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`h-screen flex flex-col bg-[#0b2c5f] text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-87.5"
      }`}
    >
      {/* TOP LOGO */}
      <div className="bg-orange-100 py-2 flex w-full justify-center-safe">
        <Image
          src={collapsed ? brandLogo : brandLogoWithName}
          alt="kci-branding-logo"
          height={80}
          className={`transition-all duration-300 ${collapsed ? "w-12" : ""}`}
        />
      </div>

      {/* SIDEBAR CONTENT */}
      <div className="flex-1 flex flex-col justify-between overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* MENU */}
        <div className="mt-5">
          {menu.map(({ title, subMenu }) => (
            <div key={title} className="mb-5">
              {/* SECTION TITLE */}
              {!collapsed && (
                <h3 className="text-gray-400 px-4 mb-3">{title}</h3>
              )}

              {subMenu &&
                subMenu.map(({ name, icon: Icon, path }) => (
                  <div
                    key={path}
                    className={`mt-1 py-2 rounded-e-full
                      hover:bg-gray-500
                      ${collapsed ? "mx-2 rounded-full" : "ps-5 me-5"}
                      ${
                        path === pathname
                          ? "bg-orange-100 hover:bg-orange-100"
                          : ""
                      }`}
                  >
                    <Link
                      href={path}
                      className={`flex items-center ${
                        collapsed ? "justify-center" : ""
                      }`}
                    >
                      <Icon
                        size={collapsed ? 22 : 28}
                        className={`${
                          path === pathname ? "text-[#ffa200]" : "text-white"
                        }`}
                      />

                      {/* MENU TEXT */}
                      {!collapsed && (
                        <span
                          className={`ms-5 text-lg ${
                            path === pathname
                              ? "text-[#ffa200] font-bold"
                              : "text-gray-200"
                          }`}
                        >
                          {name}
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="border-t border-white/20 text-center ">
          {!collapsed && (
            <div className="flex items-center justify-between  mx-5 py-4">
              <button
                onClick={handleLogout}
                className={`cursor-pointer flex items-center
                text-white hover:text-red-400 transition
                `}
              >
                <MdLogout size={25} />

                {!collapsed && <span className="ms-2">Logout</span>}
              </button>

              <button
                onClick={() => setCollapsed(!collapsed)}
                className="cursor-pointer"
              >
                {collapsed ? (
                  <PanelLeftOpen size={25} />
                ) : (
                  <PanelLeftClose size={25} />
                )}
              </button>
            </div>
          )}

          {/* COLLAPSE BUTTON */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="cursor-pointer py-4"
            >
              {collapsed ? (
                <PanelLeftOpen size={25} />
              ) : (
                <PanelLeftClose size={25} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
