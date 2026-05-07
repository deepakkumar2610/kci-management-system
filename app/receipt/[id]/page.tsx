// /* eslint-disable @typescript-eslint/no-explicit-any */
import ReceiptPrint from "@/app/components/ReceiptPrint";
import { connectDB } from "@/lib/mongodb";

import Student from "@/models/Student";
import Payment from "@/models/Payment";

import "@/models/Class";

export default async function Page({ params }: { params: { id: string } }) {
  await connectDB();
  const { id } = await params;

  const paymentId = id;

  // 🔹 1. Get current payment
  const payment = await Payment.findById(paymentId).lean();

  if (!payment) return <div>Payment not found</div>;

  // 🔹 2. Get student
  const student = await Student.findById(payment.studentId)
    .populate("classId")
    .lean();

  if (!student) return <div>Student not found</div>;

  // ✅ Convert to plain object
  const studentData = JSON.parse(JSON.stringify(student));

  // 🔹 3. Get ALL payments of this student
  const payments = await Payment.find({
    studentId: payment.studentId,
  }).lean();

  // 🔹 4. Calculate total paid
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

  // 🔹 5. Calculate remaining
  const remaining = student.fees.finalFees - totalPaid;

  return (
    <ReceiptPrint
      student={studentData}
      payment={payment}
      payments={payments}
      totalPaid={totalPaid}
      remaining={remaining}
    />
  );
}
