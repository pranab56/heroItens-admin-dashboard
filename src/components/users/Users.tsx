"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// User Interface
interface User {
  _id: string;
  profile: string;
  first_name: string;
  last_name: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  phone: string;
  twoStepVerification: boolean;
  createdAt: string;
  updatedAt: string;
  gender: string;
  dateOfBirth: string;
  subscriptionId: string | null;
  isStripeConnectedAccount: boolean;
  userDeviceId: string | null;
  isDeleted: boolean;
  isSubscriberUser: boolean;
}

// Demo Data
const DEMO_USERS: User[] = [
  {
    _id: "1",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "John",
    last_name: "Cooper",
    fullName: "John Cooper",
    email: "john@email.com",
    role: "user",
    isActive: true,
    phone: "+1 (555) 123-4567",
    twoStepVerification: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-12-01T14:20:00Z",
    gender: "Male",
    dateOfBirth: "1990-05-15",
    subscriptionId: "sub_123456789",
    isStripeConnectedAccount: true,
    userDeviceId: "device_001",
    isDeleted: false,
    isSubscriberUser: true
  },
  {
    _id: "2",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "John",
    last_name: "Cooper",
    fullName: "John Cooper",
    email: "john@email.com",
    role: "admin",
    isActive: true,
    phone: "+1 (555) 987-6543",
    twoStepVerification: false,
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-11-30T16:45:00Z",
    gender: "Female",
    dateOfBirth: "1988-08-22",
    subscriptionId: "sub_987654321",
    isStripeConnectedAccount: false,
    userDeviceId: "device_002",
    isDeleted: false,
    isSubscriberUser: true
  },
  {
    _id: "3",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "John",
    last_name: "Cooper",
    fullName: "John Cooper",
    email: "john@email.com",
    role: "user",
    isActive: false,
    phone: "+1 (555) 456-7890",
    twoStepVerification: true,
    createdAt: "2024-03-10T14:45:00Z",
    updatedAt: "2024-10-15T11:30:00Z",
    gender: "Male",
    dateOfBirth: "1992-11-30",
    subscriptionId: null,
    isStripeConnectedAccount: false,
    userDeviceId: null,
    isDeleted: false,
    isSubscriberUser: false
  },
  // Additional users for pagination demo
  ...Array.from({ length: 39 }, (_, i) => ({
    _id: `${i + 10}`,
    profile: i % 3 === 0 ? "" : `/profiles/user${(i % 9) + 1}.jpg`,
    first_name: "John",
    last_name: "Cooper",
    fullName: "John Cooper",
    email: "john@email.com",
    role: "user",
    isActive: true,
    phone: `+1 (555) ${String(i + 10).padStart(3, '0')}-${String(i * 11).padStart(4, '0')}`,
    twoStepVerification: i % 2 === 0,
    createdAt: new Date(2024, 0, i + 1).toISOString(),
    updatedAt: new Date(2024, 11, i + 1).toISOString(),
    gender: i % 2 === 0 ? "Male" : "Female",
    dateOfBirth: `199${i % 10}-0${(i % 9) + 1}-${(i % 28) + 1}`,
    subscriptionId: i % 3 === 0 ? null : `sub_${i + 10}`,
    isStripeConnectedAccount: i % 2 === 0,
    userDeviceId: i % 3 === 0 ? null : `device_${String(i + 10).padStart(3, '0')}`,
    isDeleted: false,
    isSubscriberUser: i % 3 !== 0
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

  // Get user's full name
  const getUserFullName = (user: User): string => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.fullName || 'Unknown User';
  };

  // Filter users
  useEffect(() => {
    const filtered = users.filter(user => {
      const userName = getUserFullName(user).toLowerCase();
      const userEmail = user.email.toLowerCase();
      const userPhone = user.phone;
      const userId = user._id;

      const matchesSearch = userName.includes(searchQuery.toLowerCase()) ||
        userEmail.includes(searchQuery.toLowerCase()) ||
        userPhone.includes(searchQuery) ||
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
                      {user.first_name?.[0]}{user.last_name?.[0]}
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
      </div>
    </div>
  );
}