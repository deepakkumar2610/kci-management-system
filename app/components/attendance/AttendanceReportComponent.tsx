"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import apiHandler from "@/lib/api";
import SelectField from "../SelectField";
import * as XLSX from "xlsx";

interface ClassOption {
  _id: string;
  gradeName: string;
  type: "school" | "junior-college" | "entrance";
}

interface BatchOption {
  _id: string;
  name: string;
}

interface AttendanceReportRow {
  date?: string;
  studentId?: string;
  studentName?: string;
  className?: string;
  batchName?: string;
  status?: string | null;
  present: number;
  absent: number;
  leave: number;
  totalMarked: number;
  attendancePercentage: number;
}

interface ReportResponse {
  success: boolean;
  message?: string;
  report: AttendanceReportRow[];
}

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function AttendanceReportComponent() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [report, setReport] = useState<AttendanceReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      classId: "",
      batchId: "",
      from: getLocalDate(),
      to: getLocalDate(),
      reportType: "daily",
    },

    onSubmit: async (values) => {
      if (!values.classId || !values.batchId || !values.from || !values.to) {
        setError("Please select class, batch and date range.");
        return;
      }

      if (values.from > values.to) {
        setError("The From date cannot be after the To date.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSearched(false);
        setReport([]);

        const params = new URLSearchParams({
          classId: values.classId,
          batchId: values.batchId,
          from: values.from,
          to: values.to,
          reportType: values.reportType,
        });

        const response = await apiHandler.get<ReportResponse>(
          `/attendance/report?${params.toString()}`,
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Unable to generate report.",
          );
        }

        setReport(response.data.report || []);
        setSearched(true);
      } catch (err: unknown) {
        console.error("Attendance report error:", err);

        const message =
          err instanceof Error
            ? err.message
            : "Failed to generate attendance report.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
  });

  // Load classes.
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingOptions(true);

        const response = await apiHandler.get("/classes");
        setClasses(response.data.data || []);
      } catch (err) {
        console.error("Failed to load classes:", err);
        setError("Unable to load classes.");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadClasses();
  }, []);

  // Load batches for the selected class.
  useEffect(() => {
    const loadBatches = async () => {
      setBatches([]);
      setReport([]);
      setSearched(false);
      formik.setFieldValue("batchId", "");

      if (!formik.values.classId) return;

      try {
        const response = await apiHandler.get(
          `/batches?classId=${formik.values.classId}`,
        );

        setBatches(response.data.data || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
        setError("Unable to load batches.");
      }
    };

    loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.classId]);

  const isStudentWise = formik.values.reportType === "student-wise";

  const totals = report.reduce(
    (acc, row) => ({
      present: acc.present + row.present,
      absent: acc.absent + row.absent,
      leave: acc.leave + row.leave,
      totalMarked: acc.totalMarked + row.totalMarked,
    }),
    { present: 0, absent: 0, leave: 0, totalMarked: 0 },
  );

  const overallPercentage =
    totals.present + totals.absent > 0
      ? Number(
          ((totals.present / (totals.present + totals.absent)) * 100).toFixed(
            2,
          ),
        )
      : 0;

  const exportToExcel = () => {
    if (report.length === 0) return;

    const exportData = report.map((row, index) =>
      isStudentWise
        ? {
            "Sr. No.": index + 1,
            "Student Name": row.studentName || "",
            Present: row.present,
            Absent: row.absent,
            Leave: row.leave,
            "Total Marked": row.totalMarked,
            "Attendance (%)": row.attendancePercentage,
          }
        : {
            "Sr. No.": index + 1,
            Date: row.date || "",
            Present: row.present,
            Absent: row.absent,
            Leave: row.leave,
            "Total Marked": row.totalMarked,
            "Attendance (%)": row.attendancePercentage,
          },
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = isStudentWise
      ? [
          { wch: 10 },
          { wch: 30 },
          { wch: 12 },
          { wch: 12 },
          { wch: 12 },
          { wch: 16 },
          { wch: 18 },
        ]
      : [
          { wch: 10 },
          { wch: 16 },
          { wch: 12 },
          { wch: 12 },
          { wch: 12 },
          { wch: 16 },
          { wch: 18 },
        ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isStudentWise ? "Student Report" : "Daily Report",
    );

    const filename = `KCI_Attendance_${formik.values.reportType}_${formik.values.from}_to_${formik.values.to}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-[#0b2c5f]">
            Attendance Report
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and export student attendance records.
          </p>
        </div>
      </div>

      {/* Filters */}
      <form
        onSubmit={formik.handleSubmit}
        className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5 print:hidden"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Report Type
            </label>

            <select
              name="reportType"
              value={formik.values.reportType}
              onChange={(event) => {
                formik.handleChange(event);
                setReport([]);
                setSearched(false);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-[#f7931e]"
            >
              <option value="daily">Daily Report</option>
              <option value="student-wise">Student-wise Report</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Class / Grade
            </label>

            <SelectField formik={formik} name="classId" options={classes} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Batch
            </label>

            <SelectField formik={formik} name="batchId" options={batches} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              From Date
            </label>

            <input
              type="date"
              name="from"
              value={formik.values.from}
              max={formik.values.to}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#f7931e]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              To Date
            </label>

            <input
              type="date"
              name="to"
              value={formik.values.to}
              min={formik.values.from}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#f7931e]"
              required
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading || loadingOptions}
            className="rounded-lg bg-[#f7931e] px-5 py-2 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>

          <button
            type="button"
            onClick={() => {
              formik.resetForm({
                values: {
                  classId: "",
                  batchId: "",
                  from: getLocalDate(),
                  to: getLocalDate(),
                  reportType: "daily",
                },
              });
              setReport([]);
              setError("");
              setSearched(false);
            }}
            className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Printable report content */}
      <div id="attendance-report-print" className="space-y-5">
        {searched && (
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0b2c5f]">
                  {isStudentWise
                    ? "Student-wise Attendance"
                    : "Daily Attendance"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {formik.values.from} to {formik.values.to}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 print:hidden">
                <button
                  type="button"
                  onClick={exportToExcel}
                  disabled={report.length === 0}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Export Excel
                </button>

                <button
                  type="button"
                  onClick={printReport}
                  disabled={report.length === 0}
                  className="rounded-lg bg-[#0b2c5f] px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 disabled:opacity-50"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <SummaryCard
                label="Present"
                value={totals.present}
                color="text-green-700"
                background="bg-green-50"
              />

              <SummaryCard
                label="Absent"
                value={totals.absent}
                color="text-red-700"
                background="bg-red-50"
              />

              <SummaryCard
                label="Leave"
                value={totals.leave}
                color="text-amber-700"
                background="bg-amber-50"
              />

              <SummaryCard
                label="Attendance"
                value={`${overallPercentage}%`}
                color="text-[#0b2c5f]"
                background="bg-blue-50"
              />
            </div>

            {/* Results table */}
            <div className="mt-6 overflow-x-auto">
              {report.length === 0 ? (
                <p className="py-10 text-center text-gray-500">
                  No saved attendance sessions found for the selected filters.
                </p>
              ) : (
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-100 text-gray-700">
                      <th className="px-3 py-3">Sr. No.</th>

                      <th className="px-3 py-3">
                        {isStudentWise ? "Student Name" : "Date"}
                      </th>

                      <th className="px-3 py-3 text-center">Present</th>
                      <th className="px-3 py-3 text-center">Absent</th>
                      <th className="px-3 py-3 text-center">Leave</th>
                      <th className="px-3 py-3 text-center">Total Marked</th>
                      <th className="px-3 py-3 text-center">Attendance %</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.map((row, index) => (
                      <tr
                        key={
                          isStudentWise
                            ? row.studentId || index
                            : `${row.date}-${index}`
                        }
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-3">{index + 1}</td>

                        <td className="px-3 py-3 font-medium text-gray-800">
                          {isStudentWise ? row.studentName : row.date}
                        </td>

                        <td className="px-3 py-3 text-center font-medium text-green-700">
                          {row.present}
                        </td>

                        <td className="px-3 py-3 text-center font-medium text-red-700">
                          {row.absent}
                        </td>

                        <td className="px-3 py-3 text-center font-medium text-amber-700">
                          {row.leave}
                        </td>

                        <td className="px-3 py-3 text-center">
                          {row.totalMarked}
                        </td>

                        <td className="px-3 py-3 text-center font-semibold text-[#0b2c5f]">
                          {row.attendancePercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {report.length > 1 && (
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan={2} className="px-3 py-3">
                          Total
                        </td>
                        <td className="px-3 py-3 text-center text-green-700">
                          {totals.present}
                        </td>
                        <td className="px-3 py-3 text-center text-red-700">
                          {totals.absent}
                        </td>
                        <td className="px-3 py-3 text-center text-amber-700">
                          {totals.leave}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {totals.totalMarked}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {overallPercentage.toFixed(2)}%
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Attendance percentage = Present ÷ (Present + Absent) × 100. Leave
              is excluded from the percentage calculation.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #attendance-report-print,
          #attendance-report-print * {
            visibility: visible;
          }

          #attendance-report-print {
            position: absolute;
            inset: 0;
            width: 100%;
            padding: 12px;
          }

          #attendance-report-print table {
            width: 100%;
            border-collapse: collapse;
          }

          #attendance-report-print th,
          #attendance-report-print td {
            border: 1px solid #d1d5db;
            padding: 8px;
          }

          #attendance-report-print thead {
            display: table-header-group;
          }

          #attendance-report-print tr {
            break-inside: avoid;
          }

          #attendance-report-print .shadow-sm {
            box-shadow: none !important;
          }

          @page {
            size: landscape;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  color: string;
  background: string;
}

function SummaryCard({ label, value, color, background }: SummaryCardProps) {
  return (
    <div className={`rounded-xl p-4 ${background}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
