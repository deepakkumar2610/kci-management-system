"use client";

import { useEffect, useState } from "react";
import apiHandler from "@/lib/api";
import SelectField from "../SelectField";
import { useFormik } from "formik";

interface AttendanceRecord {
  _id: string;
  studentId: string;
  name: string;
  date: string;
  status: string;
}

type Class = {
  _id: string;
  gradeName: string;
  type: "school" | "junior-college" | "entrance";
};

export default function AttendanceHistoryComponent() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState([]);

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const [attendanceExist, setAttendanceExist] = useState(false);

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
      const { classId, batchId, date } = values;

      if (!date || !classId || !batchId) {
        alert("Please select date, class and batch");
        return;
      }

      try {
        setLoading(true);

        const response = await apiHandler.get(
          `/attendance?date=${date}&classId=${classId}&batchId=${batchId}`,
        );
        setAttendanceExist(response.data.attendanceExists);
        setAttendance(response.data.students);
      } catch (error) {
        console.error("Error fetching attendance history:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  // 🔥 Load dependent data when class changes
  useEffect(() => {
    if (!formik.values.classId) return;

    // load batches
    apiHandler
      .get(`/batches?classId=${formik.values.classId}`)
      .then((res) => setBatches(res.data.data));
  }, [formik.values.classId]);

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="mb-6 text-2xl font-bold text-[#0b2c5f]">
        Attendance History
      </h1>

      <form onSubmit={formik.handleSubmit} className="">
        <div className="grid grid-cols-3 gap-4">
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
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 rounded-lg bg-[#f7931e] px-5 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {/* Attendance Table */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          {attendance.length === 0 || !attendanceExist ? (
            <p className="py-6 text-center text-gray-500">
              No attendance records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3">Sr. No.</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>

                      <td className="px-4 py-3 font-medium">{record?.name}</td>

                      <td className="px-4 py-3">{formik.values.date}</td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            record.status === "Present"
                              ? "font-medium text-green-600"
                              : "font-medium text-red-600"
                          }
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
