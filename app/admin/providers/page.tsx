"use client";

import Button from "@/components/Button";
import Layout from "../Layout";
import Pagination from "@/components/Pagination";
import Select from "@/components/Select";
import SearchBar from "@/components/SearchBar";
import EllipsisDropdown from "@/components/EllipsisDropdown";
import Icon from "@/components/Icon";
import clsx from "clsx";
import ListPageHeader from "@/components/ListPageHeader";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

// API Types
interface Provider {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  email: string;
  contact_person: string;
  phone_number: string;
  org_name: string;
  created_at: string;
}

interface ProvidersResponse {
  success: boolean;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  data: Provider[];
}

interface DecideRequestResponse {
  success: boolean;
  message: string;
  data: null;
}

// API Service Functions
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const fetchProviders = async (filters: {
  status?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<ProvidersResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/accounts/signup-requests-list/?${params}`,
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

const decideProviderRequest = async (requestId: string, action: "APPROVE" | "REJECT"): Promise<DecideRequestResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/accounts/signup-request/decide/?request_id=${requestId}&action=${action}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProviders({
        status: statusFilter || undefined,
        page: currentPage,
        page_size: pageSize,
      });
      
      console.log("API Response:", response); // Debug log
      
      if (response.success) {
        setProviders(response.data);
        setTotalCount(response.count);
        console.log("Providers set:", response.data); // Debug log
      } else {
        setError(response.message || "Failed to fetch providers");
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
  }, [currentPage, pageSize, statusFilter]);

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

  const handleApprove = async (providerId: string) => {
    try {
      setLoading(true);
      const response = await decideProviderRequest(providerId, "APPROVE");
      
      if (response.success) {
        toast.success(response.message);
        fetchData(); // Refresh the list
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve provider");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (providerId: string) => {
    try {
      setLoading(true);
      const response = await decideProviderRequest(providerId, "REJECT");
      
      if (response.success) {
        toast.success(response.message);
        fetchData(); // Refresh the list
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject provider");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      
      // Fetch all data for export (without pagination)
      const response = await fetchProviders({
        status: statusFilter || undefined,
        page_size: 1000, // Large number to get all results
      });
      
      if (response.success) {
        const csvContent = [
          "Date Registered,Contact Person,Provider Name,Email,Phone Number,Status",
          ...response.data.map(provider => {
            const date = new Date(provider.created_at);
            const dateStr = date.toLocaleDateString();
            const contactPerson = provider.contact_person;
            
            return `"${dateStr}","${contactPerson}","${provider.org_name}","${provider.email}","${provider.phone_number}","${provider.status}"`;
          })
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "providers.csv";
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

  const totalPages = Math.ceil(totalCount / pageSize);

  // Filter providers based on search term
  const filteredProviders = useMemo(() => {
    if (!searchTerm) return providers;
    
    return providers.filter(provider => 
      provider.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [providers, searchTerm]);

  return (
    <Layout className="flex flex-col">
      {/* Title, Subtitle, Action Button */}
      <ListPageHeader
        title="Manage Your Providers"
        subtitle="View and manage all registered providers."
        action={
          <Button 
            iconRight={<Icon name="download" className="font-light!" />}
            onClick={handleExportCSV}
            disabled={loading}
          >
            {loading ? "Exporting..." : "Export as CSV"}
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
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: "All Status", value: "" },
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ]}
          className="md:w-40!"
        />
        <div className="flex-1 hidden md:block" />
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search providers..."
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
              <th>Date Registered</th>
              <th>Contact Person</th>
              <th>Provider Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders?.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No providers found
                </td>
              </tr>
            ) : (
              filteredProviders?.map((provider) => (
                <tr key={provider.id} className="group">
                  <td>
                    {new Date(provider.created_at).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{provider.contact_person}</td>
                  <td>{provider.org_name}</td>
                  <td>{provider.email}</td>
                  <td>{provider.phone_number}</td>
                  <td>
                    <span
                      className={clsx(
                        "px-3 py-2 rounded-lg text-sm",
                        {
                          "bg-[#EAF7ED] text-[#28A745]":
                            provider.status === "APPROVED",
                        },
                        {
                          "bg-[#FFF6E6] text-[#FF9D00]":
                            provider.status === "PENDING",
                        },
                        {
                          "bg-[#FEEAEA] text-[#ED2525]":
                            provider.status === "REJECTED",
                        }
                      )}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-1">
                    <EllipsisDropdown
                      actions={[
                        {
                          label: "View Details",
                          icon: (
                            <Icon
                              name="visibility"
                              className="text-[var(--auditly-orange)] text-sm!"
                            />
                          ),
                          onClick: () => {
                            // TODO: Implement view details modal
                            console.log("View details for:", provider.id);
                          }
                        },
                        ...(provider.status === "PENDING" ? [
                          {
                            label: "Approve",
                            icon: (
                              <Icon
                                name="check_circle"
                                className="text-green-600 text-sm!"
                              />
                            ),
                            onClick: () => handleApprove(provider.id)
                          },
                          {
                            label: "Reject",
                            icon: (
                              <Icon
                                name="cancel"
                                className="text-red-600 text-sm!"
                              />
                            ),
                            onClick: () => handleReject(provider.id)
                          }
                        ] : [])
                      ]}
                    />
                  </td>
                </tr>
              ))
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
