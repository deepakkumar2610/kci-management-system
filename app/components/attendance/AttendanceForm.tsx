/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import apiHandler from "@/lib/api";

import SelectField from "./../SelectField";

type Class = {
  _id: string;
  gradeName: string;
  type: "school" | "junior-college" | "entrance";
};

interface Student {
  studentId: string;
  name: string;
  status: "Present" | "Absent" | "Leave";
}

export default function AttendanceForm() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState([]);

  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 Load classes initially
  useEffect(() => {
    apiHandler.get("/classes").then((res) => {
      setClasses(res.data.data);
    });
    apiHandler.get("/batches").then((res) => {
      setBatches(res.data.data);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().split("T")[0],
      classId: "",
      batchId: "",
    },

    onSubmit: async (values) => {
      console.log("values: ", values);
      const { classId, batchId, date } = values;

      // Validate required fields
      if (!date) {
        alert("Please select date");
        return;
      }

      if (!classId) {
        alert("Please select class");
        return;
      }

      if (!batchId) {
        alert("Please select batch");
        return;
      }

      if (students.length === 0) {
        alert("No students found");
        return;
      }

      try {
        setSaving(true);

        // Prepare attendance records
        const records = students.map((student) => ({
          studentId: student.studentId,
          status: student.status,
        }));

        const payload = {
          date,
          classId,
          batchId,
          records,
        };

        console.log("Attendance payload:", payload);

        const res = await apiHandler.post("/attendance", payload);

        console.log("Save attendance response:", res.data);

        if (res.data.success) {
          alert("Attendance saved successfully ✅");
        } else {
          alert(res.data.message || "Failed to save attendance");
        }
      } catch (error: any) {
        console.error("Save attendance error:", error);

        alert(
          error?.response?.data?.message ||
            "Something went wrong while saving attendance",
        );
      } finally {
        setSaving(false);
      }

      formik.resetForm();
    },
  });

  // 🔥 Load dependent data when class changes
  useEffect(() => {
    if (!formik.values.classId) return;
    const fetchBatches = async () => {
      try {
        setLoading(true);

        const res = await apiHandler.get(
          `/batches?classId=${formik.values.classId}`,
        );

        const batchesData = res.data.data || [];

        setBatches(batchesData);
      } catch (error) {
        console.error("Failed to fetch batches:", error);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [formik.values.classId]);

  useEffect(() => {
    const { classId, batchId } = formik.values;

    if (!classId || !batchId) {
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);

        console.log("Fetching students:", {
          classId,
          batchId,
        });

        const res = await apiHandler.get(
          `/students?classId=${classId}&batchId=${batchId}`,
        );

        const studentData = res.data.data || [];

        setStudents(
          studentData.map((student: any) => ({
            studentId: student._id,
            name: student.fullName,
            status: "Present",
          })),
        );
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [formik.values.classId, formik.values.batchId]);

  const changeStatus = (studentId: string, status: Student["status"]) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              status,
            }
          : student,
      ),
    );
  };

  return (
    <div className="p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-semibold">Add Student</h2>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-3 gap-4">
        {/* Date */}
        <div>
          <label className="mb-1 block text-sm font-medium">Date</label>

          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Class */}
        <div>
          <label className="mb-1 block text-sm font-medium">Grade</label>

          <SelectField formik={formik} name="classId" options={classes} />
        </div>

        {/* Batch */}
        <div>
          <label className="mb-1 block text-sm font-medium">Batch</label>

          <SelectField formik={formik} name="batchId" options={batches} />
        </div>

        {/* Students */}
        {students && (
          <div className="col-span-3 mt-6">
            {/* Student attendance table */}

            {loading ? (
              <div className="py-10 text-center">Loading students...</div>
            ) : students.length > 0 ? (
              <div className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-4 py-3">#</th>

                        <th className="px-4 py-3">Student Name</th>

                        <th className="px-4 py-3">Attendance</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student.studentId} className="border-b">
                          <td className="px-4 py-3">{index + 1}</td>

                          <td className="px-4 py-3 font-medium">
                            {student.name}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {(["Present", "Absent", "Leave"] as const).map(
                                (status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() =>
                                      changeStatus(student.studentId, status)
                                    }
                                    className={`rounded-lg px-3 py-1.5 text-sm ${
                                      student.status === status
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ),
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-[#f7931e] px-6 py-2.5 font-medium text-white hover:bg-[#e6821a] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Attendance"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                Select class and batch to load students.
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
