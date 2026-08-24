"use client";
import apiHandler from "@/lib/api";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function DashboardHome() {
  const [totalReceived, setTotalReceived] = useState(0);
  const [showAmount, setShowAmount] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiHandler.get("/dashboard");

        setTotalReceived(response.data.data.totalReceived);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);
  return (
    <>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total Received</p>

          <button
            type="button"
            onClick={() => setShowAmount((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title={showAmount ? "Hide amount" : "Show amount"}
          >
            {showAmount ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <h2 className="mt-2 text-2xl font-bold text-[#f7931e]">
          {showAmount
            ? `₹${totalReceived.toLocaleString("en-IN")}`
            : "₹ ••••••"}
        </h2>
      </div>
    </>
  );
}
