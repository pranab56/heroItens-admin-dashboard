import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ClientLayout from './ClientLayout';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "My Garage Admin Dashboard",
  description: "My Garage Admin Dashboard",
  icons: {
    icon: [{ url: "/Logo.png", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable}  antialiased h-screen`}
      >
        <ClientLayout>
          {children}
          <Toaster />
        </ClientLayout>
      </body>

    </html>
  );
}
