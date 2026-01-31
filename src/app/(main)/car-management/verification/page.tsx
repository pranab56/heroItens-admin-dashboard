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
import { useApproveCarMutation, useGetAllCarQuery } from '../../../../features/car/carApi';
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  modelName: string;
  categoryName: string;
  battleCost: number;
  Reward: number;
  ranking: number;
  votes: number;
  Top: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    _id: string;
    name: string;
    battleCost: number;
    Reward: number;
  };
  description?: string;
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
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');

  const [loading, setLoading] = useState(true);

  // API hooks
  const { data: apiData, isLoading: carsLoading, refetch } = useGetAllCarQuery({});
  const [approveCar, { isLoading: approveLoading }] = useApproveCarMutation();

  const itemsPerPage = 7;

  // Fetch cars from API
  useEffect(() => {
    if (apiData?.success && apiData.data) {
      setCars(apiData.data);
      setFilteredCars(apiData.data);
      setLoading(false);
    }
  }, [apiData]);

  // Filter cars based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCars(cars);
      setCurrentPage(1);
      return;
    }

    const filtered = cars.filter(car => {
      const searchLower = searchQuery.toLowerCase();
      return (
        car.userId.name.toLowerCase().includes(searchLower) ||
        car.manufacturer.toLowerCase().includes(searchLower) ||
        car.modelName.toLowerCase().includes(searchLower) ||
        car.year.toLowerCase().includes(searchLower) ||
        car.status.toLowerCase().includes(searchLower)
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
    if (car.images && car.images.length > 0) {
      setMainImage(car.images[0]); // Set initial main image
    }
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

  const handleConfirmApprove = async () => {
    if (!selectedCar) return;

    try {
      const response = await approveCar(selectedCar._id).unwrap();

      if (response.success) {
        // Update local state
        setCars(prevCars =>
          prevCars.map(car =>
            car._id === selectedCar._id
              ? { ...car, status: 'APPROVED' }
              : car
          )
        );

        // Show success message (you can add a toast notification here)
        console.log('Car approved successfully');

        // Refetch data to ensure consistency
        refetch();
      }
    } catch (error) {
      console.error('Failed to approve car:', error);
      // Handle error (show error toast)
    }

    setShowApproveModal(false);
    setSelectedCar(null);
    setMainImage('');
  };

  const handleConfirmReject = async () => {
    if (!selectedCar) return;

    try {
      const response = await approveCar(selectedCar._id).unwrap();

      if (response.success) {
        // Update local state
        setCars(prevCars =>
          prevCars.map(car =>
            car._id === selectedCar._id
              ? { ...car, status: 'REJECTED' }
              : car
          )
        );

        // Show success message
        console.log('Car rejected successfully');

        // Refetch data to ensure consistency
        refetch();
      }
    } catch (error) {
      console.error('Failed to reject car:', error);
      // Handle error
    }

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
    if (!selectedCar || !selectedCar.images || selectedCar.images.length === 0) return;

    const currentIndex = selectedCar.images.indexOf(mainImage);
    const nextIndex = (currentIndex + 1) % selectedCar.images.length;
    setMainImage(selectedCar.images[nextIndex]);
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate time since submission
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  // Check if approve button should be disabled
  const isApproveDisabled = (car: Car) => car.status === 'APPROVED';

  // Check if reject button should be disabled
  const isRejectDisabled = (car: Car) => car.status === 'REJECTED';

  if (loading || carsLoading) {
    return <CustomLoading />
  }

  return (
    <div className="">
      {/* Search and Filter */}
      <div className="flex flex-col bg-[#1C2936] p-4 rounded-lg md:flex-row gap-4 mb-6">
        <div className="flex w-full md:w-5/12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search by owner, manufacturer, model, or year"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12 bg-[#0d1829] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
          />
        </div>

        <div className="w-full md:w-auto relative h-full">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={20} />
          <Select onValueChange={() => { }}>
            <SelectTrigger className="w-full md:w-[200px] h-20 py-[23px] bg-[#0d1829] border-gray-700 text-white pl-12 rounded-lg cursor-pointer">
              <SelectValue placeholder="Filter: All Status" />
            </SelectTrigger>
            <SelectContent className='bg-[#1a2942] border-gray-700 text-white cursor-pointer'>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
          <div>Manufacturer</div>
          <div>Model</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        {currentCars.length === 0 ? (
          <div className="bg-[#1C2936] py-12 text-center text-gray-500">
            {cars.length === 0 ? 'No cars found' : 'No records found matching your criteria'}
          </div>
        ) : (
          currentCars.map((car) => (
            <div
              key={car._id}
              className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-2 grid grid-cols-6 gap-4 items-center transition-colors"
            >
              <div>
                <Avatar className="h-16 w-20 rounded-lg">
                  {car.images && car.images.length > 0 ? (
                    <AvatarImage
                      src={baseURL + car.images[0]}
                      alt={`${car.manufacturer} ${car.modelName}`}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg bg-gray-700 text-white">
                      {car.manufacturer[0]}{car.modelName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="text-white text-sm font-medium">{car.userId.name}</div>
              <div className="text-gray-300 text-sm">{formatDate(car.createdAt)}</div>
              <div className="text-gray-300 text-sm">{car.manufacturer}</div>
              <div className="text-gray-300 text-sm">{car.modelName}</div>

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
                  disabled={isApproveDisabled(car)}
                  className={`p-2 cursor-pointer rounded-lg transition-colors ${isApproveDisabled(car)
                    ? 'bg-gray-600/20 cursor-not-allowed opacity-50'
                    : 'bg-green-600/20 hover:bg-green-600/30'
                    }`}
                  title={isApproveDisabled(car) ? "Already Approved" : "Approve"}
                >
                  <Check
                    size={18}
                    className={isApproveDisabled(car) ? "text-gray-400" : "text-green-400"}
                  />
                </button>
                <button
                  onClick={() => handleRejectClick(car)}
                  disabled={isRejectDisabled(car)}
                  className={`p-2 cursor-pointer rounded-lg transition-colors ${isRejectDisabled(car)
                    ? 'bg-gray-600/20 cursor-not-allowed opacity-50'
                    : 'bg-red-600/20 hover:bg-red-600/30'
                    }`}
                  title={isRejectDisabled(car) ? "Already Rejected" : "Reject"}
                >
                  <X
                    size={18}
                    className={isRejectDisabled(car) ? "text-gray-400" : "text-red-400"}
                  />
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
              {selectedCar.images && selectedCar.images.length > 0 ? (
                <>
                  <div
                    className="relative h-[400px] rounded-xl overflow-hidden mb-4 cursor-pointer group"
                    onClick={handleMainImageClick}
                  >
                    <Image
                      src={baseURL + mainImage}
                      alt={`${selectedCar.manufacturer} ${selectedCar.modelName}`}
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
                    <span>Image {selectedCar.images.indexOf(mainImage) + 1} of {selectedCar.images.length}</span>
                    <div className="flex items-center gap-1">
                      {selectedCar.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedCar.images.indexOf(mainImage) === index ? 'bg-cyan-400' : 'bg-gray-600'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 gap-3">
                    {selectedCar.images.map((image, index) => (

                      <div
                        key={index}
                        className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${mainImage === image ? 'border-cyan-400' : 'border-transparent'
                          }`}
                        onClick={() => handleThumbnailClick(image)}
                      >
                        <img
                          src={baseURL + image}
                          alt={`${index + 1}`}
                          // fill
                          className="object-cover hover:scale-110 transition-transform duration-200"
                          sizes="(max-width: 768px) 25vw, 12.5vw"
                        />
                        {mainImage === image && (
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
                </>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-gray-800 rounded-xl">
                  <div className="text-gray-500">No images available</div>
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div className="w-1/2 bg-[#0f1c2e] p-6 overflow-y-auto">
              <div className="mb-6">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedCar.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                  selectedCar.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                  {selectedCar.status}
                </div>
                <h3 className="text-sm text-gray-400 mt-2">Submitted {getTimeSince(selectedCar.createdAt)}</h3>
                <p className="text-xs text-gray-500">Created: {formatDate(selectedCar.createdAt)}</p>
                <p className="text-xs text-gray-500">Last Updated: {formatDate(selectedCar.updatedAt)}</p>
              </div>

              {/* Owner Information */}
              <div className="bg-[#1a2942] rounded-xl p-4 mb-6 border border-gray-700">
                <h4 className="text-white font-medium mb-3">Owner Information</h4>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-full">
                    <AvatarFallback className="bg-gray-700 text-white">
                      {selectedCar.userId.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{selectedCar.userId.name}</p>
                    <p className="text-xs text-gray-400">User ID: {selectedCar.userId._id}</p>
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="bg-[#1a2942] rounded-xl p-4 mb-6 border border-gray-700">
                <h4 className="text-white font-medium mb-4">Car Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Manufacturer</p>
                    <p className="text-white font-medium">{selectedCar.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Model</p>
                    <p className="text-white font-medium">{selectedCar.modelName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Year</p>
                    <p className="text-white font-medium">{selectedCar.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Category</p>
                    <p className="text-white font-medium">{selectedCar.categoryName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Battle Cost</p>
                    <p className="text-white font-medium">${selectedCar.battleCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Reward</p>
                    <p className="text-white font-medium">${selectedCar.Reward}</p>
                  </div>
                </div>
                {selectedCar.description && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-white text-sm">{selectedCar.description}</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="bg-[#1a2942] rounded-xl p-4 mb-6 border border-gray-700">
                <h4 className="text-white font-medium mb-4">Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Ranking</p>
                    <p className="text-white font-medium">{selectedCar.ranking}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Votes</p>
                    <p className="text-white font-medium">{selectedCar.votes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Top</p>
                    <p className="text-white font-medium">{selectedCar.Top}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleApproveClick(selectedCar)}
                  disabled={isApproveDisabled(selectedCar)}
                  className={`w-full h-12 rounded-lg font-medium ${isApproveDisabled(selectedCar)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {isApproveDisabled(selectedCar) ? 'Already Approved' : 'Approve Car'}
                </Button>
                <Button
                  onClick={() => handleRejectClick(selectedCar)}
                  disabled={isRejectDisabled(selectedCar)}
                  className={`w-full h-12 rounded-lg font-medium ${isRejectDisabled(selectedCar)
                    ? 'bg-gray-600/20 cursor-not-allowed text-gray-400 border border-gray-600'
                    : 'bg-transparent hover:bg-red-600/10 text-red-400 border border-red-600/50'
                    }`}
                >
                  {isRejectDisabled(selectedCar) ? 'Already Rejected' : 'Reject Car'}
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
              Are you sure you want to approve {selectedCar?.manufacturer} {selectedCar?.modelName}?
              This action will make the car visible to all users.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmApprove}
              disabled={approveLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-11 rounded-lg font-medium disabled:opacity-50"
            >
              {approveLoading ? 'Approving...' : 'Yes, Approve'}
            </Button>
            <Button
              onClick={() => setShowApproveModal(false)}
              disabled={approveLoading}
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
              Are you sure you want to reject {selectedCar?.manufacturer} {selectedCar?.modelName}?
              This action cannot be undone and the owner will be notified.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmReject}
              disabled={approveLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-lg font-medium disabled:opacity-50"
            >
              {approveLoading ? 'Rejecting...' : 'Yes, Reject'}
            </Button>
            <Button
              onClick={() => setShowRejectModal(false)}
              disabled={approveLoading}
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