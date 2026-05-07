/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function PaymentHistory({ payments }: any) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-3">Payment History</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Date</th>
            <th>Amount</th>
            <th>Mode</th>
            <th>Receipt</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p: any) => (
            <tr key={p?._id} className="border-b text-center">
              {/* <td>{new Date(p.paymentDate).toLocaleDateString()}</td> */}
              <td>
                {p?.paymentDate
                  ? new Date(p.paymentDate).toISOString().split("T")[0]
                  : "-"}
              </td>
              <td>₹{p?.amountPaid}</td>
              <td>{p?.paymentMode}</td>
              <td>
                <button
                  onClick={() => window.open(`/receipt/${p?._id}`)}
                  className="text-blue-500 underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
