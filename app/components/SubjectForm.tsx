/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import apiHandler from "@/lib/api";

type SubjectFormProps = {
  refreshKey: number;
};

export default function SubjectForm({ refreshKey }: SubjectFormProps) {
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
      name: "",
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const res = await apiHandler.post("/subjects", values);

        alert(res.data?.message || "Subject added successfully ✅");

        resetForm();
      } catch (error: any) {
        alert(error?.response?.data?.message || "Failed to add subject! ");
      } finally {
        setLoading(false);
      }
    },
  });

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
      <select
        name="classId"
        onChange={formik.handleChange}
        value={formik.values.classId}
        className="p-2 border rounded"
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.name}
          </option>
        ))}
      </select>

      <input
        name="name"
        placeholder="Subject Name"
        onChange={formik.handleChange}
        value={formik.values.name}
        className="p-2 border rounded"
      />

      <button
        className="col-span-2 bg-orange-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving... " : "Save Subject"}
      </button>
    </form>
  );
}
