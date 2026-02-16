"use client";

import { Button } from "@/components/ui/button";
import { useGetAllTransectionHistoryQuery } from "@/features/payment/paymentApi";
import { useState } from "react";

export default function PaymentHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: paymentData, isLoading: paymentLoading } = useGetAllTransectionHistoryQuery({
    page: currentPage,
    limit: 10
  });

  const payments = paymentData?.data || [];
  const meta = paymentData?.meta || { page: 1, total: 0, totalPage: 1, limit: 10 };

  // Calculate total earnings from successful payments
  // Note: Backend might provide this total separately, but for now calculating from visible data
  const totalEarning = payments
    .filter((p: any) => p.status === "success")
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  // Helper for page numbers
  const pages = Array.from({ length: meta.totalPage }, (_, i) => i + 1);

  return (
    <div className="text-white font-sans h-[calc(100vh-4rem)] overflow-y-auto pr-2">
      <div className="space-y-8 py-2">
        {/* Total Earning Card */}
        <div className="bg-[#1C2936] rounded-2xl p-6 w-full sm:w-fit min-w-[240px] border border-gray-800/50 shadow-2xl flex items-center justify-between sm:justify-start gap-6">
          <span className="text-gray-300 font-bold text-lg">Total Earing</span>
          <span className="text-[#2185FF] text-2xl sm:text-3xl font-black">
            ${totalEarning >= 1000 ? `${(totalEarning / 1000).toFixed(1)}k` : totalEarning}
          </span>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-2xl border border-gray-800/50 shadow-2xl bg-[#1C2936]">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <div className="bg-[#1C2C3F] px-6 sm:px-8 py-5 grid grid-cols-6 gap-4 text-sm font-bold text-gray-400/80 min-w-[800px]">
              <div>Client Name</div>
              <div>Date</div>
              <div>Tire Name</div>
              <div>$Amount</div>
              <div>Type</div>
              <div>Value</div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <div className="divide-y divide-gray-800/60 min-w-[800px]">
              {paymentLoading ? (
                <div className="p-8 text-center text-gray-400">Loading history...</div>
              ) : payments.length > 0 ? (
                payments.map((payment: any) => (
                  <div
                    key={payment._id}
                    className="px-6 sm:px-8 py-6 grid grid-cols-6 gap-4 items-center hover:bg-gray-800/20 transition-colors"
                  >
                    <div className="text-gray-200 text-sm font-medium truncate" title={payment.userId?.name}>
                      {payment.userId?.name || "Unknown User"}
                    </div>
                    <div className="text-gray-400/80 text-sm">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                    <div className="text-gray-200 text-sm uppercase truncate" title={payment.tireId?.tireName || payment.type}>
                      {payment.tireId?.tireName || payment.type || "N/A"}
                    </div>
                    <div className="text-gray-200 font-medium">${payment.amount}</div>
                    <div className="text-gray-200 capitalize">{payment.type}</div>
                    <div className="text-gray-200">{payment.value || 0}</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">No transaction history found</div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-[#1C2936] border-t border-gray-800/50">
            <div className="text-sm text-gray-500 font-medium">
              Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} Transactions
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="text-gray-400 hover:text-white bg-[#111C26] h-10 sm:h-12 px-4 sm:px-6 rounded-xl border border-gray-800/50 font-semibold disabled:opacity-30 text-sm sm:text-base"
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl font-bold transition-all text-sm sm:text-base ${currentPage === page
                      ? "bg-[#2185FF] text-white shadow-lg shadow-blue-500/20"
                      : "bg-[#111C26] text-gray-500 hover:text-white border border-gray-800/50"
                      }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, meta.totalPage))}
                className="text-gray-500 hover:text-white bg-[#111C26] h-10 sm:h-12 px-4 sm:px-6 rounded-xl border border-gray-800/50 font-semibold disabled:opacity-30 text-sm sm:text-base"
                disabled={currentPage === meta.totalPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}