interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}

export default function MetricCard(props: MetricCardProps) {
  return (
    <div className="flex items-start gap-1 p-4 pl-3 pt-3 rounded-2xl bg-white">
      {props.icon}
      <div className="flex flex-col items-start gap-2 mt-1">
        <span className="self-stretch text-[color:var(--auditly-orange)] [font-family:Poppins] text-sm font-semibold leading-[normal]">
          {props.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[color:var(--auditly-dark-blue)] [font-family:Poppins] text-[32px] font-bold leading-[normal]">
            {props.value}
          </span>
          <span className="text-[color:var(--auditly-orange)] [font-family:Montserrat] text-sm font-semibold leading-[10px]">
            {props.change}%
          </span>
        </div>
      </div>
    </div>
  );
}
