"use client";

import Layout from "../Layout";
import Button from "@/components/Button";
import EllipsisDropdown from "@/components/EllipsisDropdown";
import Icon from "@/components/Icon";
import ListPageHeader from "@/components/ListPageHeader";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Select from "@/components/Select";

interface Policy {
  id: string;
  policy: string;
  version: string; // semantic version
  lastModified: string; // ISO date
  modifiedBy: string;
}

// Mock data
const data: Policy[] = [
  {
    id: "p1",
    policy: "Incident Management and Reportable Incidents Policy",
    version: "v3.2",
    lastModified: "2025-08-20T11:15:00Z",
    modifiedBy: "Tania Gomez",
  },
  {
    id: "p2",
    policy: "Complaints and Feedback Management Policy",
    version: "v2.5",
    lastModified: "2025-08-10T13:00:00Z",
    modifiedBy: "Tania Gomez",
  },
  {
    id: "p3",
    policy: "Risk Management Policy",
    version: "v3.2",
    lastModified: "2025-08-18T09:40:00Z",
    modifiedBy: "Tania Gomez",
  },
  {
    id: "p4",
    policy: "Behaviour Support and Restrictive Practices Policy",
    version: "v2.5",
    lastModified: "2025-08-08T16:50:00Z",
    modifiedBy: "Tania Gomez",
  },
  {
    id: "p5",
    policy: "Safeguarding and Child Protection Policy",
    version: "v3.2",
    lastModified: "2025-08-15T03:10:00Z",
    modifiedBy: "Tania Gomez",
  },
  {
    id: "p6",
    policy: "WHS (Work Health and Safety) Policy",
    version: "v2.5",
    lastModified: "2025-08-05T02:35:00Z",
    modifiedBy: "Tania Gomez",
  },
  {
    id: "p7",
    policy: "Worker Screening and Recruitment Policy",
    version: "v3.2",
    lastModified: "2025-08-12T10:25:00Z",
    modifiedBy: "Tania Gomez",
  },
  {
    id: "p8",
    policy: "Privacy and Confidentiality Policy",
    version: "v2.5",
    lastModified: "2025-08-02T12:20:00Z",
    modifiedBy: "Rongen Robles",
  },
];

export default function Policies() {
  return (
    <Layout className="flex flex-col">
      {/* Title */}
      <ListPageHeader
        title="Manage Your Policies"
        subtitle="Create, edit, and monitor all policies in one place for easy tracking and updates."
        action={
          <Button
            iconRight={<Icon name="arrow_outward" className="font-light!" />}
            href="/admin/policies/archived"
          >
            View Archives
          </Button>
        }
      />
      {/* Filters, Search */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select
          label="Sort By"
          options={[
            { label: "Last Modified (Newest-Oldest)", value: "modified-asc" },
            { label: "Last Modified (Oldest-Newest)", value: "modified-desc" },
            { label: "Version (Ascending)", value: "version-asc" },
            { label: "Version (Descending)", value: "version-desc" },
          ]}
          // emptyValue="Default"
          className="md:w-72!"
        />
        <Select
          label="Modified By"
          options={[
            { label: "Tania Gomez", value: "Tania Gomez" },
            { label: "Rongen Robles", value: "Rongen Robles" },
          ]}
          // emptyValue="All Status"
          className="md:w-60!"
        />
        <div className="flex-1 hidden md:block" />
        <SearchBar />
      </div>
      {/* Table */}
      <table className="table table-zebra rounded-tl-2xl rounded-tr-2xl mb-2.5">
        <thead className="thead">
          <tr>
            <th>Policy</th>
            <th>Version</th>
            <th>Last Modified</th>
            <th>Modified By</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="group">
              <td className="whitespace-pre-wrap max-w-[360px]">{p.policy}</td>
              <td>
                <a className="text-[var(--auditly-light-blue)] [font-family:Poppins] text-sm underline decoration-dotted [text-decoration-skip-ink:auto] decoration-auto underline-offset-auto [text-underline-position:from-font]">
                  {p.version}
                </a>
              </td>
              <td>
                {new Date(p.lastModified).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                {", "}
                {new Date(p.lastModified).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>
              <td>{p.modifiedBy}</td>
              <td className="px-1">
                <EllipsisDropdown
                  actions={[
                    {
                      label: "View",
                      icon: (
                        <Icon
                          name="visibility"
                          className="text-[var(--auditly-orange)] text-sm!"
                        />
                      ),
                    },
                    {
                      label: "Upload New Version",
                      icon: (
                        <Icon
                          name="upload"
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
