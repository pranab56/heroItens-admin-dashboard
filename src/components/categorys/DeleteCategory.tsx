import { Button } from '@/components/ui/button';
import { useDeleteCategoryMutation } from '@/features/category/categoryApi';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { Category } from './types';

interface DeleteCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  refetch: () => void;
}

const DeleteCategory = ({ open, onOpenChange, category, refetch }: DeleteCategoryProps) => {
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleConfirmDelete = async () => {
    if (!category) return;

    try {
      const response = await deleteCategory({ id: category._id }).unwrap();
      onOpenChange(false);
      refetch();
      toast.success(response.message || "Category deleted successfully!")
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error((error as any)?.message || "Failed to delete category");
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <div className="bg-[#1a2942] rounded-xl p-8 w-full max-w-md mx-auto border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Delete Category?</h3>
          <p className="text-gray-400 text-sm">
            Are you sure you want to delete "{category?.name}"? This action cannot be undone and all associated data will be permanently removed.
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
            onClick={() => onOpenChange(false)}
            className="w-full bg-transparent hover:bg-gray-700/50 text-gray-300 border border-gray-600 h-11 rounded-lg font-medium"
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCategory;