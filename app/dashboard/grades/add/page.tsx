"use client";

import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddGrade() {
  const formik = useFormik({
    initialValues: {
      gradeName: "",
      board: "",
      type: "",
      subjects: "",
      annualFees: "",
      installments: "",
      description: "",
      status: "active",
    },

    validationSchema: Yup.object({
      gradeName: Yup.string().required("Grade is required"),
      board: Yup.string().required("Board is required"),
      type: Yup.string().required("Type is required"),
      annualFees: Yup.number()
        .required("Fees required")
        .positive("Must be positive"),
      installments: Yup.number()
        .required("Installments required")
        .min(1, "Minimum 1"),
    }),

    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Add Class / Grade</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Grade Name */}
        <div>
          <input
            name="gradeName"
            placeholder="Enter Grade (e.g. 10th)"
            onChange={formik.handleChange}
            value={formik.values.gradeName}
            className="w-full p-2 border rounded"
          />
          {formik.errors.gradeName && (
            <p className="text-red-500 text-sm">{formik.errors.gradeName}</p>
          )}
        </div>

        {/* Board */}
        <div>
          <input
            name="board"
            placeholder="Enter Board (SSC / CBSE)"
            onChange={formik.handleChange}
            value={formik.values.board}
            className="w-full p-2 border rounded"
          />
          {formik.errors.board && (
            <p className="text-red-500 text-sm">{formik.errors.board}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <select
            name="type"
            onChange={formik.handleChange}
            value={formik.values.type}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="school">School</option>
            <option value="entrance">Entrance</option>
          </select>
          {formik.errors.type && (
            <p className="text-red-500 text-sm">{formik.errors.type}</p>
          )}
        </div>

        {/* Subjects */}
        <div>
          <input
            name="subjects"
            placeholder="Subjects (comma separated)"
            onChange={formik.handleChange}
            value={formik.values.subjects}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Fees */}
        <div>
          <input
            type="number"
            name="annualFees"
            placeholder="Annual Fees"
            onChange={formik.handleChange}
            value={formik.values.annualFees}
            className="w-full p-2 border rounded"
          />
          {formik.errors.annualFees && (
            <p className="text-red-500 text-sm">{formik.errors.annualFees}</p>
          )}
        </div>

        {/* Installments */}
        <div>
          <input
            type="number"
            name="installments"
            placeholder="Installments Allowed"
            onChange={formik.handleChange}
            value={formik.values.installments}
            className="w-full p-2 border rounded"
          />
          {formik.errors.installments && (
            <p className="text-red-500 text-sm">{formik.errors.installments}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Description (optional)"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Status */}
        <div>
          <select
            name="status"
            onChange={formik.handleChange}
            value={formik.values.status}
            className="w-full p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#f7931e] text-white p-2 rounded hover:bg-[#e6821a]"
        >
          Save Class
        </button>
      </form>
    </div>
  );
}
