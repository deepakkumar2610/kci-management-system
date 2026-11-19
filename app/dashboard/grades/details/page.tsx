"use client";

import { useEffect, useState } from "react";
import apiHandler from "@/lib/api";
import {
  Users,
  GraduationCap,
  LibraryBigIcon,
  IndianRupeeIcon,
} from "lucide-react";
import { BeatLoader } from "react-spinners";

interface Grade {
  _id: string;
  name: string;
  board: string;
  type: string;
  status: string;
}

interface Batch {
  _id: string;
  classId: string;
  name: string;
  timing: string;
}

interface Subject {
  _id: string;
  classId: string;
  name: string;
}

interface Fee {
  _id: string;
  classId: string;
  annualFees: number;
  installmentsAllowed: number;
}

interface ClassSummary extends Grade {
  batchCount: number;
  subjectCount: number;
  annualFees: number;
  installments: number;
}

const gradeOrder = [
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th (Commerce)",
  "11th (Science)",
  "12th (Science)",
];

export default function GradesDetailsPage() {
  const [classSummary, setClassSummary] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        const classRes = await apiHandler.get("/classes");

        const classes = classRes.data.data || classRes.data;

        const result = await Promise.all(
          classes.map(async (grade: Grade) => {
            const [batchRes, subjectRes, feeRes] = await Promise.all([
              apiHandler.get(`/batches?classId=${grade._id}`),
              apiHandler.get(`/subjects?classId=${grade._id}`),
              apiHandler.get(`/fees?classId=${grade._id}`),
            ]);

            const batches = batchRes.data.data || batchRes.data;

            const subjects = subjectRes.data.data || subjectRes.data;

            const feeData = feeRes.data.data || feeRes.data;

            const fee = Array.isArray(feeData) ? feeData[0] : feeData;

            const subjectCount = subjects.reduce(
              (total: number, subject: Subject) =>
                total +
                subject.name.split(",").filter((name) => name.trim()).length,
              0,
            );

            return {
              ...grade,
              batchCount: batches.length,
              subjectCount,
              annualFees: fee?.annualFees || 0,
              installments: fee?.installmentsAllowed || 0,
            };
          }),
        );

        result.sort(
          (a, b) => gradeOrder.indexOf(a.name) - gradeOrder.indexOf(b.name),
        );

        if (isMounted) {
          setClassSummary(result);
        }
      } catch (error) {
        console.error("Error fetching class overview:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalClasses = classSummary.length;

  const totalBatches = classSummary.reduce(
    (total, grade) => total + grade.batchCount,
    0,
  );

  const totalSubjects = classSummary.reduce(
    (total, grade) => total + grade.subjectCount,
    0,
  );

  const totalFees = classSummary.filter((grade) => grade.annualFees > 0).length;

  const cards = [
    {
      title: "Total Classes",
      value: totalClasses,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Batches",
      value: totalBatches,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Subjects",
      value: totalSubjects,
      icon: LibraryBigIcon,

      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Fee Configurations",
      value: totalFees,
      icon: IndianRupeeIcon,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-75 text-slate-600">
        <BeatLoader color="#f7931e" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0b2c5f]">Class Overview</h2>

        <p className="text-sm text-slate-600 mt-1">
          Overview of classes, batches, subjects and fees.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mt-4">
                {card.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Class-wise Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-[#0b2c5f]">
            Class-wise Details
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Complete overview of all registered classes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-[#0b2c5f]">
              <tr>
                <th className="px-5 py-4 font-semibold">Sr. No.</th>
                <th className="px-5 py-4 font-semibold">Class</th>
                <th className="px-5 py-4 font-semibold">Board</th>
                <th className="px-5 py-4 font-semibold">Type</th>
                <th className="px-5 py-4 font-semibold">Batches</th>
                <th className="px-5 py-4 font-semibold">Subjects</th>
                <th className="px-5 py-4 font-semibold">Annual Fees</th>
                <th className="px-5 py-4 font-semibold">Installments</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {classSummary.length > 0 ? (
                classSummary.map((grade, index) => (
                  <tr
                    key={grade._id}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-600">{index + 1}</td>

                    <td className="px-5 py-4 font-semibold text-[#0b2c5f]">
                      {grade.name}
                    </td>

                    <td className="px-5 py-4 text-slate-700">{grade.board}</td>

                    <td className="px-5 py-4 text-slate-700">
                      {grade.type === "school" ? "School" : "Junior College"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {grade.batchCount}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {grade.subjectCount}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      ₹{grade.annualFees.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {grade.installments || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          grade.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {grade.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    No class records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
