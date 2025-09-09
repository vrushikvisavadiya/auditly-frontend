import Icon from "./Icon";

interface InputWrapperProps {
  label: string;
  topRightElement?: React.ReactNode;
  children: React.ReactNode;
  errorMessage?: string;
}

export default function InputWrapper(props: InputWrapperProps) {
  return (
    <fieldset className="fieldset w-full py-0 gap-2!">
      {/* Label */}
      <legend className="fieldset-legend w-full text-[color:var(--auditly-dark-blue)] text-base font-semibold leading-[normal]">
        {props.label}
        {props.topRightElement}
      </legend>
      {/* Input */}
      {props.children}
      {/* Error Message */}
      {props.errorMessage && (
        <div className="flex items-center gap-1">
          <Icon
            name="warning"
            className="text-[var(--auditly-orange)] text-lg! filled-icon"
          />
          <span className="label text-[color:var(--auditly-orange)] [font-family:Montserrat] text-xs font-normal leading-[normal]">
            {props.errorMessage}
          </span>
        </div>
      )}
    </fieldset>
  );
}
