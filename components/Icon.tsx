interface IconProps {
  name: string;
  className?: string;
}

export default function Icon(props: IconProps) {
  const { name, className } = props;
  return (
    <span className={"material-symbols-rounded " + className}>{name}</span>
  );
}
