import Icon from "./Icon";

interface Action {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

interface EllipsisDropdownProps {
  actions: Action[];
}

export default function EllipsisDropdown(props: EllipsisDropdownProps) {
  return (
    <div className="dropdown dropdown-top dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-xs btn-ghost btn-circle"
      >
        <Icon name="more_vert" className="text-xl" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-max p-2 shadow-sm"
      >
        {props.actions.map((action, index) => (
          <li key={index}>
            <a
              className="flex items-center gap-4"
              href={action.href}
              onClick={action.onClick}
            >
              {action.icon}
              <span>{action.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
