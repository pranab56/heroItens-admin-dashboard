"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/features/auth/authSlice";
import { Bell, ChevronDown } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";

import { useGetAllNotificationQuery } from '../../features/notification/notificationApi';
import { useGetMyProfileQuery } from '../../features/profile/profileApi';
import { baseURL } from '../../utils/BaseURL';
import { SidebarTrigger } from '../ui/sidebar';

export default function Header() {
  const router = useRouter();
  const { data: apiResponse, isLoading } = useGetAllNotificationQuery(undefined);
  const { data: profileDataResponse, isLoading: profileDataLoading, refetch } = useGetMyProfileQuery(
    typeof window !== 'undefined' ? localStorage.getItem("HeroItemsAdminId") : null,
    { skip: typeof window === 'undefined' || !localStorage.getItem("HeroItemsAdminId") }
  );

  console.log("profileDataResponse", profileDataResponse?.data)


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dispatch = useDispatch();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMyProfile = () => {
    router.push("/profile");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("HeroItemsAdminId");
    setIsDropdownOpen(false);
    router.replace("/auth/login");
  };


  return (
    <div className="w-full">
      <header className="flex h-16 md:h-20 items-center justify-between px-4 md:px-8 bg-[#1C2936] text-white">
        {/* Left side - Welcome text & Sidebar Trigger */}
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger className="md:hidden text-white hover:bg-gray-700" />
          <h1 className="text-lg md:text-2xl font-semibold hidden sm:block">
            Welcome Back!
          </h1>
        </div>

        {/* Right side - Notification and Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => router.push("/notifications")}
              className="relative flex cursor-pointer h-10 w-10 md:h-13 md:w-13 items-center justify-center rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-white" />
              {apiResponse?.data?.unreadNotification > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-4 min-w-4 md:h-5 md:min-w-5 rounded-full px-1 md:px-1.5 text-[10px] md:text-xs font-semibold"
                  variant="destructive"
                >
                  {apiResponse?.data?.unreadNotification > 99 ? "99+" : apiResponse?.data?.unreadNotification}
                </Badge>
              )}
            </button>
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 md:gap-3 rounded-lg text-white bg-gray-600 hover:bg-gray-700 px-2 md:px-4 py-1.5 md:py-2 transition-colors cursor-pointer"
            >
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src={baseURL + profileDataResponse?.data?.image} alt={profileDataResponse?.data?.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs">
                  {profileDataResponse?.data?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                  {profileDataResponse?.data?.name}
                </span>
                <span className="text-xs text-white uppercase">{profileDataResponse?.data?.role}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md  bg-gray-600  text-white shadow-lg z-50">
                <button
                  onClick={handleMyProfile}
                  className="flex w-full px-4 py-3 text-sm cursor-pointer text-gray-100 hover:bg-gray-700 rounded-t-md  transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full px-4 py-2 text-sm cursor-pointer  text-red-600 hover:bg-gray-700 rounded-b-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}