/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiHandler from "@/lib/api";

import InputField from "./InputField";
import SelectField from "./SelectField";

export default function StudentForm() {
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [fees, setFees] = useState<any>(null);

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
      fullName: "",
      contact: "",
      parentName: "",
      parentContact: "",
      classId: "",
      batchId: "",
      subjectIds: [] as string[],
      medium: "",
      discount: 0,
    },

    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      contact: Yup.string().required("Required"),
      classId: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      const payload = {
        ...values,
        fees: {
          totalFees: fees?.annualFees || 0,
          discount: values.discount,
          finalFees: (fees?.annualFees || 0) - values.discount,
          installments: fees?.installmentsAllowed || 1,
        },
      };

      await apiHandler.post("/students", payload);

      alert("Student added ✅");
      formik.resetForm();
    },
  });

  // 🔥 Load dependent data when class changes
  useEffect(() => {
    if (!formik.values.classId) return;

    // load batches
    apiHandler
      .get(`/batches?classId=${formik.values.classId}`)
      .then((res) => setBatches(res.data.data));

    // load subjects
    apiHandler
      .get(`/subjects?classId=${formik.values.classId}`)
      .then((res) => setSubjects(res.data.data));

    // load fees
    apiHandler
      .get(`/fees?classId=${formik.values.classId}`)
      .then((res) => setFees(res.data.data));
  }, [formik.values.classId]);

  // 🔹 Multi-select subjects
  const handleSubjectChange = (e: any) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (opt: any) => opt.value,
    );
    formik.setFieldValue("subjectIds", selected);
  };

  return (
    <div className="p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-semibold">Add Student</h2>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
        <InputField formik={formik} name="fullName" placeholder="Full Name" />
        <InputField formik={formik} name="contact" placeholder="Contact" />

        <InputField
          formik={formik}
          name="parentName"
          placeholder="Parent Name"
        />
        <InputField
          formik={formik}
          name="parentContact"
          placeholder="Parent Contact"
        />

        {/* Class */}
        <SelectField formik={formik} name="classId" options={classes} />

        {/* Batch */}
        <SelectField formik={formik} name="batchId" options={batches} />

        {/* Subjects */}
        <select
          multiple
          onChange={handleSubjectChange}
          className="p-2 border rounded col-span-2"
        >
          {subjects.map((sub: any) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* Medium */}
        <input
          name="medium"
          placeholder="Medium"
          onChange={formik.handleChange}
          value={formik.values.medium}
          className="p-2 border rounded"
        />

        {/* Fees display */}
        {fees && (
          <div className="col-span-2 bg-gray-100 p-3 rounded">
            <p>Total Fees: ₹{fees.annualFees}</p>
            <p>Installments: {fees.installmentsAllowed}</p>
          </div>
        )}

        {/* Discount */}
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          onChange={formik.handleChange}
          value={formik.values.discount}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className="col-span-2 bg-[#f7931e] text-white p-2 rounded"
        >
          Save Student
        </button>
      </form>
    </div>
  );
}
