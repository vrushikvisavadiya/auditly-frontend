import Button from "@/components/Button";
import { errorReportsBlueIcon, LinkIcon } from "./Icons";
import IconTitle from "./IconTitle";

export default function Section4() {
  interface ErrorReport {
    dateReported: string;
    reportedBy: string;
    error: string;
    status: string;
  }

  const data: ErrorReport[] = [
    {
      dateReported: "2024-10-01",
      reportedBy: "Alice",
      error: "Failed to generate policy",
      status: "Open",
    },
    {
      dateReported: "2024-10-02",
      reportedBy: "Bob",
      error: "Provider data mismatch",
      status: "In Progress",
    },
    {
      dateReported: "2024-10-03",
      reportedBy: "Charlie",
      error: "Unauthorized access attempt",
      status: "Resolved",
    },
  ];
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
          {data.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.dateReported).toLocaleString()}</td>
              <td>{item.reportedBy}</td>
              <td>{item.error}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button href="/admin/errors" iconRight={LinkIcon} className="self-end">
        See All Error Reports
      </Button>
    </div>
  );
}
