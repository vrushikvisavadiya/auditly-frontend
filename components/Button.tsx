interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  className?: string;
  href?: string;
}

export default function Button({
  children,
  iconRight,
  iconLeft,
  className = "",
  href,
  onClick,
  disabled,
  type,
  ...rest
}: ButtonProps) {
  const content = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  const buttonClassName = `flex items-center gap-2 
    px-3 py-2 w-fit text-sm 
    btn btn-dark-blue 
    border-none shadow-none rounded-lg
    ${className}`;

  if (href) {
    return (
      <a href={href} className={buttonClassName}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...rest}
    >
      {content}
    </button>
  );
}
