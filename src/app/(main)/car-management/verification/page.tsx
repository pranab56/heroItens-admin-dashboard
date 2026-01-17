"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Check, Eye, Filter, Search, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Car Interface
interface Car {
  _id: string;
  image: string;
  ownerName: string;
  ownerProfile: string;
  ownerMemberSince: string;
  date: string;
  make: string;
  model: string;
  year: string;
  caseNumber: string;
  submittedTime: string;
  thumbnails: string[];
}

// Demo Data
const DEMO_CARS: Car[] = [
  {
    _id: "1",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop",
    ownerName: "Jane Cooper",
    ownerProfile: "/profiles/jane.jpg",
    ownerMemberSince: "May 2020",
    date: "October 24, 2025",
    make: "Ford",
    model: "Mustang 2022",
    year: "2022",
    caseNumber: "8829",
    submittedTime: "2 hours ago",
    thumbnails: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop"
    ]
  },
  {
    _id: "2",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
    ownerName: "John Doe",
    ownerProfile: "/profiles/john.jpg",
    ownerMemberSince: "June 2021",
    date: "October 25, 2025",
    make: "Tesla",
    model: "Model S",
    year: "2023",
    caseNumber: "8830",
    submittedTime: "3 hours ago",
    thumbnails: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566470469039-6d61f50a05e0?w=400&h=300&fit=crop"
    ]
  },
  {
    _id: "3",
    image: "https://images.unsplash.com/photo-1566470469039-6d61f50a05e0?w=600&h=400&fit=crop",
    ownerName: "Robert Johnson",
    ownerProfile: "/profiles/robert.jpg",
    ownerMemberSince: "March 2019",
    date: "October 26, 2025",
    make: "Chevrolet",
    model: "Corvette Stingray",
    year: "2024",
    caseNumber: "8831",
    submittedTime: "5 hours ago",
    thumbnails: [
      "https://images.unsplash.com/photo-1566470469039-6d61f50a05e0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop"
    ]
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
  const [mainImage, setMainImage] = useState<string>('');

  const itemsPerPage = 7;

  // Filter cars
  useEffect(() => {
    const filtered = cars.filter(car => {
      const searchLower = searchQuery.toLowerCase();
      return (
        car.ownerName.toLowerCase().includes(searchLower) ||
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.date.toLowerCase().includes(searchLower)
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

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setMainImage(car.image); // Set initial main image
    setShowDetailsModal(true);
  };

  const handleApproveClick = (car: Car) => {
    setSelectedCar(car);
    setShowDetailsModal(false);
    setShowApproveModal(true);
  };

  const handleRejectClick = (car: Car) => {
    setSelectedCar(car);
    setShowDetailsModal(false);
    setShowRejectModal(true);
  };

  const handleConfirmApprove = () => {
    console.log('Car approved:', selectedCar);
    setShowApproveModal(false);
    setSelectedCar(null);
    setMainImage('');
  };

  const handleConfirmReject = () => {
    console.log('Car rejected:', selectedCar);
    setShowRejectModal(false);
    setSelectedCar(null);
    setMainImage('');
  };

  // Handle thumbnail click
  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  // Handle main image click to cycle through images
  const handleMainImageClick = () => {
    if (!selectedCar) return;

    const allImages = [selectedCar.image, ...selectedCar.thumbnails];
    const currentIndex = allImages.indexOf(mainImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setMainImage(allImages[nextIndex]);
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
        </div>
      </div>

      {/* Cars Table */}
      <div>
        {/* Header */}
        <div className="bg-[#243b5e] rounded-t-xl px-6 py-4 grid grid-cols-6 gap-4 text-sm font-medium text-gray-300">
          <div>Car Image</div>
          <div>Owner Name</div>
          <div>Date</div>
          <div>Make</div>
          <div>Model</div>
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
              className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-2 grid grid-cols-6 gap-4 items-center transition-colors"
            >
              <div>
                <Avatar className="h-16 w-20 rounded-lg">
                  <AvatarImage src={car.image} alt={car.model} className="rounded-lg object-cover" />
                  <AvatarFallback className="rounded-lg bg-gray-700 text-white">
                    {car.make[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-white text-sm font-medium">{car.ownerName}</div>
              <div className="text-gray-300 text-sm">{car.date}</div>
              <div className="text-gray-300 text-sm">{car.make}</div>
              <div className="text-gray-300 text-sm">{car.model}</div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(car)}
                  className="p-2 cursor-pointer bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye size={18} className="text-blue-400" />
                </button>
                <button
                  onClick={() => handleApproveClick(car)}
                  className="p-2 cursor-pointer bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors"
                  title="Approve"
                >
                  <Check size={18} className="text-green-400" />
                </button>
                <button
                  onClick={() => handleRejectClick(car)}
                  className="p-2 cursor-pointer bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                  title="Reject"
                >
                  <X size={18} className="text-red-400" />
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

      {/* Car Details Modal */}
      <Modal open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        {selectedCar && (
          <div className="bg-[#0f1c2e] rounded-xl w-[90vw] max-w-4xl max-h-[90vh] overflow-hidden flex">
            {/* Left Side - Car Image */}
            <div className="w-1/2 bg-[#1a2942] p-6 flex flex-col">
              {/* Main Image */}
              <div
                className="relative h-[400px] rounded-xl overflow-hidden mb-4 cursor-pointer group"
                onClick={handleMainImageClick}
              >
                <Image
                  src={mainImage}
                  alt={selectedCar.model}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white">
                    Click to view next image
                  </div>
                </div>
              </div>

              {/* Image Counter */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                <span>Image {[selectedCar.image, ...selectedCar.thumbnails].indexOf(mainImage) + 1} of {selectedCar.thumbnails.length + 1}</span>
                <div className="flex items-center gap-1">
                  {[selectedCar.image, ...selectedCar.thumbnails].map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${[selectedCar.image, ...selectedCar.thumbnails].indexOf(mainImage) === index ? 'bg-cyan-400' : 'bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {/* Original Main Image Thumbnail */}
                <div
                  className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${mainImage === selectedCar.image ? 'border-cyan-400' : 'border-transparent'}`}
                  onClick={() => handleThumbnailClick(selectedCar.image)}
                >
                  <Image
                    src={selectedCar.image}
                    alt="Main image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                  {mainImage === selectedCar.image && (
                    <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {selectedCar.thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${mainImage === thumb ? 'border-cyan-400' : 'border-transparent'}`}
                    onClick={() => handleThumbnailClick(thumb)}
                  >
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-200"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                    {mainImage === thumb && (
                      <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Tips */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Click on thumbnails to view full image • Click on main image for next</p>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="w-1/2 bg-[#0f1c2e] p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-sm text-gray-400 mb-1">Case #{selectedCar.caseNumber}</h3>
                <p className="text-xs text-gray-500">Submitted {selectedCar.submittedTime}</p>
              </div>

              {/* Owner Information */}
              <div className="bg-[#1a2942] rounded-xl p-4 mb-6 border border-gray-700">
                <h4 className="text-white font-medium mb-3">Owner Information</h4>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-full">
                    <AvatarImage src={selectedCar.ownerProfile} alt={selectedCar.ownerName} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {selectedCar.ownerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{selectedCar.ownerName}</p>
                    <p className="text-xs text-gray-400">Member since {selectedCar.ownerMemberSince}</p>
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="bg-[#1a2942] rounded-xl p-4 mb-6 border border-gray-700">
                <h4 className="text-white font-medium mb-4">Car Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Make & Model</p>
                    <p className="text-white font-medium">{selectedCar.make} {selectedCar.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Year</p>
                    <p className="text-white font-medium">{selectedCar.year}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleApproveClick(selectedCar)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-lg font-medium"
                >
                  Approve Car
                </Button>
                <Button
                  onClick={() => handleRejectClick(selectedCar)}
                  className="w-full bg-transparent hover:bg-red-600/10 text-red-400 border border-red-600/50 h-12 rounded-lg font-medium"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Confirmation Modal */}
      <Modal open={showApproveModal} onOpenChange={setShowApproveModal}>
        <div className="bg-[#1a2942] rounded-xl p-8 w-[90vw] max-w-md border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Approve This Car?</h3>
            <p className="text-gray-400 text-sm">
              Are you sure you want to approve this car? This action will make the car visible to all users.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmApprove}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-11 rounded-lg font-medium"
            >
              Yes, Approve
            </Button>
            <Button
              onClick={() => setShowApproveModal(false)}
              className="w-full bg-transparent hover:bg-gray-700/50 text-gray-300 border border-gray-600 h-11 rounded-lg font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal open={showRejectModal} onOpenChange={setShowRejectModal}>
        <div className="bg-[#1a2942] rounded-xl p-8 w-[90vw] max-w-md border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Reject This Car?</h3>
            <p className="text-gray-400 text-sm">
              Are you sure you want to reject this car? This action cannot be undone and the owner will be notified.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmReject}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-lg font-medium"
            >
              Yes, Reject
            </Button>
            <Button
              onClick={() => setShowRejectModal(false)}
              className="w-full bg-transparent hover:bg-gray-700/50 text-gray-300 border border-gray-600 h-11 rounded-lg font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}