"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGetAllUsersQuery } from '@/features/users/usersApi';
import { Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// User Interface
interface User {
  _id: string;
  name: string;
  role: string;
  email: string;
  contact: string;
  status: string;
  verified: boolean;
  address: string;
  createdAt: string;
  updatedAt: string;
  profile?: string;
}

// Main Component
export default function UserManagement() {
  const { data, isLoading } = useGetAllUsersQuery({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 9;

  // Get user's full name
  const getUserFullName = (user: User): string => {
    return user.name || 'Unknown User';
  };

  // Filter users
  useEffect(() => {
    const users = data?.data || [];
    const filtered = users.filter((user: User) => {
      const userName = getUserFullName(user).toLowerCase();
      const userEmail = (user.email || '').toLowerCase();
      const userContact = user.contact || '';
      const userId = user._id;

      const matchesSearch = userName.includes(searchQuery.toLowerCase()) ||
        userEmail.includes(searchQuery.toLowerCase()) ||
        userContact.includes(searchQuery) ||
        userId.includes(searchQuery);

      const matchesStatus = statusFilter === 'All' ||
        (statusFilter === 'Active' && user.status === 'Active') ||
        (statusFilter === 'Inactive' && user.status !== 'Active');

      return matchesSearch && matchesStatus;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [data, searchQuery, statusFilter]);

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
        <div className="flex w-5/12 relative">
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
          <Select value={statusFilter} onValueChange={handleStatusChange} >
            <SelectTrigger className="w-full md:w-[200px] h-20 py-[23px] bg-[#0d1829] border-gray-700 text-white pl-12 rounded-lg cursor-pointer">
              <SelectValue placeholder="Filter: 2025" />
            </SelectTrigger>
            <SelectContent className='bg-[#1a2942]  border-gray-700 text-white cursor-pointer'>
              <SelectItem value="All">Year</SelectItem>
              <SelectItem value="Active">2025</SelectItem>
              <SelectItem value="Inactive">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="">
        {/* Search and Filter Section */}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Users List */}
            <div className="">
              {/* Header Row */}
              <div className="bg-[#243b5e] rounded-t-xl  px-6 py-4 grid grid-cols-3 gap-4 text-sm font-medium text-gray-300">
                <div>Name</div>
                <div>Email</div>
                <div>Action</div>
              </div>

              {/* User Rows */}
              {currentUsers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No users found matching your criteria
                </div>
              ) : (
                currentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700  px-6 py-4 grid grid-cols-3 gap-4 items-center transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-lg">
                        <AvatarImage src={user.profile} alt={getUserFullName(user)} className="rounded-lg" />
                        <AvatarFallback className="rounded-lg bg-gray-700 text-white">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white text-sm font-medium">{getUserFullName(user)}</span>
                    </div>
                    <div className="text-gray-300 text-sm">{user.email}</div>
                    <div>
                      <Link
                        href={`/users/${user._id}`}
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
              <div className="flex flex-col bg-[#1C2936] rounded-b-xl p-5 sm:flex-row items-center justify-between gap-4  pt-6 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} Users
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
          </>
        )}
      </div>
    </div>
  );
}