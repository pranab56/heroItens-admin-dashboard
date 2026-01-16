"use client";

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Input } from '../../../../components/ui/input';

// User Interface
interface User {
  _id: string;
  carName: string;
  vote: number;
  isActive?: boolean; // Add optional property
  isDeleted?: boolean; // Add optional property
}

// Demo Data
const DEMO_USERS: User[] = [
  {
    _id: "9",
    carName: "Car 9",
    vote: 9,
    isActive: true,
    isDeleted: false
  },
  // Additional users for pagination demo
  ...Array.from({ length: 39 }, (_, i) => ({
    _id: `${i + 10}`,
    carName: `Car ${i + 10}`,
    vote: i + 10,
    isActive: i % 3 !== 0, // Some users inactive
    isDeleted: false
  }))
];

// Main Component
export default function UserManagement() {
  const [users] = useState<User[]>(DEMO_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(DEMO_USERS);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 9;


  // Filter users
  useEffect(() => {
    const filtered = users.filter(user => {
      const userName = user.carName.toLowerCase();
      const userCarName = user.carName.toLowerCase();
      const userId = user._id;

      const matchesSearch = userName.includes(searchQuery.toLowerCase()) ||
        userCarName.includes(searchQuery.toLowerCase()) ||
        userId.includes(searchQuery);

      const matchesStatus = statusFilter === 'All' ||
        (statusFilter === 'Active' && user.isActive) ||
        (statusFilter === 'Inactive' && !user.isActive);

      return matchesSearch && matchesStatus && !user.isDeleted;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Status filter handler
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
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

  return (
    <div className="">
      <div className="flex flex-col bg-[#1C2936] p-4 rounded-lg md:flex-row gap-4 mb-6">
        <div className="flex w-full md:w-5/12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12 bg-[#0d1829] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
          />
        </div>
      </div>

      <div className="">
        {/* Users List */}
        <div className="">
          {/* Header Row */}
          <div className="bg-[#243b5e] rounded-t-xl px-6 py-4 grid grid-cols-3 gap-4 text-sm font-medium text-gray-300">
            <div>Cars Name</div>
            <div>Total Votes</div>
            <div>Action</div>
          </div>

          {/* User Rows */}
          {currentUsers.length === 0 ? (
            <div className="bg-[#1C2936] py-12 text-center text-gray-500">
              No cars found matching your criteria
            </div>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user._id}
                className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-4 grid grid-cols-3 gap-4 items-center transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-medium">{user.carName}</span>
                </div>
                <div className="text-gray-300 text-sm">{user.vote}</div>
                <div>
                  <Link
                    href={``}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium underline transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col bg-[#1C2936] rounded-b-xl p-5 sm:flex-row items-center justify-between gap-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} Cars
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