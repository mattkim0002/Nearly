"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    // Sprint 2: replace with real Supabase magic link call
    setSent(true);
  };

  const handleMockLogin = () => {
    localStorage.setItem("makevoMockAuth", "true");
    router.push("/dashboard");
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
        <div className="w-full max-w-[400px]">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to your Makevo account.</p>

          {!sent ? (
            <>
              {/* Magic link form */}
              <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
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
                  <Mail className="size-4 mr-2" />
                  Send magic link
                </Button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#faf8f5] px-3 text-xs text-muted-foreground font-medium">
                    or
                  </span>
                </div>
              </div>

              {/* OAuth stub */}
              <Button variant="outline" size="lg" className="w-full mb-8" onClick={handleMockLogin}>
                <svg className="size-4 mr-2" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </>
          ) : (
            <div className="border border-border rounded-2xl p-6 text-center mb-8">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="size-6 text-primary" />
              </div>
              <h3 className="font-bold mb-1">Check your inbox</h3>
              <p className="text-muted-foreground text-sm">
                We sent a magic link to your email. Click it to sign in.
              </p>
              <button
                className="mt-4 text-sm font-semibold text-primary hover:underline"
                onClick={() => setSent(false)}
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Demo shortcut */}
          <div className="border border-dashed border-border rounded-xl p-4 bg-primary/5 text-center mb-6">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Demo mode — skip auth for now
            </p>
            <button
              onClick={handleMockLogin}
              className="text-sm font-bold text-primary hover:underline"
            >
              Enter as a Pro →
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
