"use client";

import Button from "@/components/Button";
import { errorReportsBlueIcon, LinkIcon } from "./Icons";
import IconTitle from "./IconTitle";
import { useState, useEffect } from "react";

// API Types
interface ErrorReport {
  id: number;
  timestamp: string;
  details: string;
  performed_by: {
    id: string;
    email: string;
    name: string;
  } | null;
  activity_type: string;
}

// API Service Functions
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const fetchErrorReports = async (): Promise<ErrorReport[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/activity/logs/?activity_type=ERROR_REPORT&page_size=5&ordering=-timestamp`,
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

export default function Section4() {
  const [errorReports, setErrorReports] = useState<ErrorReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadErrorReports = async () => {
      try {
        const data = await fetchErrorReports();
        setErrorReports(data);
      } catch (error) {
        console.error("Failed to load error reports:", error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadErrorReports();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <IconTitle icon={errorReportsBlueIcon} title="Error Reports" />
      <table className="table table-zebra rounded-tl-2xl rounded-tr-2xl">
        {/* head */}
        <thead className="thead">
          <tr>
            <th>Date Reported</th>
            <th>Reported By</th>
            <th>Error</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : errorReports.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No error reports
              </td>
            </tr>
          ) : (
            errorReports.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>{item.performed_by?.name || item.performed_by?.email || "System"}</td>
                <td>{item.details}</td>
                <td>
                  <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                    Open
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Button href="/admin/errors" iconRight={LinkIcon} className="self-end">
        See All Error Reports
      </Button>
    </div>
  );
}
