"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_PRO } from "@/lib/demo"; // REMOVE in Sprint 2
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  UserCircle,
  ExternalLink,
  LogOut,
  PlusCircle,
} from "lucide-react";

const NAV = [
  { label: "Overview",    href: "/dashboard",              icon: LayoutDashboard },
  { label: "My Services", href: "/dashboard/services",     icon: Briefcase },
  { label: "Inquiries",   href: "/dashboard/inquiries",    icon: MessageSquare },
  { label: "Profile",     href: "/dashboard/profile",      icon: UserCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-card h-screen sticky top-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">Makevo</span>
          </Link>
        </div>

        {/* Demo banner */}
        <div className="mx-3 mt-3 px-3 py-2 bg-primary/10 rounded-lg text-xs font-semibold text-primary">
          Demo mode — auth coming in Sprint 2
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}

          <div className="pt-3">
            <Link
              href="/dashboard/services/new"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="size-4 shrink-0" />
              Post a service
            </Link>
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-border space-y-0.5">
          {/* REMOVE in Sprint 2 — replace DEMO_PRO.id with real session profile ID */}
          <Link
            href={`/pro/${DEMO_PRO.id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ExternalLink className="size-4 shrink-0" />
            View public profile
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <LogOut className="size-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold tracking-tight">Makevo</span>
        </Link>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
          Pro Dashboard
        </span>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
