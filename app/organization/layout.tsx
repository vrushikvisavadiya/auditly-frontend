// app/welcome/layout.tsx

import WelcomeHeader from "@/components/welcome/WelcomeHeader";

interface WelcomeLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: WelcomeLayoutProps) {
  return (
    <>
      <WelcomeHeader />
      {children}
    </>
  );
}
