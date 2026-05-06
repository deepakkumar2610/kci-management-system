/* eslint-disable @typescript-eslint/no-explicit-any */
import PrintButton from "@/app/components/PrintButton";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Student from "@/models/Student";
import mongoose from "mongoose";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params
  const { id } = await params;

  await connectDB();

  const payment = await Payment.findOne({
    _id: new mongoose.Types.ObjectId(id),
  }).populate("studentId");

  if (!payment) {
    return <div className="p-6">❌ Payment not found</div>;
  }

  const student = payment.studentId;

  return (
    <div className="p-6 max-w-xl mx-auto border">
      <h1 className="text-xl font-bold text-center mb-4">Fee Receipt</h1>

      <p>
        <strong>Receipt No:</strong> {payment.receiptNumber}
      </p>
      <p>
        <strong>Date:</strong> {new Date(payment.paymentDate).toDateString()}
      </p>

      <hr className="my-3" />

      <p>
        <strong>Student:</strong> {student.fullName}
      </p>
      <p>
        <strong>Contact:</strong> {student.contact}
      </p>

      <hr className="my-3" />

      <p>
        <strong>Amount Paid:</strong> ₹{payment.amountPaid}
      </p>
      <p>
        <strong>Mode:</strong> {payment.paymentMode}
      </p>
      <p>
        <strong>Installment:</strong> {payment.installmentNumber}
      </p>

      {/* <button
        onClick={() => window.print()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Print Receipt
      </button> */}
      <PrintButton />
    </div>
  );
}
