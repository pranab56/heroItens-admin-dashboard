import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategoryMutation } from '@/features/category/categoryApi';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { ImageUploadPreview } from './ImageUploadPreview';
import { Modal } from './Modal';
import { FormData as CategoryForm } from './types';

interface CreateCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const CreateCategory = ({ open, onOpenChange, refetch }: CreateCategoryProps) => {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    Reward: '',
    categorySlug: '',
    description: '',
    battleCost: '',
    image: null
  });

  const handleFormChange = (field: string, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {


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

      const response = await createCategory(formDataToSend).unwrap();
      console.log(response);
      onOpenChange(false);
      refetch();
      // alert('Category created successfully!');
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category');
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <div className="bg-[#0f1c2e] rounded-xl w-full max-w-3xl mx-auto p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Create New Category</h2>
            <p className="text-gray-400 text-sm">Define a new automotive segment for the ranking platform.</p>
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
            onClick={() => onOpenChange(false)}
            className="bg-transparent hover:bg-red-600/10 text-red-400 border border-red-600/50 h-11 px-6 rounded-lg"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
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
  );
};

export default CreateCategory;