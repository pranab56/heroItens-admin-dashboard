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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // 1. Keep active dropdown open
    const activeParent = sidebars.find(item => 
      item.subItems?.some(sub => pathname === sub.path || pathname.startsWith(sub.path + "/"))
    );
    if (activeParent) setOpenDropdown(activeParent.name);

    // 2. Close mobile sidebar on navigation
    if (sidebarIsMobile) setOpenMobile(false);
  }, [pathname, sidebarIsMobile, setOpenMobile]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  const truncate = (text: string) => (text.length > 12 ? text.substring(0, 12) + "..." : text);

  return (
    <Sidebar className="border-none z-50">
      <div className="bg-[#1C2936] text-white flex flex-col h-full overflow-hidden">
        <SidebarHeader className="p-4 flex items-center justify-center bg-[#1C2936]">
          <img src="/Logo.png" alt="MyGarage Logo" className="w-24 h-24 object-contain" />
        </SidebarHeader>

        <SidebarContent className="bg-[#1C2936] flex-1 overflow-hidden p-0">
          <div className="flex-1 overflow-y-auto px-4 pb-2 scrollbar-thin">
            <SidebarMenu className="space-y-1">
              {sidebars.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isItemActive = isActive(item.path);
                const isDropdownOpen = openDropdown === item.name;

                return (
                  <React.Fragment key={item.name}>
                    <SidebarMenuItem>
                      {hasSubItems ? (
                        <SidebarMenuButton
                          onClick={() => setOpenDropdown(isDropdownOpen ? null : item.name)}
                          className={`h-11 px-4 justify-between transition-all ${
                            isDropdownOpen ? "bg-white/10" : isItemActive ? "bg-blue-600" : "text-gray-300 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 shrink-0" />
                            {item.name.length > 12 ? (
                              <Tooltip><TooltipTrigger asChild><span>{truncate(item.name)}</span></TooltipTrigger><TooltipContent side="right">{item.name}</TooltipContent></Tooltip>
                            ) : (<span>{item.name}</span>)}
                          </div>
                          {isDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={`h-11 px-4 ${isItemActive ? "bg-blue-600" : "text-gray-300 hover:bg-white/5"}`}
                          isActive={isItemActive}
                        >
                          <Link href={item.path} className="flex items-center gap-3 w-full">
                            <item.icon className="w-5 h-5 shrink-0" />
                            {item.name.length > 12 ? (
                              <Tooltip><TooltipTrigger asChild><span>{truncate(item.name)}</span></TooltipTrigger><TooltipContent side="right">{item.name}</TooltipContent></Tooltip>
                            ) : (<span>{item.name}</span>)}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>

                    {hasSubItems && isDropdownOpen && (
                      <div className="ml-4 space-y-1 mt-1 mb-1 border-l border-white/10">
                        {item.subItems?.map((sub) => {
                          const isSubActive = isActive(sub.path);
                          return (
                            <SidebarMenuItem key={sub.path}>
                              <SidebarMenuButton
                                asChild
                                className={`h-10 px-4 ${isSubActive ? "bg-blue-600/30 text-blue-300 border border-blue-500/20" : "text-gray-400 hover:bg-white/5"}`}
                              >
                                <Link href={sub.path} className="flex items-center gap-3 w-full">
                                  <div className={`w-1 h-1 rounded-full ${isSubActive ? "bg-blue-400" : "bg-gray-500"}`} />
                                  <span>{truncate(sub.name)}</span>
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

        <SidebarFooter className="p-4 bg-[#1a2942] border-t border-white/10">
          <button
            onClick={() => {
              dispatch(logout());
              localStorage.removeItem("HeroItemsAdminId");
              toast.success("Logged out");
              router.replace("/auth/login");
            }}
            className="w-full h-11 flex items-center justify-center gap-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </SidebarFooter>
      </div>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </Sidebar>
  );
}