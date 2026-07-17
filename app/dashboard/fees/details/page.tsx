/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import apiHandler from "@/lib/api";
import { useRouter } from "next/navigation";

export default function StudentsFeeDetailsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await apiHandler.get(`/students?search=${search}`);
        setStudents(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Student List</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or contact..."
        className="w-full p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-2xl text-black">Loading...</div>
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
    </div>
  );
}
