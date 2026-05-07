"use client";

import Image from "next/image";
import brandLogo from "@/public/assets/images/kci-institute-brand-logo.png";

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
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // const menu = [
  //   { title: "", name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  //   {
  //     name: "Students",
  //     icon: PiStudentFill,
  //     path: "/dashboard/students",
  //   },
  //   { name: "Fees", icon: MdPayment, path: "/dashboard/fees" },
  // ];

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

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* TOP LOGO */}
      <div className="bg-orange-100 py-2 flex w-full justify-center-safe">
        <Image src={brandLogo} alt="kci-branding-logo" height={80} />
      </div>

      {/* SIDEBAR CONTENT */}
      <div className="flex-1 flex flex-col justify-between overflow-auto">
        {/* MENU */}
        <div className="mt-5">
          {menu.map(({ title, subMenu }) => (
            <div key={title} className="mb-5">
              <h3 className="text-gray-400 px-4 mb-3">{title}</h3>

              {subMenu &&
                subMenu.map(({ name, icon: Icon, path }) => (
                  <div
                    key={path}
                    // className="my-3 bg-amber-200 ps-5 py-2 me-5 rounded-e-full"
                    className={`mt-1 ps-5 py-2 me-5 rounded-e-full hover:bg-gray-500 ${
                      path === pathname
                        ? "bg-orange-100 hover:bg-orange-100"
                        : ""
                    }`}
                  >
                    <Link href={path} className="flex items-center">
                      <Icon
                        size={30}
                        className={`${
                          path === pathname ? "text-[#ffa200]" : "text-white"
                        }`}
                      />

                      <span
                        className={`ms-5 text-lg ${
                          path === pathname
                            ? "text-[#ffa200] font-bold"
                            : "text-gray-200"
                        }`}
                      >
                        {name}
                      </span>
                    </Link>
                  </div>
                ))}
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
