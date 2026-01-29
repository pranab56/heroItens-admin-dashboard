import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUpdateCategoryMutation } from '@/features/category/categoryApi';
import { Pencil, Trash2 } from 'lucide-react';
import { Category } from './types';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  startIndex: number;
  endIndex: number;
  filteredCategories: Category[];
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
  getPageNumbers: () => (number | string)[];
  refetch: () => void;
}

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
  startIndex,
  endIndex,
  filteredCategories,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageClick,
  getPageNumbers,
  refetch
}: CategoryTableProps) => {
  const [updateCategory] = useUpdateCategoryMutation();

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

  return (
    <div>
      {/* Header */}
      <div className="bg-[#243b5e] rounded-t-xl px-6 py-4 grid grid-cols-4 gap-4 text-sm font-medium text-gray-300">
        <div>Category Name</div>
        <div>Total Cars</div>
        <div>Voting Active</div>
        <div>Action</div>
      </div>

      {/* Rows */}
      {categories.length > 0 ? (
        categories.map((category) => (
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
                onClick={() => onEdit(category)}
                className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors cursor-pointer"
                title="Edit"
              >
                <Pencil size={18} className="text-green-400" />
              </button>
              <button
                onClick={() => onDelete(category)}
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
              onClick={onPrevPage}
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
                onClick={() => typeof page === 'number' && onPageClick(page)}
                disabled={typeof page !== 'number'}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-[#243b5e] h-10 px-4"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;