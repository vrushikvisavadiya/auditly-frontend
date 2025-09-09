interface IconTitleProps {
  title: string;
  icon: React.ReactNode;
}

export default function IconTitle(props: IconTitleProps) {
  return (
    <div className="flex gap-2 items-center">
      {props.icon}
      <h3 className="text-[color:var(--auditly-dark-blue)] [font-family:Poppins] text-xl font-semibold leading-[normal]">
        {props.title}
      </h3>
    </div>
  );
}
