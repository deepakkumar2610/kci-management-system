/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import apiHandler from "@/lib/api";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

export default function StudentsFeeDetailsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const router = useRouter();

  // useEffect(() => {
  //   const delay = setTimeout(async () => {
  //     try {
  //       setLoading(true);
  //       const res = await apiHandler.get(`/students?search=${search}`);
  //       setStudents(res.data.data);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }, 400);

  //   return () => clearTimeout(delay);
  // }, [search]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const response = await apiHandler.get(
          `/students?search=${encodeURIComponent(
            search,
          )}&page=${page}&limit=${limit}`,
        );

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
  }, [search, page, limit]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold"> </h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or contact..."
        className="w-full p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
        <div className="">
          <BeatLoader color="#f7931e" />
        </div>
      ) : (
        <table className="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-center w-20">Sr. No.</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-center">Contact</th>
              <th className="p-3 text-center w-32">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">{student.fullName}</td>
                <td className="p-3 text-center">{student.contact}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/students/${student._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
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
