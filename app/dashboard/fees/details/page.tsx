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
        console.log("API DATA:", res.data.data); // ✅ debug
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
        placeholder="Search by name..."
        className="w-full p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-2xl text-black">Loading...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 float-left">Name</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="text-center border-b">
                <td
                  className="p-2 float-left
              "
                >
                  {student.fullName}
                </td>
                <td className="p-2">{student.contact}</td>

                <td className="p-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/students/${student._id}`)
                    }
                    className="text-blue-500 underline"
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
