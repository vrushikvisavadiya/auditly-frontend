import {
  errorReportsIcon,
  newProviderIcon,
  policiesGeneratedIcon,
  totalProviderIcon,
} from "./Icons";
import MetricCard from "./MetricCard";

export default function Section1() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start">
        <h2 className="self-stretch text-[color:var(--auditly-dark-blue,#1A204C)] [font-family:Poppins] text-[32px] font-bold leading-[normal]">
          While you’re away...
        </h2>
        <p className="self-stretch text-black [font-family:Poppins] text-sm font-normal leading-[normal]">
          Here’s a quick recap of everything that happened while you were
          offline—new updates, changes, and actions from your team, all in one
          place.
        </p>
      </div>
      <div className="flex p-4 flex-col items-start gap-2 self-stretch rounded-2xl [background:rgba(245,132,106,0.10)]">
        <h3 className="self-stretch text-[color:var(--auditly-dark-blue,#1A204C)] [font-family:Poppins] text-xl font-semibold leading-[normal]">
          At-a-Glance Stats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
          <MetricCard
            icon={newProviderIcon}
            title="New Providers"
            value="20"
            change="20"
          />
          <MetricCard
            icon={totalProviderIcon}
            title="Total Providers"
            value="152"
            change="20"
          />
          <MetricCard
            icon={policiesGeneratedIcon}
            title="Policies Generated"
            value="234"
            change="20"
          />
          <MetricCard
            icon={errorReportsIcon}
            title="Error reports"
            value="2"
            change="20"
          />
        </div>
      </div>
    </div>
  );
}
