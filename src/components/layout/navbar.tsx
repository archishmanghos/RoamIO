"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Compass,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getUser().then((res: any) => setUser(res?.data?.user));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const isAuthPage = pathname?.startsWith("/auth");
  if (isAuthPage) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-700 flex items-center justify-center group-hover:bg-amber-500 dark:group-hover:bg-amber-500 transition-colors duration-300">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              RoamIO
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ThemeToggle />
            <Link
              href="/#how-it-works"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light"
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light"
            >
              Pricing
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/plan">
                  <Button variant="amber" size="sm">Start Planning</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/#how-it-works"
              className="block text-sm text-slate-600 dark:text-slate-400 py-2"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="block text-sm text-slate-600 dark:text-slate-400 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign in</Button>
                </Link>
                <Link href="/plan" onClick={() => setMenuOpen(false)}>
                  <Button variant="amber" className="w-full">Start Planning</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
