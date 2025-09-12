"use client";

import Button from "@/components/Button";
import { LinkIcon, recentActivityIcon } from "./Icons";
import IconTitle from "./IconTitle";
import { useState, useEffect } from "react";

// API Types
interface Activity {
  id: number;
  timestamp: string;
  activity_type: string;
  details: string;
  performed_by: {
    id: string;
    email: string;
    name: string;
  } | null;
}

// API Service Functions
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const fetchRecentActivity = async (): Promise<Activity[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/activity/logs/?page_size=5&ordering=-timestamp`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
};

// Activity type mapping for display
const getActivityDisplayName = (activityType: string): string => {
  const mapping: Record<string, string> = {
    LOGIN: "User Login",
    LOGOUT: "User Logout",
    USER_CREATED: "User Registration",
    USER_UPDATED: "User Update",
    USER_DELETED: "User Deletion",
    PROVIDER_APPROVAL: "Provider Approval",
    PROFILE_UPDATE: "Profile Update",
    PASSWORD_RESET: "Password Reset",
    PASSWORD_CHANGED: "Password Changed",
    POLICY_CREATED: "Policy Created",
    ERROR_REPORT: "Error Report",
  };
  return mapping[activityType] || activityType;
};

export default function Section2() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchRecentActivity();
        setActivities(data);
      } catch (error) {
        console.error("Failed to load recent activities:", error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <IconTitle icon={recentActivityIcon} title="Recent Activity" />
      <table className="table table-zebra rounded-tl-2xl rounded-tr-2xl">
        {/* head */}
        <thead className="thead">
          <tr>
            <th>Date</th>
            <th>Activity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : activities.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No recent activity
              </td>
            </tr>
          ) : (
            activities.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>{getActivityDisplayName(item.activity_type)}</td>
                <td>{item.details}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Button href="/admin/activies" iconRight={LinkIcon} className="self-end">
        See All Activity
      </Button>
    </div>
  );
}
