/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import apiHandler from "@/lib/api";

type FeeFormProps = {
  refreshKey: number;
};

export default function FeeForm({ refreshKey }: FeeFormProps) {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiHandler.get("/classes").then((res) => {
      setClasses(res.data.data);
    });
  }, [refreshKey]);

  const formik = useFormik({
    initialValues: {
      classId: "",
      annualFees: "",
      installmentsAllowed: 1,
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const res = await apiHandler.post("/fees", values);

        alert(res.data?.message || "Fee added successfully ✅");

        resetForm();
      } catch (error: any) {
        alert(error?.response?.data?.message || "Failed to add fee!");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Class */}
          <select
            name="classId"
            onChange={formik.handleChange}
            value={formik.values.classId}
            className="p-2 border rounded"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.data?.gradeName || cls.name}
              </option>
            ))}
          </select>

          {/* Fees */}
          <input
            type="number"
            name="annualFees"
            placeholder="Annual Fees"
            onChange={formik.handleChange}
            value={formik.values.annualFees}
            className="p-2 border rounded"
          />

          {/* Installments */}
          <input
            type="number"
            name="installmentsAllowed"
            placeholder="Installments"
            onChange={formik.handleChange}
            value={formik.values.installmentsAllowed}
            className="p-2 border rounded"
          />

          <button
            className="col-span-2 bg-orange-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Fees"}
          </button>
        </form>
      )}
    </>
  );
}
