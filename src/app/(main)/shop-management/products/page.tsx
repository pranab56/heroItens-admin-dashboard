"use client";

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  AlertCircle,
  Package,
  Plus,
  Search,
  Trophy
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Category Interface
interface Category {
  _id: string;
  itemName: string;
  category: string;
  pointCost: number;
  status: boolean;
  image: string;
}

// Demo Data
const DEMO_CATEGORIES: Category[] = [
  {
    _id: "1",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: true,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop"
  },
  {
    _id: "2",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: false,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=80&h=80&fit=crop"
  },
  {
    _id: "3",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: true,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=80&h=80&fit=crop"
  },
  {
    _id: "4",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: true,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=80&h=80&fit=crop"
  },
  {
    _id: "5",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: true,
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=80&h=80&fit=crop"
  },
  {
    _id: "6",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: false,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=80&h=80&fit=crop"
  },
  {
    _id: "7",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: true,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=80&h=80&fit=crop"
  },
  {
    _id: "8",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: true,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop"
  },
  {
    _id: "9",
    itemName: "Vintage Mustang Badge",
    category: "Badges",
    pointCost: 1200,
    status: true,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=80&h=80&fit=crop"
  }
];

// Stats Data
const statsData = [
  {
    id: 1,
    icon: Package,
    title: "Total Items",
    value: "780",
    valueColor: "text-blue-400",
    bgColor: "bg-[#1C2936]"
  },
  {
    id: 2,
    icon: Trophy,
    title: "Active Rewards",
    value: "98",
    valueColor: "text-blue-400",
    bgColor: "bg-[#1C2936]"
  },
  {
    id: 3,
    icon: AlertCircle,
    title: "Out of Stock",
    value: "5",
    valueColor: "text-red-400",
    bgColor: "bg-[#1C2936]"
  }
];








// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, valueColor, bgColor }) => {
  return (
    <Card className={`${bgColor} border-none`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#137FEC1F] rounded-lg">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-xs font-medium mb-1">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const itemsPerPage = 7;

  // Filter categories
  useEffect(() => {
    const filtered = categories.filter(category => {
      const searchLower = searchQuery.toLowerCase();
      return category.itemName.toLowerCase().includes(searchLower) ||
        category.category.toLowerCase().includes(searchLower);
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

  const handleToggleStatus = (categoryId: string) => {
    setCategories(categories.map(cat =>
      cat._id === categoryId ? { ...cat, status: !cat.status } : cat
    ));
  };

  const handleAddCategory = () => {
    setShowAddModal(true);
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

  return (
    <div className="">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsData.map((stat) => (
            <StatsCard
              key={stat.id}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              valueColor={stat.valueColor}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 rounded-lg bg-[#1C2936] p-4">
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <Input
              placeholder="Screen here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-12 bg-[#1C2936] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
            />
          </div>

          <Button
            onClick={handleAddCategory}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Product
          </Button>
        </div>

        {/* Categories Table */}
        <div className="rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1C2936] px-6 py-4 grid grid-cols-3 gap-4 text-sm font-medium text-gray-300">
            <div>Item Name</div>
            <div>Point Cost</div>
            <div>Status</div>
          </div>

          {/* Rows */}
          <div className="bg-[#1C2936]">
            {currentCategories.map((category, index) => (
              <div
                key={category._id}
                className={`hover:bg-[#1C2936] px-6 py-4 grid grid-cols-3 gap-4 items-center transition-colors ${index !== currentCategories.length - 1 ? 'border-b border-gray-700/50' : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage
                      src={category.image}
                      alt={category.itemName}
                      className="rounded-lg object-cover"
                    />
                  </Avatar>
                  <div>
                    <div className="text-white text-sm font-medium">{category.itemName}</div>
                    <div className="text-gray-400 text-xs">Category: {category.category}</div>
                  </div>
                </div>

                <div className="text-white text-sm font-medium">{category.pointCost}</div>

                <div>
                  <Switch
                    checked={category.status}
                    onCheckedChange={() => handleToggleStatus(category._id)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {filteredCategories.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1a2942] px-6 py-4 border-t border-gray-700/50">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} Category
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-[#243b5e] h-10 px-4 rounded-lg"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'ghost'}
                    className={`h-10 min-w-10 rounded-lg ${page === currentPage
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-300 hover:text-white hover:bg-[#243b5e]'
                      }`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-[#243b5e] h-10 px-4 rounded-lg"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}