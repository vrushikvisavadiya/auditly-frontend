interface BreadCrumb {
  label: string;
  href?: string;
}

interface ListPageHeaderProps {
  breadcrumbs?: BreadCrumb[];
  title: string;
  subtitle: string;
  action: React.ReactNode;
}

export default function ListPageHeader(props: ListPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-5">
      <div className="flex flex-col items-start">
        {props.breadcrumbs && (
          <div className="breadcrumbs text-sm text-[var(--auditly-light-blue)]">
            <ul>
              {props.breadcrumbs.map((bc, index) => (
                <li key={index}>
                  <a href={bc.href}>{bc.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <h2 className="text-[color:var(--auditly-dark-blue)] [font-family:Poppins] text-2xl font-bold leading-[normal]">
          {props.title}
        </h2>
        <p className="text-[color:var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-normal leading-[normal]">
          {props.subtitle}
        </p>
      </div>
      {props.action}
    </div>
  );
}
