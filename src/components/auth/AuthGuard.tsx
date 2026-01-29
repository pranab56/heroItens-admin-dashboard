"use client";

import { CustomLoading } from "@/hooks/CustomLoading";
import { getToken } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#101922]">
        <CustomLoading />
      </div>
    );
  }

  return <>{children}</>;
}
