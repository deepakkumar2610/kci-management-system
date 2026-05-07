"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import apiHandler from "@/lib/api";

export default function ClassForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      board: "",
      type: "school",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      await apiHandler.post("/classes", values);
      alert("Class added ✅");
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
      <input
        name="name"
        placeholder="Class (e.g. 10th)"
        onChange={formik.handleChange}
        value={formik.values.name}
        className="p-2 border rounded"
      />

      <input
        name="board"
        placeholder="Board (SSC / CBSE)"
        onChange={formik.handleChange}
        value={formik.values.board}
        className="p-2 border rounded"
      />

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

      <button className="col-span-2 bg-orange-500 text-white p-2 rounded">
        Save Class
      </button>
    </form>
  );
}
