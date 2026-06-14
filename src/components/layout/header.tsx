"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import { DEMO_PRO } from "@/lib/demo"; // REMOVE in Sprint 2

function useAuthMock() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = () =>
      setLoggedIn(localStorage.getItem("nearlyMockAuth") === "true");
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  const signOut = () => {
    localStorage.removeItem("nearlyMockAuth");
    setLoggedIn(false);
  };

  return { loggedIn, signOut };
}

export function Header() {
  const router = useRouter();
  const { loggedIn, signOut } = useAuthMock();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-sm border-b border-border px-6 lg:px-20 py-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/nearly-logo.png"
            alt="Nearly logo"
            width={32}
            height={32}
            className="size-8"
          />
          <h1 className="text-xl font-bold tracking-tight">Nearly</h1>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm font-semibold hover:text-primary transition-colors">
            Find a Service
          </Link>
          <Link href="/how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/become-a-pro" className="text-sm font-semibold hover:text-primary transition-colors">
            Become a Pro
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            /* Logged-in state */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 border border-border rounded-full pl-3 pr-2 py-1.5 hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-semibold hidden sm:block">{DEMO_PRO.firstName}</span>
                {/* REMOVE in Sprint 2 — replace with real session avatar */}
                <div
                  className="size-7 rounded-full bg-cover bg-center bg-primary shrink-0"
                  style={{ backgroundImage: `url('${DEMO_PRO.avatarUrl}')` }}
                />
                <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="size-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/pro/${DEMO_PRO.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    <User className="size-4 text-muted-foreground" />
                    My profile
                  </Link>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-accent transition-colors text-left"
                  >
                    <LogOut className="size-4 text-muted-foreground" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out state */
            <>
              <Button variant="ghost" className="hidden sm:block px-4 py-2 text-sm font-bold" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="bg-primary text-primary-foreground px-5 py-2 text-sm font-bold hover:opacity-90" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
