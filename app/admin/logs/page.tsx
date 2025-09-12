"use client";

import Button from "@/components/Button";
import Layout from "../Layout";
import Pagination from "@/components/Pagination";
import Select from "@/components/Select";
import SearchBar from "@/components/SearchBar";
import Icon from "@/components/Icon";
import ListPageHeader from "@/components/ListPageHeader";
import { useState, useMemo, useEffect } from "react";

// API Types
interface ActivityLogUser {
  id: string;
  email: string;
  name: string;
}

interface ActivityLog {
  id: number;
  timestamp: string;
  activity_type: string;
  details: string;
  performed_by: ActivityLogUser | null;
  ip_address: string;
  location: string | null;
  entity_type: string;
  entity_id: string;
}

interface ActivityLogsResponse {
  success: boolean;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  data: ActivityLog[];
}

interface ActivityLogsFilters {
  activity_type?: string;
  performed_by?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// API Service Functions
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const fetchActivityLogs = async (filters: ActivityLogsFilters = {}): Promise<ActivityLogsResponse> => {
  const params = new URLSearchParams();
  
  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/activity/logs/?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Activity type mapping for display
const getActivityDisplayName = (activityType: string): string => {
  const mapping: Record<string, string> = {
    LOGIN: "Login",
    LOGOUT: "Logout",
    USER_CREATED: "User Registration",
    USER_UPDATED: "User Update",
    USER_DELETED: "User Deletion",
    PROVIDER_APPROVAL: "Provider Approval",
    PROFILE_UPDATE: "Profile Update",
    PASSWORD_RESET: "Password Reset",
    PASSWORD_CHANGED: "Password Changed",
  };
  return mapping[activityType] || activityType;
};

export default function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [activity, setActivity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // API state
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [uniquePerformers, setUniquePerformers] = useState<string[]>([]);
  const [uniqueActivities, setUniqueActivities] = useState<string[]>([]);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: ActivityLogsFilters = {
        page: currentPage,
        page_size: pageSize,
        search: searchTerm || undefined,
        activity_type: activity || undefined,
        performed_by: performedBy || undefined,
        ordering: sortBy || "-timestamp",
      };

      const response = await fetchActivityLogs(filters);
      
      console.log("API Response:", response); // Debug log
      
      if (response.success) {
        setLogs(response.data);
        setTotalCount(response.count);
        
        // Extract unique values for filters
        const performers = Array.from(new Set(
          response.data
            ?.map(log => log.performed_by?.name || log.performed_by?.email || "System")
            .filter(Boolean)
        ));
        const activities = Array.from(new Set(
          response.data?.map(log => log.activity_type)
        ));
        
        setUniquePerformers(performers);
        setUniqueActivities(activities);
      } else {
        setError(response.message || "Failed to fetch activity logs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchTerm, sortBy, performedBy, activity]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      
      // Fetch all data for export (without pagination)
      const filters: ActivityLogsFilters = {
        search: searchTerm || undefined,
        activity_type: activity || undefined,
        performed_by: performedBy || undefined,
        ordering: sortBy || "-timestamp",
        page_size: 1000, // Large number to get all results
      };

      const response = await fetchActivityLogs(filters);
      
      if (response.success) {
        const csvContent = [
          "Date & Time,Activity,Details,Performed By,IP Address,Location",
          ...response.data?.map(log => {
            const date = new Date(log.timestamp);
            const dateTime = date.toLocaleString();
            const performer = log.performed_by?.name || log.performed_by?.email || "System";
            const location = log.location || "";
            
            return `"${dateTime}","${getActivityDisplayName(log.activity_type)}","${log.details}","${performer}","${log.ip_address}","${location}"`;
          })
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "activity-logs.csv";
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        setError("Failed to export data");
      }
    } catch (err) {
      setError("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date: dateStr, time: timeStr };
  };

  return (
    <Layout className="flex flex-col">
      {/* Title, Subtitle, Action Button */}
      <ListPageHeader
        title="Activity Logs"
        subtitle="Track all system-wide activities including provider approvals, policy updates, user logins, and administrative actions."
        action={
          <Button 
            iconRight={<Icon name="download" className="font-light!" />}
            onClick={handleExportCSV}
            disabled={loading}
          >
            {loading ? "Exporting..." : "Export CSV"}
          </Button>
        }
      />
      
      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-4">
          <Icon name="error" className="text-lg" />
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => setError(null)}
          >
            <Icon name="close" />
          </button>
        </div>
      )}
      
      {/* Filters, Search */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[
            { label: "Date & Time (Newest-Oldest)", value: "-timestamp" },
            { label: "Date & Time (Oldest-Newest)", value: "timestamp" },
            { label: "Activity (A-Z)", value: "activity_type" },
            { label: "Activity (Z-A)", value: "-activity_type" },
            { label: "Performed By (A-Z)", value: "performed_by__email" },
            { label: "Performed By (Z-A)", value: "-performed_by__email" },
          ]}
          emptyValue="Default"
          className="md:w-60!"
        />
        <Select
          label="Performed By"
          value={performedBy}
          onChange={(e) => setPerformedBy(e.target.value)}
          options={uniquePerformers.map(performer => ({
            label: performer,
            value: performer,
          }))}
          emptyValue="All Users"
          className="md:w-40!"
        />
        <Select
          label="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          options={uniqueActivities.map(activityType => ({
            label: getActivityDisplayName(activityType),
            value: activityType,
          }))}
          emptyValue="All Activities"
          className="md:w-40!"
        />
        <div className="flex-1 hidden md:block" />
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Activity"
        />
      </div>
      
      {/* Table */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        )}
        
        <table className="table table-zebra rounded-tl-2xl rounded-tr-2xl mb-2.5">
          <thead className="thead">
            <tr>
              <th>Date & Time</th>
              <th>Activity</th>
              <th>Details</th>
              <th>Performed By</th>
            </tr>
          </thead>
          <tbody>
            {logs?.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No activity logs found
                </td>
              </tr>
            ) : (
              logs?.map((log) => {
                const { date, time } = formatDateTime(log.timestamp);
                const performer = log.performed_by?.name || log.performed_by?.email || "System";
                return (
                  <tr key={log.id} className="group">
                    <td>
                      <div>
                        <div className="font-medium">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </div>
                    </td>
                    <td className="font-medium">{getActivityDisplayName(log.activity_type)}</td>
                    <td>{log.details}</td>
                    <td>
                      <div>
                        <div className="font-medium">{performer}</div>
                        {log.performed_by?.email && log.performed_by?.name && (
                          <div className="text-sm text-gray-500">{log.performed_by.email}</div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <Pagination
        pagination={{
          page: currentPage,
          pageSize: pageSize,
          count: totalCount,
          maxPage: totalPages,
        }}
        loading={loading}
        onSetPageSize={(newPageSize) => {
          setPageSize(newPageSize);
          setCurrentPage(1);
        }}
        onPage={(page) => setCurrentPage(page)}
        onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        onPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      />
    </Layout>
  );
}
