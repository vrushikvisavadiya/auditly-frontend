import Button from "@/components/Button";
import { LinkIcon, newProviderAwaitingApprovalIcon } from "./Icons";
import IconTitle from "./IconTitle";

export default function Section3() {
  interface Provider {
    dateRegistered: string;
    providerName: string;
    email: string;
    contactPerson: string;
  }
  const data: Provider[] = [
    {
      dateRegistered: "2024-10-01",
      providerName: "Provider A",
      email: "info@providerA.com",
      contactPerson: "Alice",
    },
    {
      dateRegistered: "2024-10-02",
      providerName: "Provider B",
      email: "info@providerB.com",
      contactPerson: "Tom",
    },
    {
      dateRegistered: "2024-10-03",
      providerName: "Provider C",
      email: "info@providerC.com",
      contactPerson: "Jerry",
    },
  ];
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
          {data.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.dateRegistered).toLocaleString()}</td>
              <td>{item.providerName}</td>
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
              <td>{item.contactPerson}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button href="/admin/providers" iconRight={LinkIcon} className="self-end">
        See All Providers
      </Button>
    </div>
  );
}
