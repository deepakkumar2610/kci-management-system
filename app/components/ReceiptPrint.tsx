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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Receipt-${payment._id}`,
  });

  return (
    <div className="p-4">
      {/* PRINT BUTTON */}

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
      <button
        onClick={handlePrint}
        className="absolute top-200 right-205 mb-4 rounded bg-[#ffa200] px-4 py-2 text-white"
      >
        Download PDF
      </button>
    </div>
  );
}
