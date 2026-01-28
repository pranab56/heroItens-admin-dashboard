"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useGetAllCarQuery } from '../../../../features/car/carApi';
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
  status: string;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  battleCost?: number;
  Reward?: number;
  ranking?: number;
  votes?: number;
  Top?: number;
}



// Main Component
export default function UserManagement() {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: apiResponse, isLoading } = useGetAllCarQuery({});
  const itemsPerPage = 9;

  // Extract cars from API response
  const cars: Car[] = apiResponse?.data || [];

  // Get owner's full name
  const getOwnerName = (car: Car): string => {
    return car.userId?.name || 'Unknown';
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter cars
  useEffect(() => {
    if (!cars.length) {
      setFilteredCars([]);
      return;
    }

    const filtered = cars.filter(car => {
      const ownerName = getOwnerName(car).toLowerCase();
      const manufacturer = car.manufacturer?.toLowerCase() || '';
      const modelName = car.modelName?.toLowerCase() || '';
      const year = car.year?.toLowerCase() || '';
      const date = formatDate(car.createdAt).toLowerCase();

      const matchesSearch = ownerName.includes(searchQuery.toLowerCase()) ||
        manufacturer.includes(searchQuery.toLowerCase()) ||
        modelName.includes(searchQuery.toLowerCase()) ||
        year.includes(searchQuery.toLowerCase()) ||
        date.includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [cars, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col bg-[#1C2936] p-4 rounded-lg md:flex-row gap-4 mb-6">
        <div className="flex w-5/12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search here..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12 bg-[#0d1829] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
          />
        </div>

        {/* <div className="w-full md:w-auto relative h-full">
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
        </div> */}
      </div>

      <div className="">
        {/* Cars List */}
        <div className="">
          {/* Header Row */}
          <div className="bg-[#243b5e] rounded-t-xl px-6 py-4 grid grid-cols-5 gap-4 text-sm font-medium text-gray-300">
            <div>Car Image</div>
            <div>Owner Name</div>
            <div>Date</div>
            <div>Manufacturer</div>
            <div>Model</div>
          </div>

          {/* Loading state for cars */}
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              Loading cars...
            </div>
          ) : currentCars.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {cars.length === 0
                ? "No cars available"
                : "No records found matching your criteria"
              }
            </div>
          ) : (
            currentCars.map((car) => (
              <div
                key={car._id}
                className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-4 grid grid-cols-5 gap-4 items-center transition-colors"
              >
                {/* Car Image */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage
                      src={baseURL + car.images?.[0] || "/placeholder-car.jpg"}
                      alt={`${car.manufacturer} ${car.modelName}`}
                      className="rounded-lg object-cover"
                    />
                    <AvatarFallback className="rounded-lg bg-gray-700 text-white">
                      {car.manufacturer?.substring(0, 1) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Owner Name */}
                <div className="text-white text-sm font-medium">
                  {getOwnerName(car)}
                </div>

                {/* Date */}
                <div className="text-gray-300 text-sm">
                  {formatDate(car.createdAt)}
                </div>

                {/* Manufacturer */}
                <div className="text-gray-300 text-sm">
                  {car.manufacturer}
                </div>

                {/* Model */}
                <div className="text-gray-300 text-sm">
                  {car.modelName} {car.year}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination - Only show if there are cars */}
        {filteredCars.length > 0 && (
          <div className="flex flex-col bg-[#1C2936] rounded-b-xl p-5 sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCars.length)} of {filteredCars.length} Records
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
    </div>
  );
}