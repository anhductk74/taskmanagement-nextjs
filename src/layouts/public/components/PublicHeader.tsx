"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui";

interface PublicHeaderProps {
  variant?: "default" | "transparent";
}

export default function PublicHeader({
  variant = "default",
}: PublicHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isTransparent = variant === "transparent";

  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-opacity-90 backdrop-blur border-b-2 border-red-500/20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-xl text-white drop-shadow">TaskManager</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">

            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-200 hover:text-red-400 font-semibold"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-slate-200 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-2 border-red-500/20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/features"
                className="block px-3 py-2 text-base font-semibold text-slate-200 hover:text-white"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 text-base font-semibold text-slate-200 hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-semibold text-slate-200 hover:text-white"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-semibold text-slate-200 hover:text-white"
              >
                Contact
              </Link>
              <div className="pt-4 space-y-2">

                <Link href="/dashboard" className="block">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="text-slate-200 hover:text-red-400 font-semibold"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
