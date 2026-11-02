/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import apiHandler from "@/lib/api";
import { BeatLoader } from "react-spinners";
import { exportStudentsExcel } from "@/lib/exportStudentsExcel";

export default function StudentsDetailsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          search,
          page: String(page),
          limit: String(limit),
        });

        if (grade) {
          params.set("grade", grade);
        }

        const response = await apiHandler.get(`/students?${params.toString()}`);

        setStudents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalStudents(response.data.pagination.totalStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [search, grade, page, limit]);

  const handleExportExcel = async () => {
    try {
      setExporting(true);

      const isExported = await exportStudentsExcel(search, grade);

      if (!isExported) {
        alert("No students available to export.");
      }
    } catch (error) {
      console.error("Failed to export students:", error);
      alert("Failed to export student list.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className=" space-y-4">
      <h2 className="text-xl font-semibold"> </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* 🔍 Search */}
        <div className="md:col-span-7">
          <input
            type="text"
            placeholder="Search by name or contact..."
            className="w-full rounded-md border  px-3 py-2 text-sm "
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* 🎓 Grade Filter */}
        <div className="md:col-span-3">
          <select
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-md border  bg-white px-3 py-2 text-sm "
          >
            <option value="">All Grades</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
            <option value="11th (Science)">11th (Science)</option>
            <option value="12th (Science)">12th (Science)</option>
          </select>
        </div>

        {/* 📊 Export Excel */}
        <div className="md:col-span-2">
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 float-end">
        <label className="text-sm text-gray-600">Rows per page:</label>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading ? (
        <div className="text-2xl text-black">
          <BeatLoader color="#f7931e" />
        </div>
      ) : (
        <table className="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-center w-20">Sr. No.</th>
              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Medium</th>
              <th className="p-3 text-left">Parent Contact</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-left">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="p-3">{student.fullName}</td>
                  <td className="p-3 text-left">
                    {student.classId?.name || "-"}
                  </td>
                  <td className="p-3 text-left">{student.medium}</td>
                  <td className="p-3 text-left">{student.parentContact}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-3 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-2 border rounded-md ${
                page === pageNumber ? "bg-[#f7931e] text-white" : "bg-white"
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="px-3 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
