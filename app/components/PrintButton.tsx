"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Print Receipt
    </button>
  );
}
