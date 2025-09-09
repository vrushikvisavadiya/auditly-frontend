interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  className?: string;
  href?: string;
}

export default function Button(props: ButtonProps) {
  const content = (
    <>
      {props.iconLeft}
      {props.children}
      {props.iconRight}
    </>
  );
  const className = `flex items-center gap-2 
    px-3 py-2 w-fit text-sm 
    btn btn-dark-blue 
    border-none shadow-none rounded-lg
    ${props.className}`;

  if (props.href) {
    return (
      <a href={props.href} className={className}>
        {content}
      </a>
    );
  } else {
    return <button className={className}>{content}</button>;
  }
}
