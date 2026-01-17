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

// User Interface with only needed properties
interface User {
  _id: string;
  profile: string;
  first_name: string;
  last_name: string;
  make: string;
  model: string;
  createdAt: string;
}

// Demo Data with only needed properties
const DEMO_USERS: User[] = [
  {
    _id: "1",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "Jane",
    last_name: "Cooper",
    make: "Ford",
    model: "Mustang 2022",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "John",
    last_name: "Cooper",
    make: "Toyota",
    model: "Camry 2023",
    createdAt: "2024-02-20T09:15:00Z",
  },
  {
    _id: "3",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "Robert",
    last_name: "Johnson",
    make: "Tesla",
    model: "Model S",
    createdAt: "2024-03-10T14:45:00Z",
  },
  {
    _id: "4",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "Emily",
    last_name: "Wilson",
    make: "BMW",
    model: "X5 2024",
    createdAt: "2024-04-05T16:20:00Z",
  },
  {
    _id: "5",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "Michael",
    last_name: "Brown",
    make: "Mercedes",
    model: "E-Class",
    createdAt: "2024-05-12T08:30:00Z",
  },
  {
    _id: "6",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "Sarah",
    last_name: "Davis",
    make: "Audi",
    model: "Q7",
    createdAt: "2024-06-18T12:15:00Z",
  },
  {
    _id: "7",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "David",
    last_name: "Miller",
    make: "Honda",
    model: "Civic 2023",
    createdAt: "2024-07-22T14:40:00Z",
  },
  {
    _id: "8",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "Lisa",
    last_name: "Taylor",
    make: "Hyundai",
    model: "Tucson",
    createdAt: "2024-08-30T16:25:00Z",
  },
  {
    _id: "9",
    profile: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=80&fit=crop",
    first_name: "James",
    last_name: "Anderson",
    make: "Chevrolet",
    model: "Silverado",
    createdAt: "2024-09-15T10:10:00Z",
  },
  ...Array.from({ length: 39 }, (_, i) => ({
    _id: `${i + 10}`,
    profile: i % 3 === 0 ? "" : `/profiles/user${(i % 9) + 1}.jpg`,
    first_name: ["Alex", "Emma", "Chris", "Olivia", "Daniel", "Sophia", "Matthew", "Isabella", "Andrew", "Mia"][i % 10],
    last_name: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"][i % 10],
    make: ["Ford", "Toyota", "Tesla", "BMW", "Mercedes", "Audi", "Honda", "Hyundai", "Chevrolet", "Nissan"][i % 10],
    model: [`Model ${String.fromCharCode(65 + (i % 5))}`, `Series ${i % 5 + 1}`, `Edition ${2020 + (i % 5)}`, `Type ${i % 3 + 1}`, `Class ${String.fromCharCode(65 + (i % 3))}`][i % 5],
    createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
  }))
];

// Main Component
export default function UserManagement() {
  const [users] = useState<User[]>(DEMO_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(DEMO_USERS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 9;

  // Get owner's full name
  const getOwnerName = (user: User): string => {
    return `${user.first_name} ${user.last_name}`;
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

  // Filter users
  useEffect(() => {
    const filtered = users.filter(user => {
      const ownerName = getOwnerName(user).toLowerCase();
      const make = user.make.toLowerCase();
      const model = user.model.toLowerCase();
      const date = formatDate(user.createdAt).toLowerCase();

      const matchesSearch = ownerName.includes(searchQuery.toLowerCase()) ||
        make.includes(searchQuery.toLowerCase()) ||
        model.includes(searchQuery.toLowerCase()) ||
        date.includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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

      <div className="">
        {/* Users List */}
        <div className="">
          {/* Header Row */}
          <div className="bg-[#243b5e] rounded-t-xl px-6 py-4 grid grid-cols-5 gap-4 text-sm font-medium text-gray-300">
            <div>Car Image</div>
            <div>Owner Name</div>
            <div>Date</div>
            <div>Make</div>
            <div>Model</div>
          </div>

          {/* User Rows */}
          {currentUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No records found matching your criteria
            </div>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user._id}
                className="bg-[#1C2936] hover:bg-[#2a4470] border-b border-gray-700 px-6 py-4 grid grid-cols-5 gap-4 items-center transition-colors"
              >
                {/* Car Image */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage
                      src={user.profile || "/placeholder-car.jpg"}
                      alt={`${user.make} ${user.model}`}
                      className="rounded-lg"
                    />
                    <AvatarFallback className="rounded-lg bg-gray-700 text-white">
                      {user.make.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Owner Name */}
                <div className="text-white text-sm font-medium">
                  {getOwnerName(user)}
                </div>

                {/* Date */}
                <div className="text-gray-300 text-sm">
                  {formatDate(user.createdAt)}
                </div>

                {/* Make */}
                <div className="text-gray-300 text-sm">
                  {user.make}
                </div>

                {/* Model */}
                <div className="text-gray-300 text-sm">
                  {user.model}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col bg-[#1C2936] rounded-b-xl p-5 sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} Records
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