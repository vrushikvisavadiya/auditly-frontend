"use client";

import Button from "@/components/Button";
import { LinkIcon, newProviderAwaitingApprovalIcon } from "./Icons";
import IconTitle from "./IconTitle";
import { useState, useEffect } from "react";

// API Types
interface Provider {
  id: string;
  created_at: string;
  org_name: string;
  email: string;
  contact_person: string;
  status: string;
}

// API Service Functions
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const fetchPendingProviders = async (): Promise<Provider[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/accounts/signup-requests-list/?status=PENDING&page_size=5`,
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

export default function Section3() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await fetchPendingProviders();
        setProviders(data);
      } catch (error) {
        console.error("Failed to load pending providers:", error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <IconTitle
        icon={newProviderAwaitingApprovalIcon}
        title="New Providers Awaiting Approval"
      />
      <table className="table table-zebra rounded-tl-2xl rounded-tr-2xl">
        {/* head */}
        <thead className="thead">
          <tr>
            <th>Date Registered</th>
            <th>Provider Name</th>
            <th>Email</th>
            <th>Contact Person</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : providers.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No pending providers
              </td>
            </tr>
          ) : (
            providers.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>{item.org_name}</td>
                <td>
                  <a
                    className="text-[color:var(--auditly-light-blue)] text-center 
                      [font-family:Poppins] text-sm font-normal leading-[normal]
                      underline decoration-dotted [text-decoration-skip-ink:auto]
                      decoration-auto underline-offset-auto [text-underline-position:from-font]"
                    href={`mailto:${item.email}`}
                  >
                    {item.email}
                  </a>
                </td>
                <td>{item.contact_person}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Button href="/admin/providers" iconRight={LinkIcon} className="self-end">
        See All Providers
      </Button>
    </div>
  );
}
