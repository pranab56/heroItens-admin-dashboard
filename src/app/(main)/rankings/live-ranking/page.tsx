"use client";

import {
  Avatar,
  AvatarImage
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllCarQuery, useResetCarMutation } from '@/features/car/carApi';
import { AlertTriangle, RotateCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CustomLoading } from '../../../../hooks/CustomLoading';
import { baseURL } from '../../../../utils/BaseURL';

// Car Interface based on API response
interface Car {
  _id: string;
  images: string[];
  userId: {
    _id: string;
    name: string;
  };
  manufacturer: string;
  year: string;
  modelName: string;
  votes: number;
  ranking: number;
  status: string;
  battleCost?: number;
  Reward?: number;
  Top?: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Interface
interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Car[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// Modal Components
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({ open, onOpenChange, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70 animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 animate-in zoom-in-95 fade-in duration-200">
        {children}
      </div>
    </div>
  );
};

// Main Component
export default function CarManagement() {
  const { data: apiResponse, isLoading } = useGetAllCarQuery({});
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [resetCar, { isLoading: resetLoading }] = useResetCarMutation();

  const itemsPerPage = 7;

  // Transform API data when it loads
  useEffect(() => {
    if (apiResponse?.success && apiResponse.data) {
      setCars(apiResponse.data);
      setFilteredCars(apiResponse.data);
    }
  }, [apiResponse]);

  // Filter cars based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCars(cars);
      setCurrentPage(1);
      return;
    }



    const searchLower = searchQuery.toLowerCase();
    const filtered = cars.filter(car => {
      return (
        car.manufacturer?.toLowerCase().includes(searchLower) ||
        car.modelName?.toLowerCase().includes(searchLower) ||
        car.year?.toString().includes(searchQuery) ||
        car.userId?.name?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [cars, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);



  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRejectClick = (car: Car) => {
    setSelectedCar(car);
    setShowRejectModal(true);
  };


  useEffect(() => {
    if (!searchQuery.trim() && selectedStatus === 'all') {
      setFilteredCars(cars);
      setCurrentPage(1);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = cars.filter(car => {
      // Search filter
      const matchesSearch = searchQuery.trim() === '' ||
        car.manufacturer?.toLowerCase().includes(searchLower) ||
        car.modelName?.toLowerCase().includes(searchLower) ||
        car.year?.toString().includes(searchQuery) ||
        car.userId?.name?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = selectedStatus === 'all' || car.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [cars, searchQuery, selectedStatus]);

  const handleConfirmReject = async () => {

    try {
      const response = await resetCar(selectedCar?._id).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }


    setShowRejectModal(false);
    setSelectedCar(null);
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

  // Get first image or placeholder
  const getCarImage = (car: Car) => {
    if (car.images && car.images.length > 0) {
      return baseURL + car.images[0];
    }
    return "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop";
  };

  // Format car name
  const getCarName = (car: Car) => {
    return `${car.manufacturer} ${car.modelName}`;
  };

  // Format car model info
  const getCarModelInfo = (car: Car) => {
    return `${car.year} • ${car.categoryName || 'No Category'}`;
  };

  if (isLoading) {
    return <CustomLoading />
  }

  return (
    <div className="">
      {/* Search and Filter */}
      <div className="flex flex-col bg-[#1C2936] p-4 rounded-lg md:flex-row gap-4 mb-6">
        <div className="flex w-full md:w-5/12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search by car name, model, year or owner..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12  border-gray-500 placeholder:text-gray-300 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
          />
        </div>

        <div className="w-full md:w-auto relative h-full">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-full md:w-[200px] h-12 py-6 border-gray-500 text-white pl-4 rounded-lg cursor-pointer">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent className='bg-[#1a2942] border-gray-700 text-white cursor-pointer'>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cars Table */}
      <div>
        {/* Header */}
        <div className="bg-[#243b5e] rounded-t-xl px-6 py-4 grid grid-cols-4 gap-4 text-sm font-medium text-gray-300">
          <div>Rank</div>
          <div>Car Name</div>
          <div>Total Votes</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        {currentCars.length === 0 ? (
          <div className="bg-[#1C2936] py-12 text-center text-gray-500">
            {cars.length === 0 ? "No cars found" : "No records found matching your criteria"}
          </div>
        ) : (
          currentCars.map((car, index) => (
            <div
              key={car._id}
              className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-4 grid grid-cols-4 gap-4 items-center transition-colors"
            >
              <div className="text-white text-sm font-medium">
                #{car.ranking || startIndex + index + 1}
              </div>
              <div className='flex items-start gap-2'>
                <Avatar className="h-10 w-20 rounded-lg">
                  <AvatarImage
                    src={getCarImage(car)}
                    alt={getCarName(car)}
                    className="rounded-lg object-cover"
                  />
                </Avatar>
                <div>
                  <div className="text-white text-sm font-medium">{getCarName(car)}</div>
                  <div className="text-gray-400 text-xs">{getCarModelInfo(car)}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    Owner: {car.userId?.name || 'Unknown'}
                  </div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${car.status === 'APPROVED' ? 'bg-green-900/30 text-green-400' :
                    car.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                    {car.status}
                  </div>
                </div>
              </div>

              <div className="text-white text-sm font-medium">
                {car.votes || 0} votes
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRejectClick(car)}
                  className="p-2 cursor-pointer bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                  title="Reset Votes"
                >
                  <RotateCw size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {filteredCars.length > 0 && (
          <div className="flex flex-col bg-[#1C2936] rounded-b-xl p-5 sm:flex-row items-center justify-between gap-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCars.length)} of {filteredCars.length} Cars
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

      {/* Reject Confirmation Modal */}
      <Modal open={showRejectModal} onOpenChange={setShowRejectModal}>
        <div className="bg-[#1a2942] rounded-xl p-8 w-[90vw] max-w-md border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Reset Votes for {selectedCar ? `${selectedCar.manufacturer} ${selectedCar.modelName}` : 'this car'}
            </h3>
            <p className="text-gray-400 text-sm">
              This action will reset all votes for this car back to zero. This action is irreversible.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowRejectModal(false)}
              className="flex-1 bg-transparent hover:bg-gray-700/50 text-gray-300 border border-gray-600 h-11 rounded-lg font-medium"
              disabled={resetLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-11 rounded-lg font-medium"
              disabled={resetLoading}
            >
              {resetLoading ? 'Resetting...' : 'Reset Now'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}