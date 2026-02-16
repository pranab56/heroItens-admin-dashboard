"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTireMutation, useGetAllTireQuery, useUpdateTireStateMutation } from "@/features/payment/paymentApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Switch } from '../../../../components/ui/switch';

const tireSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  value: z.string().min(1, "Value is required"),
});

type TireFormValues = z.infer<typeof tireSchema>;

const DUMMY_DATA = [
  { id: 1, name: "Payment tire 01", date: "12/04/2025", price: "$10", value: "100" },
  { id: 2, name: "Payment tire 01", date: "12/04/2025", price: "$10", value: "100" },
  { id: 3, name: "Payment tire 01", date: "12/04/2025", price: "$10", value: "100" },
  { id: 4, name: "Payment tire 01", date: "12/04/2025", price: "$10", value: "100" },
  { id: 5, name: "Payment tire 01", date: "12/04/2025", price: "$10", value: "100" },
  { id: 6, name: "Payment tire 01", date: "12/04/2025", price: "$10", value: "100" },
  { id: 7, name: "Payment tire 01", date: "12/04/2025", price: "$10", value: "100" },
];

export default function TireManagement() {
  const [activeTab, setActiveTab] = useState<"Credit" | "Coins">("Credit");
  const [currentPage, setCurrentPage] = useState(1);

  // Map UI tab name to API type
  const apiType = activeTab === "Coins" ? "coin" : "credit";
  const { data: tireData, isLoading: tireLoading } = useGetAllTireQuery({
    activeTab: apiType,
    page: currentPage,
    limit: 10
  });
  const [createTire, { isLoading: createTireLoading }] = useCreateTireMutation();
  const [updateState, { isLoading: updateStateLoading }] = useUpdateTireStateMutation();

  const tires = tireData?.data || [];

  const meta = tireData?.meta || { page: 1, total: 0, totalPage: 1, limit: 10 };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TireFormValues>({
    resolver: zodResolver(tireSchema),
    defaultValues: {
      name: "",
      price: "",
      value: "",
    },
  });

  const onSubmit = async (data: TireFormValues) => {
    try {
      const payload = {
        tireName: data.name,
        price: Number(data.price),
        value: Number(data.value),
        type: activeTab === "Coins" ? "coin" : "credit",
      };

      const res = await createTire(payload).unwrap();
      if (res.success) {
        toast.success(res.message || `${activeTab} tire added successfully!`);
        reset();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add tire");
      console.error("Create tire error:", error);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await updateState({ id, data: { status: newStatus } }).unwrap();
      if (res.success) {
        toast.success(`Tire status updated to ${newStatus}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  // Helper to generate page numbers
  const pages = Array.from({ length: meta.totalPage }, (_, i) => i + 1);

  return (
    <div className="text-white font-sans h-[calc(100vh-4rem)] overflow-y-auto pr-2">
      <div className="space-y-6 py-2">
        {/* Tab Selectors */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 md:mb-10">
          <button
            onClick={() => {
              setActiveTab("Credit");
              setCurrentPage(1);
            }}
            className={`flex-1 sm:flex-none px-6 sm:px-8 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "Credit"
              ? "bg-[#2185FF] text-white shadow-lg shadow-blue-500/20"
              : "bg-[#111C26] text-gray-500 hover:text-white border border-gray-800/50"
              }`}
          >
            Credit
          </button>
          <button
            onClick={() => {
              setActiveTab("Coins");
              setCurrentPage(1);
            }}
            className={`flex-1 sm:flex-none px-6 sm:px-8 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "Coins"
              ? "bg-[#2185FF] text-white shadow-lg shadow-blue-500/20"
              : "bg-[#111C26] text-gray-500 hover:text-white border border-gray-800/50"
              }`}
          >
            Coins
          </button>
        </div>

        {/* Add New Section */}
        <div className="bg-[#1C2936] rounded-2xl p-6 sm:p-8 border border-gray-800/50 shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8">Add New {activeTab} Tire</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row items-end gap-6">
            <div className="flex-1 w-full space-y-3">
              <Label htmlFor="name" className="text-gray-300 font-medium ml-1">Name</Label>
              <Input
                id="name"
                placeholder="Enter payment tire name here..."
                {...register("name")}
                className={`bg-[#0F171F] border-gray-800 h-12 focus:ring-blue-500 rounded-xl text-white placeholder:text-gray-600 ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>

            <div className="flex-1 w-full space-y-3">
              <Label htmlFor="price" className="text-gray-300 font-medium ml-1">$Price</Label>
              <Input
                id="price"
                placeholder="Enter price here..."
                type='number'
                {...register("price")}
                className={`bg-[#0F171F] border-gray-800 h-12 focus:ring-blue-500 rounded-xl text-white placeholder:text-gray-600 ${errors.price ? 'border-red-500' : ''}`}
              />
            </div>

            <div className="flex-1 w-full space-y-3">
              <Label htmlFor="value" className="text-gray-300 font-medium flex items-center gap-2 ml-1">
                Value <CircleDollarSign size={20} fill="#facc15" className="text-yellow-600" />
              </Label>
              <Input
                id="value"
                placeholder="Enter credit value here..."
                type='number'
                {...register("value")}
                className={`bg-[#0F171F] border-gray-800 h-12 focus:ring-blue-500 rounded-xl text-white placeholder:text-gray-600 ${errors.value ? 'border-red-500' : ''}`}
              />
            </div>

            <Button
              type="submit"
              disabled={createTireLoading}
              className="w-full lg:w-auto bg-[#2185FF] hover:bg-blue-600 text-white font-bold h-12 px-10 rounded-xl shadow-lg shadow-blue-500/10 transition-all justify-center"
            >
              {createTireLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-2xl border border-gray-800/50 shadow-2xl mt-8 md:mt-12 bg-[#1C2936]">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <div className="bg-[#1C2C3F] px-6 sm:px-8 py-5 grid grid-cols-5 gap-4 text-sm font-bold text-gray-400/80 min-w-[700px]">
              <div>Name</div>
              <div>Type</div>
              <div>$Price</div>
              <div>Value</div>
              <div className="text-center">Action</div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <div className="divide-y divide-gray-800/60 min-w-[700px]">
              {tireLoading ? (
                <div className="p-8 text-center text-gray-400">Loading tires...</div>
              ) : tires.length > 0 ? (
                tires.map((tire: any) => (
                  <div
                    key={tire._id}
                    className="px-6 sm:px-8 py-6 grid grid-cols-5 gap-4 items-center hover:bg-gray-800/20 transition-colors"
                  >
                    <div className="text-gray-200 text-sm font-medium">{tire.tireName}</div>
                    <div className="text-gray-200 text-sm font-medium">{tire.type}</div>

                    <div className="text-gray-200 font-medium">${tire.price}</div>
                    <div className="text-gray-200">{tire.value}</div>
                    <div className="flex justify-center gap-4">
                      <Switch
                        checked={tire.status === "active"}
                        onCheckedChange={() => handleStatusChange(tire._id, tire.status)}
                        className="data-[state=checked]:bg-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">No tires found for this category</div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-[#1C2936] border-t border-gray-800/50">
            <div className="text-sm text-gray-500 font-medium">
              Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} Tires
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