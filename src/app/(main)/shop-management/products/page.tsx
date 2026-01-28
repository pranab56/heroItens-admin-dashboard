"use client";

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAllShopQuery, useUpdateStatusMutation } from '@/features/shop/shopApi';
import {
  AlertCircle,
  Package,
  Plus,
  Search,
  Trophy
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../../../utils/BaseURL';

// Product Interface matching API Response
interface Product {
  _id: string;
  itemName: string;
  itemDescription: string;
  pointCost: number;
  discountCost: number;
  image: string;
  categoryType: string;
  userType: string;
  totalItem: number;
  volume: string;
  formula: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface StatsCardProps {
  icon: any;
  title: string;
  value: string;
  valueColor: string;
  bgColor: string;
}

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, valueColor, bgColor }: StatsCardProps) => {
  return (
    <Card className={`${bgColor} border-none p-0`}>
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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const { data: shopData, isLoading: isShopLoading, refetch } = useAllShopQuery({});
  const [updateStatus] = useUpdateStatusMutation();

  const itemsPerPage = 7;

  // Sync data from API
  useEffect(() => {
    if (shopData?.data?.data) {
      setProducts(shopData.data.data);
      setFilteredProducts(shopData.data.data);
    }
  }, [shopData]);

  // Filter products
  useEffect(() => {
    if (!products) return;
    const filtered = products.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.itemName.toLowerCase().includes(searchLower) ||
        product.categoryType?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery]);

  // Stats Data calculated from API response
  const statsData = [
    {
      id: 1,
      icon: Package,
      title: "Total Items",
      value: shopData?.data?.AllItemsLength?.toString() || "0",
      valueColor: "text-blue-400",
      bgColor: "bg-[#1C2936]"
    },
    {
      id: 2,
      icon: Trophy,
      title: "Active Rewards",
      value: shopData?.data?.avtiveItemsLength?.toString() || "0",
      valueColor: "text-blue-400",
      bgColor: "bg-[#1C2936]"
    },
    {
      id: 3,
      icon: AlertCircle,
      title: "Inactive Items",
      value: shopData?.data?.inactiveItemsLength?.toString() || "0",
      valueColor: "text-red-400",
      bgColor: "bg-[#1C2936]"
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      await updateStatus(productId).unwrap();
      toast.success("Status updated successfully");
      refetch(); // Refresh list to get updated status
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const handleAddCategory = () => {
    router.push("/shop-management/new");
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
              placeholder="Search products..."
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

        {/* Products Table */}
        <div className="rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1C2936] px-6 py-4 grid grid-cols-4 gap-4 text-sm font-medium text-gray-300">
            <div>Item Name</div>
            <div>Point Cost</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Rows */}
          {isShopLoading ? (
            <div className="bg-[#1C2936] p-8 text-center text-gray-400">Loading products...</div>
          ) : currentProducts.length === 0 ? (
            <div className="bg-[#1C2936] p-8 text-center text-gray-400">No products found</div>
          ) : (
            <div className="bg-[#1C2936]">
              {currentProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`hover:bg-[#233142] px-6 py-4 grid grid-cols-4 gap-4 items-center transition-colors ${index !== currentProducts.length - 1 ? 'border-b border-gray-700/50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-lg">
                      <AvatarImage
                        src={baseURL + product.image}
                        alt={product.itemName}
                        className="rounded-lg object-cover"
                      />
                    </Avatar>
                    <div>
                      <div className="text-white text-sm font-medium">{product.itemName}</div>
                      <div className="text-gray-400 text-xs">Category: {product.categoryType}</div>
                    </div>
                  </div>

                  <div className="text-white text-sm font-medium">{product.pointCost}</div>
                  <div className="text-white text-sm font-medium">{product.status}</div>

                  <div>
                    <Switch
                      checked={product.status === 'Active'}
                      onCheckedChange={() => handleToggleStatus(product._id)}
                      className="data-[state=checked]:bg-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1a2942] px-6 py-4 border-t border-gray-700/50">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} Products
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