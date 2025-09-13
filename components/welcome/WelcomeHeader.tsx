"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { logout } from "@/src/redux/slices/authSlice";
import HelpIcon from "../../public/icons/Help.svg";
import AuditlyLogo from "../../public/icons/auditly-logo.svg";
import { selectCurrentUser } from "@/src/redux/slices/userSlice";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Link from "next/link";
import { ROUTES } from "@/src/routes/constants";

export default function WelcomeHeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);

  const router = useRouter();

  const handleLogout = () => {
    // Dispatch Redux logout action
    dispatch(logout());

    // Clear all localStorage data
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("accessExpiresAt");
      localStorage.removeItem("refreshExpiresAt");
    }

    // Redirect to login page
    router.push("/login");
  };

  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
    const dialog = document.getElementById(
      "logout-confirmation"
    ) as HTMLDialogElement | null;
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  };

  const handleLogoutConfirm = () => {
    handleLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="sticky top-0 bg-[var(--auditly-dark-blue)] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#5878BB] text-white rounded-full flex items-center justify-center font-bold text-sm uppercase">
                {currentUser?.organization_name?.slice(0, 2) || ""}
              </div>
              <span className="font-semibold text-base text-white hidden sm:inline">
                {currentUser?.organization_name || ""}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href={ROUTES.POLICY_GUIDE}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <HelpIcon className="w-4 h-4" />
                <span className="text-sm">Policy Guide</span>
              </Link>
              <Link
                href={ROUTES.ASK_AUDITLY}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <AuditlyLogo />
                <span className="text-sm">Ask Auditly</span>
              </Link>
              <div className="w-px h-6 bg-white/20 mx-2"></div>
              <button
                onClick={showLogoutConfirmation}
                className="text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                Log out
              </button>
            </nav>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/20 py-4 space-y-2">
              <Link
                href={ROUTES.POLICY_GUIDE}
                className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <HelpIcon className="w-4 h-4" />
                <span className="text-sm">Policy Guide</span>
              </Link>
              <Link
                href={ROUTES.ASK_AUDITLY}
                className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Ask Auditly</span>
              </Link>
              <button
                onClick={showLogoutConfirmation}
                className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm">Log out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        id="logout-confirmation"
        title="Are you sure you want to log out?"
        description="You’ll be signed out of your account and will need to log in again to continue."
        confirmText="Log out"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        variant="warning"
      />
    </>
  );
}
