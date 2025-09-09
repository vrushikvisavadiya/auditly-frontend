interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  emptyValue?: string;
  label: string;
  className?: string;
}

export default function Select(props: SelectProps) {
  const { options, emptyValue, label, className, ...restProps } = props;
  return (
    <select className={"select auditly-input " + className} {...restProps}>
      <option disabled={true}>{label}</option>
      {emptyValue && props.value !== "" && (
        <option value="">{emptyValue}</option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
