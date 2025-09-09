import Button from "@/components/Button";
import { LinkIcon, recentActivityIcon } from "./Icons";
import IconTitle from "./IconTitle";

export default function Section2() {
  interface Activity {
    date: string;
    activity: string;
    details: string;
  }

  const data: Activity[] = [
    {
      date: "2024-10-01",
      activity: "User Login",
      details: "User John logged in",
    },
    {
      date: "2024-10-01",
      activity: "Policy Created",
      details: "Policy ABC created",
    },
    {
      date: "2024-10-02",
      activity: "User Logout",
      details: "User John logged out",
    },
  ];

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
          {data.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.date).toLocaleString()}</td>
              <td>{item.activity}</td>
              <td>{item.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button href="/admin/activies" iconRight={LinkIcon} className="self-end">
        See All Activity
      </Button>
    </div>
  );
}
