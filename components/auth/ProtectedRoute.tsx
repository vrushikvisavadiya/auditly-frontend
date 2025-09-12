"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/routes/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check authentication
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found, redirecting to login");
        router.push("/login");
        return;
      }

      // Check admin access if required
      if (requireAdmin) {
        try {
          const user = JSON.parse(localStorage.getItem("user") || "");
          console.log("User role:", user?.platformRole);
          if (user?.platformRole !== "ADMIN") {
            console.log("User is not admin, redirecting to welcome");
            router.push(ROUTES.ORGANIZATION);
            return;
          }
        } catch (error) {
          console.log("Error parsing user data:", error);
          router.push(ROUTES.LOGIN);
          return;
        }
      }

      setIsChecking(false);
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router, requireAdmin]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return <>{children}</>;
}
