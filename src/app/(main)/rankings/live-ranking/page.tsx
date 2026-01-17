"use client";

import {
  Avatar,
  AvatarImage
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, RotateCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// Car Interface
interface Car {
  _id: string;
  image: string;
  carName: string;
  carModal: string;
  vote: number;
}

// Demo Data
const DEMO_CARS: Car[] = [
  {
    _id: "1",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    carName: "Hypercars",
    carModal: "W16 Quad-Turbo . France",
    vote: 5
  },
  {
    _id: "2",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    carName: "Hypercars",
    carModal: "W16 Quad-Turbo . France",
    vote: 5
  },
  {
    _id: "3",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    carName: "Hypercars",
    carModal: "W16 Quad-Turbo . France",
    vote: 5
  },
  {
    _id: "4",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    carName: "Hypercars",
    carModal: "W16 Quad-Turbo . France",
    vote: 5
  },
  {
    _id: "5",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    carName: "Hypercars",
    carModal: "W16 Quad-Turbo . France",
    vote: 5
  },
  {
    _id: "6",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    carName: "Hypercars",
    carModal: "W16 Quad-Turbo . France",
    vote: 5
  },
  {
    _id: "7",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    carName: "Hypercars",
    carModal: "W16 Quad-Turbo . France",
    vote: 5
  }
];

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
  const [cars] = useState<Car[]>(DEMO_CARS);
  const [filteredCars, setFilteredCars] = useState<Car[]>(DEMO_CARS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const itemsPerPage = 7;

  // Filter cars
  useEffect(() => {
    const filtered = cars.filter(car => {
      const searchLower = searchQuery.toLowerCase();
      return (
        car.carName.toLowerCase().includes(searchLower) ||
        car.carModal.toLowerCase().includes(searchLower)
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
    setShowDetailsModal(false);
    setShowRejectModal(true);
  };


  const handleConfirmReject = () => {
    console.log('Car rejected:', selectedCar);
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

  return (
    <div className="">
      {/* Search and Filter */}
      <div className="flex flex-col bg-[#1C2936] p-4 rounded-lg md:flex-row gap-4 mb-6">
        <div className="flex w-full md:w-5/12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Screen here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12 bg-[#0d1829] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
          />
        </div>

        <div className="w-full md:w-auto relative h-full">
          <Select onValueChange={() => { }}>
            <SelectTrigger className="w-full md:w-[200px] h-20 py-[23px] bg-[#0d1829] border-gray-700 text-white pl-4 rounded-lg cursor-pointer">
              <SelectValue placeholder="Category: Active" />
            </SelectTrigger>
            <SelectContent className='bg-[#1a2942] border-gray-700 text-white cursor-pointer'>
              <SelectItem value="2025">Active</SelectItem>
              <SelectItem value="2024">InActive</SelectItem>
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
            No records found matching your criteria
          </div>
        ) : (
          currentCars.map((car) => (
            <div
              key={car._id}
              className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-4 grid grid-cols-4 gap-4 items-center transition-colors"
            >
              <div className="text-white text-sm font-medium">#{car._id}</div>
              <div className='flex items-start gap-2'>
                <Avatar className="h-10 w-20 rounded-lg">
                  <AvatarImage src={car.image} alt={car.carName} className="rounded-lg object-cover" />

                </Avatar>
                <div>
                  <div className="text-white text-sm font-medium">{car.carName}</div>
                  <div className="text-white text-sm font-medium">{car.carModal}</div>
                </div>
              </div>

              <div className="text-white  text-sm font-medium">{car.vote}</div>


              <div className="flex gap-2">
                <button
                  onClick={() => handleRejectClick(car)}
                  className="p-2 cursor-pointer bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                  title="Reject"
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
            <h3 className="text-xl font-semibold text-white mb-2">Reset All Votes</h3>
            <p className="text-gray-400 text-sm">
              This action is irreversible. All current rankings, vote counts, and user data for the 'Hypercars' category permanently set to zero.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowRejectModal(false)}
              className="max-w-full px-16 bg-transparent hover:bg-gray-700/50 text-gray-300 border border-gray-600 h-11 rounded-lg font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReject}
              className="max-w-full px-16 bg-red-600 hover:bg-red-700 text-white h-11 rounded-lg font-medium"
            >
              Reset Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}