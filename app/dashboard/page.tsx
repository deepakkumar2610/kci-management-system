"use client";

import apiHandler from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Users,
  Wallet,
  BadgeCheck,
  Clock,
  Percent,
} from "lucide-react";

interface DashboardData {
  totalStudents: number;
  totalFees: number;
  totalReceived: number;
  pendingFees: number;
  collectionPercentage: number;
}

export default function DashboardHome() {
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalStudents: 0,
    totalFees: 0,
    totalReceived: 0,
    pendingFees: 0,
    collectionPercentage: 0,
  });

  const [showAmount, setShowAmount] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiHandler.get("/dashboard");

        setDashboard(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatAmount = (amount: number) =>
    showAmount ? `₹${amount.toLocaleString("en-IN")}` : "₹ ••••••";

  const cards = [
    {
      title: "Total Students",
      value: loading ? "..." : dashboard.totalStudents.toLocaleString("en-IN"),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Fees",
      value: loading ? "..." : formatAmount(dashboard.totalFees),
      icon: Wallet,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Received",
      value: loading ? "..." : formatAmount(dashboard.totalReceived),
      icon: BadgeCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Pending Fees",
      value: loading ? "..." : formatAmount(dashboard.pendingFees),
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Heading */}
      <div>
        <h2 className="text-2xl font-bold text-[#0b2c5f]">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to KriSons Coaching Institute Admin Panel.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {card.value}
                </h3>

                {card.title !== "Total Students" && (
                  <button
                    type="button"
                    onClick={() => setShowAmount((prev) => !prev)}
                    className="text-gray-400 transition hover:text-gray-700"
                    title={showAmount ? "Hide amounts" : "Show amounts"}
                  >
                    {showAmount ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collection Progress */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">
              Fee Collection Progress
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Overall fee collection status
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#0b2c5f]">  
            <span className="text-xl font-bold">
              {loading ? "..." : `${dashboard.collectionPercentage}%`}
            </span>
          </div>
        </div>

        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#f7931e] transition-all duration-500"
            style={{
              width: `${Math.min(
                Math.max(dashboard.collectionPercentage, 0),
                100,
              )}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span className="text-gray-500">
            Received: {loading ? "..." : formatAmount(dashboard.totalReceived)}
          </span>

          <span className="font-medium text-gray-700">
            Total: {loading ? "..." : formatAmount(dashboard.totalFees)}
          </span>
        </div>
      </div>
    </div>
  );
}
