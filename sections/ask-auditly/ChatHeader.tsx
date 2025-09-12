// sections/ask-auditly/ChatHeader.tsx
"use client";

export default function ChatHeader() {
  return (
    <div className="bg-[#FF7F7F] text-white py-12 px-6 pb-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="text-4xl">👋</div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Hi, how may I help you?
          </h1>
        </div>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          I&apos;m here to answer your questions and get you sorted with your
          policies.
        </p>
      </div>
    </div>
  );
}
