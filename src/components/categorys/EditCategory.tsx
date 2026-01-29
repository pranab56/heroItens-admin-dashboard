import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateCategoryMutation } from '@/features/category/categoryApi';
import { Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { baseURL } from '../../utils/BaseURL';
import { ImageUploadPreview } from './ImageUploadPreview';
import { Modal } from './Modal';
import { Category, FormData as CategoryForm } from './types';


interface EditCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  refetch: () => void;
}

const EditCategory = ({ open, onOpenChange, category, refetch }: EditCategoryProps) => {
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [formData, setFormData] = useState<CategoryForm>({
    name: category.name,
    Reward: category.Reward.toString(),
    categorySlug: category.categorySlug,
    description: category.description,
    battleCost: category.battleCost.toString(),
    image: category.image
  });

  const handleFormChange = (field: string, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
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

      await updateCategory({ id: category._id, data: formDataToSend }).unwrap();
      onOpenChange(false);
      refetch();
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category');
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <div className="bg-[#0f1c2e] rounded-xl w-full max-w-3xl mx-auto p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Edit Category</h2>
            <p className="text-gray-400 text-sm">Update the automotive segment information.</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
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
            image={baseURL + formData.image}
            onImageChange={(image) => handleFormChange('image', image as File)}
            onRemove={() => handleFormChange('image', null as any)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-transparent hover:bg-red-600/10 text-red-400 border border-red-600/50 h-11 px-6 rounded-lg"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
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
  );
};

export default EditCategory;