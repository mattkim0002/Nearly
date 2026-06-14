"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ImagePlus, ArrowRight } from "lucide-react";

const CRAFTS = [
  "Photography",
  "Woodworking",
  "Ceramics",
  "Illustration",
  "Interior Design",
];

const STEPS = ["Your craft", "Your profile", "Photo", "All set"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:block ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 mx-1 ${i < current ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Step 1 — Pick your craft(s)
function Step1({
  selected,
  toggle,
  onNext,
}: {
  selected: string[];
  toggle: (c: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-1">What do you do?</h2>
      <p className="text-muted-foreground mb-6">Select all that apply — you can change this later.</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {CRAFTS.map((craft) => {
          const active = selected.includes(craft);
          return (
            <button
              key={craft}
              type="button"
              onClick={() => toggle(craft)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:bg-accent"
              }`}
            >
              {active && <Check className="size-3.5 inline mr-1.5 -mt-0.5" />}
              {craft}
            </button>
          );
        })}
      </div>
      <Button onClick={onNext} disabled={selected.length === 0} size="lg">
        Continue <ChevronRight className="size-4 ml-1" />
      </Button>
    </div>
  );
}

// Step 2 — Profile details
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-1">Your profile</h2>
      <p className="text-muted-foreground mb-6">
        Clients will see this on your public profile. You can edit it later.
      </p>
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
            <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
              Full name
            </label>
            <input
              type="text"
              placeholder="Jane Smith"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
            <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Portland, OR"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
        <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
          <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
            Bio
          </label>
          <textarea
            rows={4}
            placeholder="Tell clients about your work, experience, and what makes your craft special…"
            className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
          <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="jane@example.com"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} size="lg">Back</Button>
        <Button onClick={onNext} size="lg">
          Continue <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// Step 3 — Profile photo
function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-1">Add a profile photo</h2>
      <p className="text-muted-foreground mb-6">
        Profiles with photos get significantly more inquiries.
      </p>
      <div className="flex flex-col items-center gap-5 mb-8">
        <div className="size-28 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
          <ImagePlus className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold mb-1">Upload a photo</p>
          <p className="text-xs text-muted-foreground">
            Image uploads coming soon — JPEG or PNG, max 5 MB
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold border border-border rounded-lg px-4 py-2 hover:bg-accent transition-colors"
        >
          <ImagePlus className="size-4" />
          Choose photo
        </button>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} size="lg">Back</Button>
        <Button onClick={onNext} size="lg">
          Continue <ChevronRight className="size-4 ml-1" />
        </Button>
        <button
          type="button"
          onClick={onNext}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors self-center ml-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// Step 4 — Done
function Step4() {
  return (
    <div className="text-center">
      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Check className="size-8 text-primary" />
      </div>
      <h2 className="text-2xl font-extrabold mb-2">You&apos;re all set!</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Your profile is ready. Post your first service so clients can find you.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/dashboard/services/new">
            Post your first service <ArrowRight className="size-4 ml-1.5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [crafts, setCrafts] = useState<string[]>([]);

  const toggleCraft = (c: string) =>
    setCrafts((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-5 flex items-center gap-2 border-b border-border bg-card">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/nearly-logo.png" alt="Nearly" width={28} height={28} className="size-7" />
          <span className="font-bold text-lg tracking-tight">Nearly</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[560px]">
          <StepIndicator current={step} />

          {step === 0 && (
            <Step1 selected={crafts} toggle={toggleCraft} onNext={() => setStep(1)} />
          )}
          {step === 1 && <Step2 onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <Step3 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step4 />}
        </div>
      </div>
    </div>
  );
}
