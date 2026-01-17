"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CheckCircle,
  MapPin,
  User as UserIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// User Interface
interface User {
  _id: string;
  profile: string;
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  registrationDate: string;
  bio: string;
}

// Car Interface
interface Car {
  _id: string;
  image: string;
  name: string;
  year: number;
  bodyType: string;
  color: string;
  listingType: string;
  status: 'pending' | 'verified' | 'rejected';
}

// Demo Data
const DEMO_USER: User = {
  _id: "1",
  profile: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop",
  first_name: "John",
  last_name: "Cooper",
  email: "john@gmail.com",
  location: "Los Angeles, CA",
  registrationDate: "October 12, 2025",
  bio: "Automotive enthusiast looking to list a private collection. Interested in classic muscle cars and modern high-performance vehicles"
};

const DEMO_CARS: Car[] = [
  {
    _id: "1",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop",
    name: "Ford Mustang",
    year: 1967,
    bodyType: "Fastback",
    color: "Candy Apple Red",
    listingType: "Private Listing",
    status: "pending"
  },
  {
    _id: "2",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop",
    name: "Ford Mustang",
    year: 1967,
    bodyType: "Fastback",
    color: "Candy Apple Red",
    listingType: "Private Listing",
    status: "pending"
  }
];

export default function UserDetailsPage() {
  const [user] = useState<User>(DEMO_USER);
  const [cars] = useState<Car[]>(DEMO_CARS);

  const pendingCars = cars.filter(car => car.status === 'pending');

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-gray-400">
          <Link href="/users" className="hover:text-white transition-colors">
            User Management
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white font-medium">User Details</span>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-[#1C2936] rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Avatar className="h-28 w-28 rounded-2xl">
            <AvatarImage src={user.profile} alt={`${user.first_name} ${user.last_name}`} className="rounded-2xl" />
            <AvatarFallback className="rounded-2xl bg-gray-700 text-white text-2xl">
              {user.first_name[0]}{user.last_name[0]}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-gray-400 mb-3">{user.email}</p>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={18} className="text-emerald-400" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#1C2936] rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <UserIcon size={20} className="text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Account Information</h2>
            </div>

            <div className="space-y-6">
              {/* Registration Date */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Registration Date</label>
                <div className="flex items-center gap-2 text-white">
                  <Calendar size={18} className="text-gray-400" />
                  <span>{user.registrationDate}</span>
                </div>
              </div>

              {/* User Bio */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">User Bio</label>
                <p className="text-white leading-relaxed text-sm">
                  {user.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Cars Section */}
        <div className="lg:col-span-2">
          <div className=" rounded-xl shadow-lg p-6 ">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Submitted Cars</h2>
              <span className="text-gray-400 text-sm">{pendingCars.length} Cars Pending</span>
            </div>

            {/* Cars List */}
            <div className="space-y-4">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="bg-[#1C2936] rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Car Image */}
                    <div className="w-full md:w-48 h-40 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                      <Image
                        src={car.image}
                        alt={`${car.year} ${car.name}`}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Car Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {car.year} {car.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {car.bodyType} . {car.color} . {car.listingType}
                        </p>
                      </div>

                      {/* Verify Button */}
                      <div className="w-full ">
                        <Button className="w-full bg-[#137FEC] hover:bg-[#1273d4]  text-white  py-2 rounded-lg flex items-center justify-center px-[200px]">
                          <CheckCircle size={18} />
                          Verify Car
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State (if no cars) */}
            {cars.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-400">No cars submitted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}