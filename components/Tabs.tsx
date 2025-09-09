"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  link: string;
}
interface TabsProps {
  tabs: Tab[];
}

export default function Tabs(props: TabsProps) {
  const pathName = usePathname();
  return (
    <div
      role="tablist"
      className="tabs tabs-box bg-[var(--auditly-light-blue)] rounded-none py-0 px-6"
    >
      {props.tabs.map((tab) => (
        <a
          key={tab.label}
          href={tab.link !== pathName ? tab.link : undefined}
          role="tab"
          className={clsx(
            "tab",
            { "tab-active": pathName.startsWith(tab.link) },
            "rounded-none!",
            "px-3",
            "border-r-[rgba(255,255,255,0.20)]! border-r! border-solid!"
          )}
        >
          <span className="text-white text-sm [font-family:Poppins] font-semibold uppercase">
            {tab.label}
          </span>
        </a>
      ))}
    </div>
  );
}
