"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Briefcase } from "lucide-react";

type Role = "client" | "pro";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("client");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sprint 2: replace with real Supabase sign-up call
    localStorage.setItem("makevoMockAuth", "true");
    router.push(role === "pro" ? "/pro/onboarding" : "/search");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-5 border-b border-border bg-card">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <span className="font-bold text-lg tracking-tight">Makevo</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Join Makevo</h1>
          <p className="text-muted-foreground mb-8">
            Connect with creative professionals or showcase your craft.
          </p>

          {/* Role toggle */}
          <div className="mb-6">
            <p className="text-sm font-bold mb-3">I want to…</p>
            <div className="grid grid-cols-2 gap-3">
              {(["client", "pro"] as Role[]).map((r) => {
                const Icon = r === "client" ? User : Briefcase;
                const label = r === "client" ? "Hire a Pro" : "Become a Pro";
                const sub = r === "client" ? "Find skilled makers" : "Showcase my craft";
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-colors ${
                      role === r
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div
                      className={`size-9 rounded-full flex items-center justify-center ${
                        role === r ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${role === r ? "text-primary" : ""}`}>
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
              <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
                Full name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                required
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
              <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              {role === "pro" ? "Create Pro account" : "Create account"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By signing up you agree to our{" "}
              <span className="underline cursor-pointer">Terms</span> and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-foreground hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
