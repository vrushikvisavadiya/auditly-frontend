// app/welcome/page.tsx
"use client";
import StepProgress from "@/sections/welcome/StepProgress";
import { Suspense } from "react";

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <StepProgress />
    </Suspense>
  );
}
