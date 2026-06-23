"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import apiHandler from "@/lib/api";
import { useState } from "react";

type ClassFormProps = {
  onSuccessRefresh: () => void;
};

export default function ClassForm({ onSuccessRefresh }: ClassFormProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      board: "",
      type: "school",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Class/Grade is required"),
      board: Yup.string().required("Board is required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setLoading(true);

        const res = await apiHandler.post("/classes", values);

        alert(res.data?.message || "Class added successfully ✅");
        onSuccessRefresh();
        resetForm();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert(error?.response?.data?.message || "Failed to add class");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
      <div className="flex flex-col">
        <input
          name="name"
          placeholder="Class (e.g. 10th)"
          onChange={formik.handleChange}
          value={formik.values.name}
          className="p-2 border rounded"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
        )}
      </div>

      <div className="flex flex-col">
        <input
          name="board"
          placeholder="Board (SSC / CBSE)"
          onChange={formik.handleChange}
          value={formik.values.board}
          className="p-2 border rounded"
        />
        {formik.touched.board && formik.errors.board && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.board}</p>
        )}
      </div>
      <div className="flex flex-col">
        <select
          name="type"
          onChange={formik.handleChange}
          value={formik.values.type}
          className="p-2 border rounded"
        >
          <option value="school">School</option>
          <option value="junior-college">Junior College</option>
          <option value="entrance">Entrance</option>
        </select>
      </div>

      <button
        className="col-span-2 bg-orange-500 text-white p-2 rounded"
        disabled={loading}
      >
        {formik.isSubmitting ? "Saving..." : "Save Class"}
      </button>
    </form>
  );
}
