import Tabs from "@/components/Tabs";
import Header from "./Header";
import clsx from "clsx";

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}
export default function Layout(props: LayoutProps) {
  const tabs = [
    { label: "Dashboard", link: "/admin/dashboard" },
    { label: "Providers", link: "/admin/providers" },
    { label: "Policies", link: "/admin/policies" },
    { label: "Team", link: "/admin/team" },
    { label: "Logs", link: "/admin/logs" },
    { label: "Feedback", link: "/admin/feedback" },
  ];
  return (
    <div className="flex flex-col h-screen [background:linear-gradient(0deg,rgba(88,120,187,0.10)_0%,rgba(88,120,187,0.10)_100%),#FFF]">
      {/* Header */}
      <Header />
      <Tabs tabs={tabs} />
      <div className="p-8 [background:linear-gradient(0deg,rgba(88,120,187,0.10)_0%,rgba(88,120,187,0.10)_100%),#FFF]">
        <div
          className={clsx(
            "overflow-auto rounded-2xl bg-white p-6",
            props.className
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
