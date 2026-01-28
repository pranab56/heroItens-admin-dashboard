"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoryQuery, useUpdateCategoryMutation } from '@/features/category/categoryApi';
import {
  AlertTriangle,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// Category Interface - Updated to match API response
interface Category {
  _id: string;
  name: string;
  totalCar: number;
  voteStatus: boolean;
  Reward: number;
  categorySlug: string;
  description: string;
  image: string;
  battleCost: number;
}

// Modal Component
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ open, onOpenChange, children, className = '' }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className="fixed inset-0 bg-black/70 animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div className={`relative z-50 w-full max-w-3xl animate-in zoom-in-95 fade-in duration-200 ${className}`}>
        {children}
      </div>
    </div>
  );
};

// Image Upload Preview Component
interface ImageUploadProps {
  image: File | string | null;
  onImageChange: (image: File | string) => void;
  onRemove: () => void;
}

const ImageUploadPreview = ({ image, onImageChange, onRemove }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(image);
    } else if (typeof image === 'string') {
      setPreview(image);
    } else {
      setPreview('');
    }
  }, [image]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      onImageChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      onImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="bg-[#1C2936] border-2 border-dashed border-gray-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <div className="relative p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
          >
            <X size={16} />
          </button>
          <div className="relative h-48 w-full rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Banner preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-400">
            <Upload size={16} />
            <span>Click to change image</span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Upload size={32} className="text-blue-400 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">Click to upload banner image</p>
          <p className="text-gray-400 text-sm mb-2">or drag and drop</p>
          <p className="text-gray-400 text-xs">Recommended size: 1200x400px (PNG, JPG, WEBP)</p>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function CategoryManagement() {
  // API Hooks
  const { data: apiResponse, isLoading: isFetching, refetch } = useGetAllCategoryQuery({});
  console.log("apiResponse", apiResponse)
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Local State
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    Reward: '',
    categorySlug: '',
    description: '',
    battleCost: '',
    image: null as File | null
  });

  const itemsPerPage = 7;

  // Update categories when API data changes
  useEffect(() => {
    if (apiResponse?.data) {
      setCategories(apiResponse.data);
    }
  }, [apiResponse]);

  // Filter categories
  useEffect(() => {
    const filtered = categories.filter(category => {
      const searchLower = searchQuery.toLowerCase();
      return category.name.toLowerCase().includes(searchLower);
    });

    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [categories, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleVoting = async (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) return;

    try {
      // Create FormData for the update
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify({
        name: category.name,
        description: category.description,
        Reward: category.Reward,
        battleCost: category.battleCost,
        voteStatus: !category.voteStatus
      }));

      await updateCategory({ id: categoryId, data: formDataToSend }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update voting status:', error);
      alert('Failed to update voting status');
    }
  };

  const handleAddCategory = () => {
    setFormData({
      name: '',
      Reward: '',
      categorySlug: '',
      description: '',
      battleCost: '',
      image: null
    });
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      Reward: category.Reward.toString(),
      categorySlug: category.categorySlug,
      description: category.description,
      battleCost: category.battleCost.toString(),
      image: category.image
    });
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleFormChange = (field: string, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.categorySlug || !formData.image) {
      alert('Please fill in all required fields including image');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append the JSON data as a string
      formDataToSend.append('data', JSON.stringify({
        name: formData.name,
        description: formData.description,
        Reward: parseInt(formData.Reward) || 0,
        battleCost: parseInt(formData.battleCost) || 0
      }));

      // Append the image file
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      await createCategory(formDataToSend).unwrap();
      setShowAddModal(false);
      refetch();
      alert('Category created successfully!');
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category');
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedCategory) return;

    if (!formData.name || !formData.categorySlug) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append the JSON data as a string
      formDataToSend.append('data', JSON.stringify({
        name: formData.name,
        description: formData.description,
        Reward: parseInt(formData.Reward) || 0,
        battleCost: parseInt(formData.battleCost) || 0
      }));

      // Append the image file only if it's a new file
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      await updateCategory({ id: selectedCategory._id, data: formDataToSend }).unwrap();
      setShowEditModal(false);
      refetch();
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      const response = await deleteCategory({ id: selectedCategory._id }).unwrap();
      setShowDeleteModal(false);
      refetch();
      toast.success(response.message || "Category deleted successfully!")
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error?.message || "Failed to delete category");
    }
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 rounded-lg bg-[#1C2936] p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Screen here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12 bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
          />
        </div>

        <div className="w-full md:w-auto relative h-full">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={20} />
          <Select onValueChange={() => { }}>
            <SelectTrigger className="w-full md:w-[200px] h-20 py-[23px] bg-[#0d1829] border-gray-700 text-white pl-12 rounded-lg cursor-pointer">
              <SelectValue placeholder="Filter: 2025" />
            </SelectTrigger>
            <SelectContent className='bg-[#1a2942] border-gray-700 text-white cursor-pointer'>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Category
        </Button>
      </div>

      {/* Categories Table */}
      <div>
        {/* Header */}
        <div className="bg-[#243b5e] rounded-t-xl px-6 py-4 grid grid-cols-4 gap-4 text-sm font-medium text-gray-300">
          <div>Category Name</div>
          <div>Total Cars</div>
          <div>Voting Active</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        {currentCategories.length > 0 ? (
          currentCategories.map((category) => (
            <div
              key={category._id}
              className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-4 grid grid-cols-4 gap-4 items-center transition-colors"
            >
              <div className="text-white text-sm font-medium">{category.name}</div>
              <div className="text-gray-300 text-sm">{category.totalCar}</div>
              <div>
                <Switch
                  checked={category.voteStatus}
                  onCheckedChange={() => handleToggleVoting(category._id)}
                  className="data-[state=checked]:bg-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Pencil size={18} className="text-green-400" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#1C2936] px-6 py-12 text-center">
            <p className="text-gray-400">No categories found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="flex flex-col bg-[#1C2936] rounded-b-xl p-5 sm:flex-row items-center justify-between gap-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} Category
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-[#243b5e] h-10 px-4"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {getPageNumbers().map((page, index) => (
                <Button
                  key={index}
                  variant={page === currentPage ? 'default' : 'ghost'}
                  className={`h-10 min-w-10 ${page === currentPage
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-gray-300 hover:text-white hover:bg-[#243b5e]'
                    }`}
                  onClick={() => typeof page === 'number' && handlePageClick(page)}
                  disabled={typeof page !== 'number'}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-[#243b5e] h-10 px-4"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal open={showAddModal} onOpenChange={setShowAddModal}>
        <div className="bg-[#0f1c2e] rounded-xl w-full max-w-3xl mx-auto p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Create New Category</h2>
              <p className="text-gray-400 text-sm">Define a new automotive segment for the ranking platform.</p>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-white font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-gray-300 mb-2 block text-sm">Category Name *</Label>
                <Input
                  placeholder="e.g., Electric Supercars"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block text-sm">Reward</Label>
                <Input
                  placeholder="59"
                  type="number"
                  value={formData.Reward}
                  onChange={(e) => handleFormChange('Reward', e.target.value)}
                  className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block text-sm">Battle Cost</Label>
                <Input
                  placeholder="300"
                  type="number"
                  value={formData.battleCost}
                  onChange={(e) => handleFormChange('battleCost', e.target.value)}
                  className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 h-11"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block text-sm">Description</Label>
              <Textarea
                placeholder="Describe what vehicles belong in this category ..."
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 min-h-24"
              />
            </div>
          </div>

          {/* Featured Banner */}
          <div className="mb-6">
            <Label className="text-gray-300 mb-2 block text-sm">Featured Banner *</Label>
            <ImageUploadPreview
              image={formData.image}
              onImageChange={(image) => handleFormChange('image', image as File)}
              onRemove={() => handleFormChange('image', null as any)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowAddModal(false)}
              className="bg-transparent hover:bg-red-600/10 text-red-400 border border-red-600/50 h-11 px-6 rounded-lg"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 rounded-lg flex items-center gap-2"
              disabled={isCreating}
            >
              {isCreating ? (
                <>Processing...</>
              ) : (
                <>
                  <Plus size={18} />
                  Add Category
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal open={showEditModal} onOpenChange={setShowEditModal}>
        <div className="bg-[#0f1c2e] rounded-xl w-full max-w-3xl mx-auto p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Edit Category</h2>
              <p className="text-gray-400 text-sm">Update the automotive segment information.</p>
            </div>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-white font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-gray-300 mb-2 block text-sm">Category Name *</Label>
                <Input
                  placeholder="e.g., Electric Supercars"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block text-sm">Reward</Label>
                <Input
                  placeholder="59"
                  type="number"
                  value={formData.Reward}
                  onChange={(e) => handleFormChange('Reward', e.target.value)}
                  className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block text-sm">Battle Cost</Label>
                <Input
                  placeholder="300"
                  type="number"
                  value={formData.battleCost}
                  onChange={(e) => handleFormChange('battleCost', e.target.value)}
                  className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block text-sm">Category Slug</Label>
                <Input
                  placeholder="electric-supercars"
                  value={formData.categorySlug}
                  disabled
                  className="bg-[#1C2936] border-gray-700 text-gray-500 placeholder-gray-500 h-11"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block text-sm">Description</Label>
              <Textarea
                placeholder="Describe what vehicles belong in this category ..."
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                className="bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 min-h-24"
              />
            </div>
          </div>

          {/* Featured Banner */}
          <div className="mb-6">
            <Label className="text-gray-300 mb-2 block text-sm">Featured Banner</Label>
            <ImageUploadPreview
              image={formData.image}
              onImageChange={(image) => handleFormChange('image', image as File)}
              onRemove={() => handleFormChange('image', null as any)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowEditModal(false)}
              className="bg-transparent hover:bg-red-600/10 text-red-400 border border-red-600/50 h-11 px-6 rounded-lg"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 rounded-lg flex items-center gap-2"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>Processing...</>
              ) : (
                <>
                  <Pencil size={18} />
                  Update Category
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <div className="bg-[#1a2942] rounded-xl p-8 w-full max-w-md mx-auto border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Delete Category?</h3>
            <p className="text-gray-400 text-sm">
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone and all associated data will be permanently removed.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmDelete}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-lg font-medium"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Category'}
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="w-full bg-transparent hover:bg-gray-700/50 text-gray-300 border border-gray-600 h-11 rounded-lg font-medium"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}