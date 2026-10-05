/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceReceipt from "./InvoiceReceipt";

type Props = {
  payment: any;
  payments: any[];
  student: any;
  totalPaid: number;
  remaining: number;
};

export default function ReceiptPrint({
  student,
  payment,
  payments,
  totalPaid,
  remaining,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const { installmentNumber } = payment;

  const firstName = student?.fullName?.trim().split(/\s+/)[0] || "";

  const installmentText = (number: number) => {
    if (number === 1) return "1st";
    if (number === 2) return "2nd";
    if (number === 3) return "3rd";
    return `${number}th`;
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${firstName}_${installmentText(installmentNumber)}_installment_receipt`,
  });

  return (
    <div className="p-4">
      {/* PRINT BUTTON */}
      <button
        onClick={handlePrint}
        className="cursor-pointer rounded bg-[#ffa200] px-4 py-2 text-white"
      >
        Download PDF
      </button>

      {/* RECEIPT */}
      <div ref={printRef}>
        <InvoiceReceipt
          student={student}
          payment={payment}
          payments={payments}
          totalPaid={totalPaid}
          remaining={remaining}
        />
      </div>
    </div>
  );
}
