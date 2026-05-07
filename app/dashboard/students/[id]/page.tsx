import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import Payment from "@/models/Payment";
import FeeSummary from "@/app/components/FeeSummary";
import PaymentHistory from "@/app/components/PaymentHistory";
import "@/models/Class";

export default async function StudentDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  const student = await Student.findById(id).populate("classId").lean();
  const payments = await Payment.find({ studentId: id })
    .sort({
      createdAt: -1,
    })
    .lean();

  if (!student) return <div>Student not found</div>;

  // ✅ Convert to plain object
  const studentData = JSON.parse(JSON.stringify(student));

  const paymentData = JSON.parse(JSON.stringify(payments));

  return (
    <div className="p-6 space-y-6">
      {/* Student Info */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold">{student.fullName}</h2>
        <p>Contact: {student.contact}</p>
        <p>Grade: {student.classId.name}</p>
      </div>

      {/* Fee Summary */}
      <FeeSummary student={studentData} payments={paymentData} />

      {/* Payment History */}
      <PaymentHistory payments={paymentData} />
    </div>
  );
}
