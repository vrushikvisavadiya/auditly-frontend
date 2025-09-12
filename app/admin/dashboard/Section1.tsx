"use client";

import {
  errorReportsIcon,
  newProviderIcon,
  policiesGeneratedIcon,
  totalProviderIcon,
} from "./Icons";
import MetricCard from "./MetricCard";
import { useState, useEffect } from "react";

// API Types
interface DashboardStats {
  newProviders: number;
  totalProviders: number;
  policiesGenerated: number;
  errorReports: number;
}

// API Service Functions
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // For now, we'll calculate stats from existing APIs
  // In a real implementation, you'd have a dedicated dashboard stats endpoint
  
  // Fetch providers data
  const providersResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/accounts/signup-requests-list/`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  
  const providersData = await providersResponse.json();
  
  // Fetch activity logs for recent activity count
  const activityResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/activity/logs/?page_size=1000`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  
  const activityData = await activityResponse.json();
  
  // Calculate stats
  const totalProviders = providersData.count || 0;
  const newProviders = providersData.data?.filter((p: any) => p.status === "PENDING").length || 0;
  const policiesGenerated = activityData.data?.filter((a: any) => a.activity_type === "POLICY_CREATED").length || 0;
  const errorReports = activityData.data?.filter((a: any) => a.activity_type === "ERROR_REPORT").length || 0;
  
  return {
    newProviders,
    totalProviders,
    policiesGenerated,
    errorReports,
  };
};

export default function Section1() {
  const [stats, setStats] = useState<DashboardStats>({
    newProviders: 0,
    totalProviders: 0,
    policiesGenerated: 0,
    errorReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start">
        <h2 className="self-stretch text-[color:var(--auditly-dark-blue,#1A204C)] [font-family:Poppins] text-[32px] font-bold leading-[normal]">
          While you’re away...
        </h2>
        <p className="self-stretch text-black [font-family:Poppins] text-sm font-normal leading-[normal]">
          Here’s a quick recap of everything that happened while you were
          offline—new updates, changes, and actions from your team, all in one
          place.
        </p>
      </div>
      <div className="flex p-4 flex-col items-start gap-2 self-stretch rounded-2xl [background:rgba(245,132,106,0.10)]">
        <h3 className="self-stretch text-[color:var(--auditly-dark-blue,#1A204C)] [font-family:Poppins] text-xl font-semibold leading-[normal]">
          At-a-Glance Stats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
          <MetricCard
            icon={newProviderIcon}
            title="New Providers"
            value={loading ? "..." : stats.newProviders.toString()}
            change="20"
          />
          <MetricCard
            icon={totalProviderIcon}
            title="Total Providers"
            value={loading ? "..." : stats.totalProviders.toString()}
            change="20"
          />
          <MetricCard
            icon={policiesGeneratedIcon}
            title="Policies Generated"
            value={loading ? "..." : stats.policiesGenerated.toString()}
            change="20"
          />
          <MetricCard
            icon={errorReportsIcon}
            title="Error reports"
            value={loading ? "..." : stats.errorReports.toString()}
            change="20"
          />
        </div>
      </div>
    </div>
  );
}
