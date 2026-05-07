/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import brandLogo from "@/public/assets/images/kci-institute-brand-logo.png";
import WatermarkLogo from "@/public/assets/images/logo.png";

/* ✅ TYPES */
type Installment = {
  amount: number;
  status?: string;
};

type Payment = {
  amountPaid: number;
  receiptNumber: string;
  paymentMode?: string;
  txnId?: string;
  paidAt?: string;
};

type Fees = {
  totalFees: number;
  discount: number;
  finalFees: number;
  paidAmount: number;
  remainingAmount?: number;
  installments?: Installment[];
};

type Student = {
  fullName: string;
  medium: string;
  parentName: string;
  parentContact: string;
  classId?: {
    name: string;
  };
  fees: Fees;
};

type Props = {
  student: Student;
  payment: Payment;
  payments: any[];
  totalPaid: number;
  remaining: number;
};

/* ✅ COMPONENT */
export default function InvoiceReceipt({
  student,
  payment,
  payments,
  totalPaid,
  remaining,
}: Props) {
  const fees = student?.fees;
  const amountPaid = payment?.amountPaid;
  // console.log("payment: ", fees);
  console.log("amountPaid: ", payment);
  return (
    <div className="max-w-3xl mx-auto p-6 mt-5   bg-white text-black border rounded-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="items-center gap-3">
          <Image src={brandLogo} alt="logo" className=" w-70 object-contain" />
        </div>

        <div className="text-right">
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase">
              Fee Receipt [{payment?.receiptNumber}]
            </h2>
            <p className="text-sm">
              Receipt Date: {/* {new Date().toLocaleDateString()} */}
              {new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date())}
            </p>
          </div>
          <div>
            {/* <h1 className="text-xl font-bold">KriSons Coaching Institute</h1> */}
            <p className="text-sm">
              📞 9702414732 / 8850467922 | ✉ krisons.kci@gmail.com
            </p>
            <p className="text-sm">
              Shop No.1, Qureshi Compound, Opp. Vijay Nagar, Jarimari,
              Mumbai-400072
            </p>
            {/* <p className="text-sm"></p> */}
          </div>
        </div>
      </div>

      {/* STUDENT DETAILS */}
      <div className="mt-6 border rounded-md p-4">
        <h3 className="font-semibold mb-3">Student Details</h3>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <b>Name:</b> {student.fullName}
          </p>
          <p>
            <b>Class:</b> {student.classId?.name || "-"}
          </p>
          <p>
            <b>Medium:</b> {student.medium}
          </p>
          <p>
            <b>Parent Name:</b> {student.parentName}
          </p>
          <p>
            <b>Parent Contact:</b> {student.parentContact}
          </p>
        </div>
      </div>

      {/* FEE SUMMARY */}
      <div className="mt-6 border rounded-md overflow-hidden">
        <div className="relative bg-gray-100 px-4 py-2 font-semibold">
          Fee Summary
        </div>

        <table className="w-full text-sm">
          <tbody>
            <tr className="border-t">
              <td className="p-2">Total Fees</td>
              <td className="p-2 text-right">₹{fees.totalFees}</td>
            </tr>

            <tr className="border-t">
              <td className="p-2">Discount</td>
              <td className="p-2 text-right text-red-600">
                - ₹{fees.discount}
              </td>
            </tr>

            <tr className="border-t font-medium">
              <td className="p-2">Final Fees</td>
              <td className="p-2 text-right">₹{fees.finalFees}</td>
            </tr>

            <tr className="border-t text-green-600 font-medium">
              <td className="p-2">This payment</td>
              <td className="p-2 text-right">₹{amountPaid}</td>
            </tr>

            <tr className="border-t font-bold">
              <td className="p-2">Total Paid</td>
              <td className="p-2 text-right">₹{totalPaid}</td>
            </tr>
            <tr className="border-t font-bold">
              <td className="p-2">Balance</td>
              <td className="p-2 text-right">₹{remaining}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="absolute -top-70 inset-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-10">
          <Image src={WatermarkLogo} alt="Watermark-logo" className="w-120" />
        </div>
      </div>

      {remaining === 0 && (
        <div className="absolute bottom-100 left-280 border-4 border-green-500 px-6 py-2 text-5xl font-bold text-green-500 opacity-20">
          PAID
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-8 flex justify-between items-end">
        <div className="text-xs text-gray-600">
          <p>* Fees once paid are non-refundable</p>
          <p>* This is a computer-generated receipt</p>
        </div>

        <div className="text-center">
          <p className="border-t w-40 mt-8"></p>
          <p className="text-sm">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
}
