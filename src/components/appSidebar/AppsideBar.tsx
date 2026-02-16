"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { logout } from "@/features/auth/authSlice";
import {
  Car,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield as ShieldIcon,
  ShoppingBag,
  ShoppingCart,
  Users,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


type SidebarItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { name: string; path: string; icon: React.ComponentType<{ className?: string }> }[];
};

const sidebars: SidebarItem[] = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "User Management", path: "/users", icon: Users },
  {
    name: "Car Management",
    path: "/car-management",
    icon: Car,
    subItems: [
      { name: "All Cars", path: "/car-management/all-cars", icon: Car },
      { name: "Cars Verification", path: "/car-management/verification", icon: ShieldIcon },
      { name: "All Categoric", path: "/car-management/categoric", icon: LayoutDashboard },
      { name: "Add Category & Model", path: "/car-management/add-category-model", icon: LayoutDashboard },
    ]
  },
  {
    name: "Rankings & Voting",
    path: "/rankings",
    icon: Zap,
    subItems: [
      { name: "View Rankings", path: "/rankings/live-ranking", icon: LayoutDashboard },
      // { name: "Manage Voting", path: "/rankings/vote-history", icon: ClipboardList },
    ]
  },
  {
    name: "Shop Management",
    path: "/shop-management",
    icon: ShoppingCart,
    subItems: [
      { name: "All Products", path: "/shop-management/products", icon: ShoppingBag },
      { name: "Add New Products", path: "/shop-management/new", icon: ClipboardList },
    ]
  },
  {
    name: "Payment Management",
    path: "/payment-management",
    icon: ShoppingCart,
    subItems: [
      { name: "Tire Management", path: "/payment-management/tire-management", icon: ShoppingBag },
      { name: "Payment History", path: "/payment-management/payment-history", icon: ClipboardList },
    ]
  },
  {
    name: "System Settings", path: "/settings/general", icon: Settings,
    subItems: [
      { name: "General Settings", path: "/settings/general", icon: ClipboardList },
      { name: "Privacy Policy", path: "/settings/privacy", icon: ClipboardList },
      { name: "Terms & Conditions", path: "/settings/terms", icon: ClipboardList },
    ]
  },
];

export default function OptimusSidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { setOpenMobile, isMobile: sidebarIsMobile } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (sidebarIsMobile) {
      setOpenMobile(false);
    }
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = () => {
    dispatch(logout()); // This clears state and removes token from storage/cookies
    toast.success("Logged out successfully");
    router.replace("/auth/login");
  };

  const truncate = (text: string) => {
    return text.length > 12 ? text.substring(0, 12) + "..." : text;
  };


  return (
    <Sidebar className="border-none">
      <TooltipProvider delayDuration={200}>
        <div className="bg-[#1C2936] text-white flex flex-col h-full overflow-hidden">
          {/* Logo Section - Header */}
          <SidebarHeader className="p-0 border-none">
            <div className="flex flex-col items-center justify-center px-6 pt-8 pb-6 bg-[#1C2936]">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/Logo.png"
                    alt="MyGarage Logo"
                    width={1000}
                    height={1000}
                    className="object-contain"
                  // priority
                  />
                </div>
              </div>
            </div>
          </SidebarHeader>

          {/* Navigation Menu - Content */}
          <SidebarContent className="bg-[#1C2936] flex-1 overflow-hidden p-0">
            {/* Custom scrollbar container */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 scrollbar-thumb-rounded-full hover:scrollbar-thumb-white/20 px-4 pb-2">
              <SidebarMenu className="space-y-1">
                {sidebars.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isItemActive = isActive(item.path);
                  const isDropdownOpen = openDropdown === item.name;

                  return (
                    <React.Fragment key={item.name}>
                      <SidebarMenuItem>
                        {hasSubItems ? (
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className={`w-full h-11 px-4 rounded-lg transition-all duration-200 flex items-center justify-between ${isItemActive
                              ? "bg-[#2563eb] text-white"
                              : "text-gray-300 hover:bg-white/5"
                              }`}
                            aria-expanded={isDropdownOpen}
                            aria-label={`Toggle ${item.name} dropdown`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 shrink-0" />
                              {item.name.length > 12 ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-[15px] font-normal">{truncate(item.name)}</span>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p>{item.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <span className="text-[15px] font-normal">{item.name}</span>
                              )}
                            </div>
                            {isDropdownOpen ? (
                              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                            ) : (
                              <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                            )}
                          </button>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            className={`h-11 px-4 rounded-lg transition-all duration-200 ${isItemActive
                              ? "bg-[#2563eb] text-white hover:bg-[#2563eb]/90"
                              : "text-gray-300 hover:bg-white/5"
                              }`}
                            isActive={isItemActive}
                          >
                            <Link
                              href={item.path}
                              onClick={handleLinkClick}
                              className="flex items-center gap-3 w-full"
                              aria-current={isItemActive ? "page" : undefined}
                            >
                              <item.icon className="h-5 w-5 shrink-0" />
                              {item.name.length > 12 ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-[15px] font-normal">{truncate(item.name)}</span>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p>{item.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <span className="text-[15px] font-normal">{item.name}</span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>

                      {/* Dropdown Sub-items */}
                      {hasSubItems && isDropdownOpen && (
                        <div className="ml-0 space-y-1 mt-1 mb-1 pl-4 border-l-2 border-white/10">
                          {item.subItems?.map((subItem) => {
                            const isSubItemActive = isActive(subItem.path);
                            return (
                              <SidebarMenuItem key={subItem.path}>
                                <SidebarMenuButton
                                  asChild
                                  className={`h-10 px-4 rounded-lg transition-all duration-200 ${isSubItemActive
                                    ? "bg-[#1C2936] text-white"
                                    : "text-gray-100 hover:bg-white/5 hover:text-white"
                                    }`}
                                  isActive={isSubItemActive}
                                >
                                  <Link
                                    href={subItem.path}
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 w-full"
                                    aria-current={isSubItemActive ? "page" : undefined}
                                  >
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubItemActive ? 'bg-white' : 'bg-gray-400'}`} />
                                    {subItem.name.length > 12 ? (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="text-[14px] font-normal">{truncate(subItem.name)}</span>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                          <p>{subItem.name}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ) : (
                                      <span className="text-[14px] font-normal">{subItem.name}</span>
                                    )}
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>

          {/* Logout Section - Footer */}
          <SidebarFooter className="p-0 border-none">
            <div className="px-4 pb-8 md:pb-6 pt-4 bg-[#1a2942] border-t border-white/10">
              <button
                onClick={() => {
                  handleLogout();
                  handleLinkClick();
                }}
                className="w-full h-11 cursor-pointer px-4 rounded-lg border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="text-[15px] font-medium">Logout</span>
              </button>
            </div>
          </SidebarFooter>
        </div>
      </TooltipProvider>

      {/* Add custom scrollbar styles to global styles */}
      <style jsx global>{`
        /* For Webkit browsers (Chrome, Safari, Edge) */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        /* For Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        
        /* Smooth scrolling */
        .scrollbar-thin {
          scroll-behavior: smooth;
        }
      `}</style>
    </Sidebar>
  );
}