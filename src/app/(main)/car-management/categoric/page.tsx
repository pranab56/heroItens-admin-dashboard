"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetAllCategoryQuery } from '@/features/category/categoryApi';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryTable from '../../../../components/categorys/CategoryTable';
import CreateCategory from '../../../../components/categorys/CreateCategory';
import DeleteCategory from '../../../../components/categorys/DeleteCategory';
import EditCategory from '../../../../components/categorys/EditCategory';
import { Category } from '../../../../components/categorys/types';
import { CustomLoading } from '../../../../hooks/CustomLoading';


// Main Component
export default function CategoryManagement() {
  // API Hooks
  const { data: apiResponse, isLoading: isFetching, refetch } = useGetAllCategoryQuery({});

  // Local State
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
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
    return <CustomLoading />
  }

  return (
    <div className="">
      {/* Search and Add Button */}
      <div className="flex flex-col justify-between md:flex-row gap-4 mb-6 rounded-lg bg-[#1C2936] p-4">
        <div className="flex w-6/12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Screen here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12 bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
          />
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
      <CategoryTable
        categories={currentCategories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        startIndex={startIndex}
        endIndex={endIndex}
        filteredCategories={filteredCategories}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onPageClick={handlePageClick}
        getPageNumbers={getPageNumbers}
        refetch={refetch}
      />

      {/* Modals */}
      <CreateCategory
        open={showAddModal}
        onOpenChange={handleCloseModals}
        refetch={refetch}
      />

      {selectedCategory && (
        <>
          <EditCategory
            open={showEditModal}
            onOpenChange={handleCloseModals}
            category={selectedCategory}
            refetch={refetch}
          />

          <DeleteCategory
            open={showDeleteModal}
            onOpenChange={handleCloseModals}
            category={selectedCategory}
            refetch={refetch}
          />
        </>
      )}
    </div>
  );
}