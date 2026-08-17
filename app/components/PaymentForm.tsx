/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import apiHandler from "@/lib/api";

export default function PaymentForm() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    apiHandler.get("/students?all=true").then((res) => {
      setStudents(res.data.data);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      studentId: "",
      amountPaid: "",
      paymentMode: "cash",
      installmentNumber: "",
    },

    onSubmit: async (values, { resetForm }) => {
      const res = await apiHandler.post("/payments", values);

      if (!res.data?._id) {
        alert("Payment failed ❌");
        return;
      } else {
        alert("Payment Successful ✅");
      }

      // 🔥 Open receipt page
      window.open(`/receipt/${res.data.data._id}`, "_blank");

      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Student */}
      <select
        name="studentId"
        onChange={formik.handleChange}
        value={formik.values.studentId}
        className="p-2 border rounded"
      >
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>
            {s.fullName}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="amountPaid"
        placeholder="Amount"
        onChange={formik.handleChange}
        value={formik.values.amountPaid}
        className="p-2 border rounded"
      />

      <select
        name="paymentMode"
        onChange={formik.handleChange}
        value={formik.values.paymentMode}
        className="p-2 border rounded"
      >
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
        <option value="card">Card</option>
      </select>

      <input
        type="number"
        name="installmentNumber"
        placeholder="Installment Number"
        onChange={formik.handleChange}
        value={formik.values.installmentNumber}
        className="p-2 border rounded"
      />

      <button className="col-span-2 bg-green-600 text-white p-2 rounded">
        Save Payment
      </button>
    </form>
  );
}
