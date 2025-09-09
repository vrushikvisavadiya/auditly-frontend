// app/welcome/layout.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "@/src/redux/store";

interface WelcomeLayoutProps {
  children: React.ReactNode;
}

export default function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#2B2B52] text-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Business Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white text-[#2B2B52] rounded flex items-center justify-center font-bold text-sm">
                  BN
                </div>
                <span className="font-medium text-white">Business Name</span>
              </div>

              {/* Right side - Navigation */}
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Help Center</span>
                </button>
                <button className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Contact Auditly</span>
                </button>
                <button className="text-sm hover:bg-white/10 px-3 py-2 rounded transition-colors">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-gray-50 min-h-[calc(100vh-80px)]">{children}</main>
      </div>
    </Provider>
  );
}
