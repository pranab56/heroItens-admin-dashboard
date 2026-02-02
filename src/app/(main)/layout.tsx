import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import OptimusSidebar from "@/components/appSidebar/AppsideBar";
import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "My Garage Admin Dashboard",
  description: "My Garage Admin Dashboard",
  icons: {
    icon: [{ url: "/Logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <OptimusSidebar />
        <SidebarInset className="bg-gray-100 h-screen flex flex-col">
          <Header />
          <main className="flex-1 bg-[#101922] p-3 overflow-auto min-w-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
