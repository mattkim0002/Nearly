"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface InquiryFormProps {
  proFirstName: string;
  serviceTitle: string;
}

export function InquiryForm({ proFirstName, serviceTitle }: InquiryFormProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  return (
    <div className="py-8 border-b border-border">
      <h2 className="text-xl font-bold mb-1">
        Send {proFirstName} a message
      </h2>
      <p className="text-muted-foreground text-sm mb-5">
        Ask about availability, pricing, or anything else related to{" "}
        <span className="font-medium text-foreground">{serviceTitle}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-border rounded-xl p-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
            <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
              Your name
            </label>
            <input
              type="text"
              placeholder="Jane Smith"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="border border-border rounded-xl p-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
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

        <div className="border border-border rounded-xl p-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
          <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
            Message
          </label>
          <textarea
            rows={4}
            placeholder="Describe your project, timeline, and any questions you have…"
            className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground/50"
          />
        </div>

        <Button type="submit" className="w-full" size="lg">
          <MessageCircle className="size-4 mr-2" />
          Send message
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No commitment — just start the conversation
        </p>
      </form>

      {toastVisible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          Message sent! {proFirstName} will be in touch soon.
        </div>
      )}
    </div>
  );
}
