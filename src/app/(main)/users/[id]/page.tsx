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
  User as UserIcon,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useApproveCarMutation } from '../../../../features/car/carApi';
import { useViewCarDetailsQuery, useViewUserDetailsQuery } from '../../../../features/users/usersApi';
import { baseURL } from '../../../../utils/BaseURL';
import { CustomLoading } from '../../../../hooks/CustomLoading';

export default function UserDetailsPage() {
  const params = useParams();
  const { data: userDetail, isLoading: userLoading } = useViewUserDetailsQuery(params?.id, { skip: !params?.id });
  const { data: carDetail, isLoading: carLoading, refetch: refetchCar } = useViewCarDetailsQuery(params?.id, { skip: !params?.id });
  const [approveCar, { isLoading: approveLoading }] = useApproveCarMutation();

  const handleStatusToggle = async (carId: string) => {
    try {
      const response = await approveCar(carId).unwrap();
      refetchCar();
      toast.success(response?.message || "Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  if (userLoading || carLoading) {
    return <CustomLoading />;
  }

  const user = userDetail?.data;
  console.log("user", user)
  const cars = carDetail?.data || [];
  const pendingCars = cars.filter((car: any) => car.status === 'pending');

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
      {user && (
        <div className="bg-[#1C2936] rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-28 w-28 rounded-2xl">
              {/* API response for user doesn't strictly have 'profile' or 'image' in the snippet provided, 
                  but logic remains if property exists. Fallback to initials. */}
              <AvatarImage src={user.image ? `${baseURL}+${user.image}` : ""} alt={user.name} className="rounded-2xl" />
              <AvatarFallback className="rounded-2xl bg-gray-700 text-white text-2xl">
                {user.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.name}
              </h1>
              <p className="text-gray-400 mb-3">{user.email}</p>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={18} className="text-emerald-400" />
                <span>{user.address || "No address provided"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {user && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Registration Date</label>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar size={18} className="text-gray-400" />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {/* User Bio */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">User Bio</label>
                <p className="text-white leading-relaxed text-sm">
                  {user?.bio || "No bio available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Cars Section */}
        <div className="lg:col-span-2">
          <div className="rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Submitted Cars</h2>
              <span className="text-gray-400 text-sm">{cars.length} Total Cars</span>
            </div>

            {/* Cars List */}
            <div className="space-y-4">
              {cars.map((car: any) => (
                <div
                  key={car._id}
                  className="bg-[#1C2936] rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Car Image */}
                    <div className="w-full md:w-48 h-40 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                      <Image
                        src={car.images && car.images.length > 0 ? `${baseURL}${car.images[0]}` : ""}
                        alt={`${car.year} ${car.modelName}`}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Car Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {car.year} {car.modelName}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs ${car.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                            car.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {car.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {car.categoryName} • {car.manufacturer}
                        </p>
                      </div>

                      {/* Verify Button */}
                      <div className="w-full mt-4">
                        <Button
                          onClick={() => handleStatusToggle(car._id)}
                          disabled={approveLoading}
                          className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${car.status === 'APPROVED'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                        >
                          {car.status === 'APPROVED' ? (
                            <>
                              <XCircle size={18} />
                              Reject
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              Approve
                            </>
                          )}
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