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

interface Provider {
  dateRegisted: string;
  contactPerson: string;
  providerName: string;
  email: string;
  phoneNumber: string;
  status: string;
}

const data: Provider[] = [
  {
    dateRegisted: "2024-05-01",
    contactPerson: "Alice Johnson",
    providerName: "Acme Health",
    email: "alice@acmehealth.com",
    phoneNumber: "+1 555-1234",
    status: "Approved",
  },
  {
    dateRegisted: "2024-05-10",
    contactPerson: "Bob Smith",
    providerName: "Wellness Corp",
    email: "bob@wellnesscorp.com",
    phoneNumber: "+1 555-5678",
    status: "Pending",
  },
  {
    dateRegisted: "2024-06-02",
    contactPerson: "Carol Lee",
    providerName: "CarePlus",
    email: "carol@careplus.com",
    phoneNumber: "+1 555-8765",
    status: "Rejected",
  },
  {
    dateRegisted: "2024-06-15",
    contactPerson: "David Kim",
    providerName: "HealthFirst",
    email: "david@healthfirst.com",
    phoneNumber: "+1 555-4321",
    status: "Approved",
  },
];

export default function Providers() {
  return (
    <Layout className="flex flex-col">
      {/* Title, Subtitle, Action Button */}
      <ListPageHeader
        title="Manage Your Providers"
        subtitle="View and manage all registered providers."
        action={
          <Button iconRight={<Icon name="download" className="font-light!" />}>
            Export as CSV
          </Button>
        }
      />
      {/* Filters, Search */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select
          label="Status"
          options={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
          // emptyValue="All Status"
          className="md:w-40!"
        />
        <Select
          label="Sort By"
          options={[
            { label: "Provider Name (A-Z)", value: "name-asc" },
            { label: "Provider Name (Z-A)", value: "name-desc" },
            { label: "Registration Date (Newest-Oldest)", value: "date-desc" },
            { label: "Registration Date (Oldest-Newest)", value: "date-asc" },
          ]}
          // emptyValue="Default"
          className="md:w-80!"
        />
        <div className="flex-1 hidden md:block" />
        <SearchBar />
      </div>
      {/* Table */}
      <table className="table table-zebra rounded-tl-2xl rounded-tr-2xl mb-2.5">
        {/* head */}
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
          {data.map((provider, index) => (
            <tr key={index} className="group">
              <td>
                {new Date(provider.dateRegisted).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td>{provider.contactPerson}</td>
              <td>{provider.providerName}</td>
              <td>{provider.email}</td>
              <td>{provider.phoneNumber}</td>
              <td>
                <span
                  className={clsx(
                    "px-3 py-2 rounded-lg text-sm",
                    {
                      "bg-[#EAF7ED] text-[#28A745]":
                        provider.status === "Approved",
                    },
                    {
                      "bg-[#FFF6E6] text-[#FF9D00]":
                        provider.status === "Pending",
                    },
                    {
                      "bg-[#FEEAEA] text-[#ED2525]":
                        provider.status === "Rejected",
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
                    },
                    {
                      label: "Approve",
                      icon: (
                        <Icon
                          name="check_circle"
                          className="text-[var(--auditly-orange)] text-sm!"
                        />
                      ),
                    },
                    {
                      label: "Delete",
                      icon: (
                        <Icon
                          name="delete"
                          className="text-[var(--auditly-orange)] text-sm!"
                        />
                      ),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <Pagination
        pagination={{
          page: 1,
          pageSize: 5,
          count: data.length,
          maxPage: Math.ceil(data.length / 5),
        }}
        loading={false}
        onSetPageSize={function (): void {
          throw new Error("Function not implemented.");
        }}
        onPage={function (): void {
          throw new Error("Function not implemented.");
        }}
        onNext={function (): void {
          throw new Error("Function not implemented.");
        }}
        onPrevious={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Layout>
  );
}
