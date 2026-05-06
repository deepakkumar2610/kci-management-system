/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function FeeSummary({ student, payments }: any) {
  const fee = student.fees;

  const totalPaid = payments.reduce(
    (sum: number, p: any) => sum + p.amountPaid,
    0,
  );

  const balance = fee.finalFees - totalPaid;

  const progress = (totalPaid / fee.finalFees) * 100;

  return (
    <div className="bg-white shadow rounded p-4 space-y-4">
      <h3 className="text-lg font-semibold">Fee Summary</h3>

      <div className="grid grid-cols-3 gap-4">
        <div>Total: ₹{fee.totalFees}</div>
        <div>Discount: ₹{fee.discount}</div>
        <div>Final: ₹{fee.finalFees}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-green-600">Paid: ₹{totalPaid}</div>
        <div className="text-red-500">Balance: ₹{balance}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-3 rounded">
        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
