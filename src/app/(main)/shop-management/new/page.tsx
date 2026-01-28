"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Plus, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner'; // or your toast library
import { useCreateShopMutation } from '../../../../features/shop/shopApi';

export default function AddNewItemForm() {
  const [formData, setFormData] = useState({
    itemName: '',
    pointCost: '',
    discount: '',
    categoryType: '',
    useType: '',
    volume: '',
    formula: '',
    description: ''
  });

  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createShop, { isLoading: isCreatingShop }] = useCreateShopMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Only JPG, PNG, and SVG files are allowed'
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'File size must be less than 5MB'
        }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }

    if (!formData.pointCost.trim()) {
      newErrors.pointCost = 'Point cost is required';
    } else if (isNaN(Number(formData.pointCost)) || Number(formData.pointCost) <= 0) {
      newErrors.pointCost = 'Point cost must be a positive number';
    }

    if (formData.discount && isNaN(Number(formData.discount.replace('%', '')))) {
      newErrors.discount = 'Discount must be a valid percentage';
    }

    if (!formData.categoryType) {
      newErrors.categoryType = 'Category type is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!selectedFile) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare the data object to match API structure
      const dataObject = {
        itemName: formData.itemName,
        itemDescription: formData.description,
        pointCost: Number(formData.pointCost),
        discountCost: formData.discount ? Number(formData.discount.replace('%', '')) : 0,
        categoryType: formData.categoryType,
        userType: formData.useType || '',
        totalItem: 0, // You may want to add this field to your form
        volume: formData.volume || '',
        formula: formData.formula || '',
        status: 'Active' // Default status
      };

      // Create FormData object
      const formDataToSend = new FormData();

      // Add the data field as JSON string
      formDataToSend.append('data', JSON.stringify(dataObject));

      // Add the image file
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      // Call the API mutation
      const response = await createShop(formDataToSend).unwrap();

      // Success handling
      toast.success('Product created successfully!');

      // Reset form
      setFormData({
        itemName: '',
        pointCost: '',
        discount: '',
        categoryType: '',
        useType: '',
        volume: '',
        formula: '',
        description: ''
      });
      handleRemoveImage();

      // Navigate to products page
      router.push("/shop-management/products");

    } catch (error: any) {
      // Error handling
      console.error('Failed to create product:', error);
      toast.error(error?.data?.message || 'Failed to create product. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      itemName: '',
      pointCost: '',
      discount: '',
      categoryType: '',
      useType: '',
      volume: '',
      formula: '',
      description: ''
    });
    handleRemoveImage();
    setErrors({});

    // Navigate back
    router.push("/shop-management/products");
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Add New Item</h1>
        <p className="text-gray-400 text-sm">
          Configure a new digital asset or physical merchandise for the automotive community.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#1a2332] rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">General Information</h2>

        {/* First Row - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Item Name *</label>
            <Input
              placeholder="e.g., Premium Badge"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              disabled={isCreatingShop}
              className={` border-[#2a3744] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${errors.itemName ? 'border-red-500' : ''
                }`}
            />
            {errors.itemName && (
              <p className="text-red-400 text-xs mt-1">{errors.itemName}</p>
            )}
          </div>

          {/* Point Cost */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Point Cost *</label>
            <Input
              placeholder="e.g., 1200"
              value={formData.pointCost}
              onChange={(e) => handleInputChange('pointCost', e.target.value)}
              disabled={isCreatingShop}
              className={` border-[#2a3744] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${errors.pointCost ? 'border-red-500' : ''
                }`}
            />
            {errors.pointCost && (
              <p className="text-red-400 text-xs mt-1">{errors.pointCost}</p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Discount</label>
            <Input
              placeholder="15%"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', e.target.value)}
              disabled={isCreatingShop}
              className={` border-[#2a3744] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${errors.discount ? 'border-red-500' : ''
                }`}
            />
            {errors.discount && (
              <p className="text-red-400 text-xs mt-1">{errors.discount}</p>
            )}
          </div>
        </div>

        {/* Category Type - Full Width */}
        <div className="mb-6 w-full">
          <label className="block text-sm text-gray-300 mb-2">Category Type *</label>
          <Select
            value={formData.categoryType}
            onValueChange={(value) => handleInputChange('categoryType', value)}
            disabled={isCreatingShop}
          >
            <SelectTrigger
              className={` w-full border-[#2a3744] text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${errors.categoryType ? 'border-red-500' : ''
                }`}
            >
              <SelectValue placeholder="Digital Badge / Asset" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#2a3744] text-white">
              <SelectItem value="digital-badge">Digital Badge / Asset</SelectItem>
              <SelectItem value="physical">Physical Merchandise</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="Fitness">Fitness</SelectItem>
            </SelectContent>
          </Select>
          {errors.categoryType && (
            <p className="text-red-400 text-xs mt-1">{errors.categoryType}</p>
          )}
        </div>

        {/* Second Row - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Use Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Use Type</label>
            <Input
              placeholder="Exterior Care"
              value={formData.useType}
              onChange={(e) => handleInputChange('useType', e.target.value)}
              disabled={isCreatingShop}
              className=" border-[#2a3744] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Volume</label>
            <Input
              placeholder="48 fl oz"
              value={formData.volume}
              onChange={(e) => handleInputChange('volume', e.target.value)}
              disabled={isCreatingShop}
              className=" border-[#2a3744] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Formula */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Formula</label>
            <Input
              placeholder="Cimablue & Polymer"
              value={formData.formula}
              onChange={(e) => handleInputChange('formula', e.target.value)}
              disabled={isCreatingShop}
              className=" border-[#2a3744] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Description *</label>
          <Textarea
            placeholder="Describe what vehicles belong in this product ..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={isCreatingShop}
            className={` border-[#2a3744] text-white placeholder:text-gray-500 min-h-[120px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : ''
              }`}
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Upload Image */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Upload Image *</label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.svg"
            disabled={isCreatingShop}
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-white font-medium">Preview</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isCreatingShop}
                  className="p-1 hover:bg-[#2a3744] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>
              <div className="flex justify-center">
                <div className="relative w-64 h-64 overflow-hidden rounded-lg border border-[#2a3744]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                {selectedFile?.name} • {selectedFile && Math.round(selectedFile.size / 1024)}KB
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isCreatingShop && fileInputRef.current?.click()}
              className={` border-2 border-dashed rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer ${errors.image ? 'border-red-500' : 'border-[#2a3744]'
                } ${isCreatingShop ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-white font-medium mb-1">Click to upload product image</p>
                <p className="text-gray-400 text-sm">
                  Drag and drop or click to browse. Support for PNG, JPG, or SVG (Max 5MB)
                </p>
              </div>
            </div>
          )}

          {errors.image && (
            <p className="text-red-400 text-xs mt-1">{errors.image}</p>
          )}

          <div className="mt-2 text-xs text-gray-400">
            <p>Supported formats: JPG, PNG, SVG (Max 5MB)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isCreatingShop}
            variant="outline"
            className="bg-[#FF48481F] border-[#2a3744] text-red-500 hover:bg-[#2a3744] hover:text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreatingShop}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingShop ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Item
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}