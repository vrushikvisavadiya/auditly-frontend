import Icon from "./Icon";

export default function SearchBar(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <label className="auditly-input w-full md:w-80!">
      <input type="search" required placeholder="Search" {...props} />
      <Icon name="search" className="font-light!" />
    </label>
  );
}
