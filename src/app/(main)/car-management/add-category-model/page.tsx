"use client";

import { ImageUploadPreview } from "@/components/categorys/ImageUploadPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategoryMutation, useCreateModalMutation, useGetAllCategoryQuery, useUpdateCategoryMutation } from "@/features/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign, Plus, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Category Validation Schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  credit: z.string().min(1, "Credit cost is required"),
  image: z.any().refine((file) => file instanceof File || typeof file === "string", "Banner image is required"),
});

// Model Validation Schema
const modelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  category: z.string().min(1, "Category is required"),
  makeYear: z.string().min(1, "Make year is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  description: z.string().min(1, "Description is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type ModelFormValues = z.infer<typeof modelSchema>;

export default function AddCategoryModel() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();
  const [createModal, { isLoading: isCreatingModal }] = useCreateModalMutation();
  const { data: categoriesData } = useGetAllCategoryQuery({});
  const categories = categoriesData?.data || [];

  // Category Form
  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    setValue: setCategoryValue,
    watch: watchCategory,
    formState: { errors: categoryErrors },
    reset: resetCategory,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      credit: "",
      image: null as any,
    },
  });

  const categoryImage = watchCategory("image");

  // Populate category form if editing
  useEffect(() => {
    if (editId && categories.length > 0) {
      const categoryToEdit = categories.find((cat: any) => cat._id === editId);
      if (categoryToEdit) {
        resetCategory({
          name: categoryToEdit.name,
          credit: categoryToEdit.credit?.toString() || "",
          image: categoryToEdit.image || null,
        });
      }
    }
  }, [editId, categories, resetCategory]);

  // Model Form
  const {
    register: registerModel,
    handleSubmit: handleSubmitModel,
    setValue: setModelValue,
    formState: { errors: modelErrors },
    reset: resetModel,
  } = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: "",
      category: "",
      makeYear: "",
      manufacturer: "",
      description: "",
    },
  });

  const onCategorySubmit = async (data: CategoryFormValues) => {
    try {
      const formData = new FormData();
      const payload: any = {
        name: data.name,
        credit: parseInt(data.credit) || 0,
      };

      formData.append("data", JSON.stringify(payload));

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      let response;
      if (editId) {
        response = await updateCategory({ id: editId, data: formData }).unwrap();
      } else {
        response = await createCategory(formData).unwrap();
      }

      if (response.success) {
        toast.success(editId ? "Category updated successfully!" : "Category created successfully!");
        if (!editId) resetCategory();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${editId ? 'update' : 'create'} category`);
    }
  };

  const onModelSubmit = async (data: ModelFormValues) => {
    try {
      const payload = {
        year: data.makeYear,
        modelName: data.name,
        manufacturer: data.manufacturer,
        description: data.description,
        categoryId: data.category,
      };

      const response = await createModal(payload).unwrap();
      if (response.success) {
        toast.success(response.message || "Model added successfully!");
        resetModel();
      } else {
        toast.error(response.message || "Failed to add model");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add model");
      console.error("Create modal error:", error);
    }
  };

  return (
    <div className="text-white font-sans h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 font-medium">
        Car Management / <span className="text-white">Add New Category & Model</span>
      </div>

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{editId ? "Edit Category" : "Create New Category & Model"}</h1>
        <p className="text-gray-400 text-base md:text-lg">
          {editId ? `Update details for "${categories.find((c: any) => c._id === editId)?.name || 'Category'}"` : "Define a new automotive segment for the ranking platform."}
        </p>
      </div>

      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Category Basic Information Section */}
        <div className="bg-[#1C2936] rounded-xl p-4 sm:p-6 md:p-8 border border-gray-800/50 shadow-2xl">
          <h2 className="text-lg md:text-xl font-semibold mb-6 md:mb-8">{editId ? "Edit Category Details" : "Category Basic Information"}</h2>

          <form onSubmit={handleSubmitCategory(onCategorySubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="cat-name" className="text-gray-300 font-medium">Category Name</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g., Electric Supercars"
                  {...registerCategory("name")}
                  className={`bg-[#101922] border-gray-700 h-12 focus:ring-blue-500 rounded-lg text-white placeholder:text-gray-500 ${categoryErrors.name ? 'border-red-500' : ''}`}
                />
                {categoryErrors.name && <p className="text-red-500 text-xs mt-1">{categoryErrors.name.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="credit-cost" className="text-gray-300 font-medium">Credit Cost</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500">
                    <CircleDollarSign size={20} fill="#facc15" className="text-yellow-600" />
                  </div>
                  <Input
                    id="credit-cost"
                    type="number"
                    placeholder="10"
                    {...registerCategory("credit")}
                    className={`bg-[#101922] border-gray-700 h-12 pl-12 focus:ring-blue-500 rounded-lg text-white placeholder:text-gray-500 ${categoryErrors.credit ? 'border-red-500' : ''}`}
                  />
                </div>
                {categoryErrors.credit && <p className="text-red-500 text-xs mt-1">{categoryErrors.credit.message}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300 font-medium">Featured Banner</Label>
              <ImageUploadPreview
                image={categoryImage}
                onImageChange={(file) => setCategoryValue("image", file)}
                onRemove={() => setCategoryValue("image", null as any)}
              />
              {categoryErrors.image && <p className="text-red-500 text-xs mt-1">{categoryErrors.image.message as string}</p>}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (editId) {
                    window.history.back();
                  } else {
                    resetCategory();
                  }
                }}
                className="bg-[#2D2428] hover:bg-[#3d2f34] text-red-500 hover:text-red-400 h-12 px-6 sm:px-10 rounded-lg border border-red-900/30 w-full sm:w-auto"
              >
                {editId ? "Back" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isCreatingCategory || isUpdatingCategory}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-6 sm:px-10 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 w-full sm:w-auto"
              >
                {isUpdatingCategory ? (
                  "Updating..."
                ) : isCreatingCategory ? (
                  "Processing..."
                ) : (
                  <>
                    {editId ? <Save size={20} /> : <Plus size={20} />}
                    {editId ? "Update Category" : "Add Category"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Model Basic Information Section */}
        <div className="bg-[#1C2936] rounded-xl p-4 sm:p-6 md:p-8 border border-gray-800/50 shadow-2xl">
          <h2 className="text-lg md:text-xl font-semibold mb-6 md:mb-8">Model Basic Information</h2>

          <form onSubmit={handleSubmitModel(onModelSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="model-name" className="text-gray-300 font-medium">Modal Name</Label>
                <Input
                  id="model-name"
                  placeholder="e.g., Electric Supercars"
                  {...registerModel("name")}
                  className={`bg-[#101922] border-gray-700 h-12 focus:ring-blue-500 rounded-lg text-white placeholder:text-gray-500 ${modelErrors.name ? 'border-red-500' : ''}`}
                />
                {modelErrors.name && <p className="text-red-500 text-xs mt-1">{modelErrors.name.message}</p>}
              </div>

              <div className="space-y-3 w-full">
                <Label htmlFor="category-select" className="text-gray-300 font-medium">Category</Label>
                <Select onValueChange={(value) => setModelValue("category", value)}>
                  <SelectTrigger id="category-select" className={`bg-[#101922] w-full py-[23px] border-gray-700 h-12 focus:ring-blue-500 rounded-lg text-white ${modelErrors.category ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Electric Supercars" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C2936] border-gray-800 text-white">
                    {categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id} className="focus:bg-blue-600 focus:text-white">{cat.name}</SelectItem>
                    ))}
                    {categories.length === 0 && (
                      <SelectItem value="none" disabled>No categories found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {modelErrors.category && <p className="text-red-500 text-xs mt-1">{modelErrors.category.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="make-year" className="text-gray-300 font-medium">Make Year</Label>
                <Input
                  id="make-year"
                  placeholder="2022"
                  {...registerModel("makeYear")}
                  className={`bg-[#101922] border-gray-700 h-12 focus:ring-blue-500 rounded-lg text-white placeholder:text-gray-500 ${modelErrors.makeYear ? 'border-red-500' : ''}`}
                />
                {modelErrors.makeYear && <p className="text-red-500 text-xs mt-1">{modelErrors.makeYear.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="manufacturers" className="text-gray-300 font-medium">Manufacturers</Label>
                <Input
                  id="manufacturers"
                  placeholder="Porsche"
                  {...registerModel("manufacturer")}
                  className={`bg-[#101922] border-gray-700 h-12 focus:ring-blue-500 rounded-lg text-white placeholder:text-gray-500 ${modelErrors.manufacturer ? 'border-red-500' : ''}`}
                />
                {modelErrors.manufacturer && <p className="text-red-500 text-xs mt-1">{modelErrors.manufacturer.message}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-gray-300 font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what vehicles belong in this product ..."
                {...registerModel("description")}
                className={`bg-[#101922] border-gray-700 min-h-[160px] focus:ring-blue-500 rounded-lg text-white placeholder:text-gray-500 ${modelErrors.description ? 'border-red-500' : ''}`}
              />
              {modelErrors.description && <p className="text-red-500 text-xs mt-1">{modelErrors.description.message}</p>}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => resetModel()}
                className="bg-[#2D2428] hover:bg-[#3d2f34] text-red-500 hover:text-red-400 h-12 px-6 sm:px-10 rounded-lg border border-red-900/30 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-6 sm:px-10 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 w-full sm:w-auto"
              >
                {isCreatingModal ? "Processing..." : (
                  <>
                    <Plus size={20} />
                    Add Modal
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}