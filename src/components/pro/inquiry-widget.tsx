"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Flag } from "lucide-react";

interface InquiryWidgetProps {
  proName: string;
  proFirstName: string;
}

function WidgetContent({
  proFirstName,
  onCta,
}: {
  proFirstName: string;
  onCta: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold mb-1">Contact {proFirstName}</h3>
      <p className="text-muted-foreground text-sm mb-5">
        Describe your project and {proFirstName} will get back to you.
      </p>

      {/* Stub form fields */}
      <div className="border border-border rounded-xl overflow-hidden mb-4 text-sm">
        <div className="p-3 border-b border-border">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-0.5">
            Your name
          </p>
          <p className="text-foreground/40">Add your name</p>
        </div>
        <div className="p-3 border-b border-border">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-0.5">
            Email
          </p>
          <p className="text-foreground/40">Add your email</p>
        </div>
        <div className="p-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-0.5">
            Message
          </p>
          <p className="text-foreground/40">Describe your project…</p>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onCta}>
        <MessageCircle className="size-4 mr-2" />
        Send inquiry
      </Button>
      <p className="text-center text-xs text-muted-foreground mt-3 mb-5">
        No commitment — just start the conversation
      </p>

      <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs">
        <Flag className="size-3.5" />
        <button className="underline hover:text-foreground transition-colors">
          Report this profile
        </button>
      </div>
    </div>
  );
}

export function InquiryWidget({ proName, proFirstName }: InquiryWidgetProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const handleCta = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="hidden lg:block sticky top-24">
        <WidgetContent proFirstName={proFirstName} onCta={handleCta} />
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold truncate">Contact {proName}</p>
        <Button size="sm" onClick={handleCta}>
          <MessageCircle className="size-4 mr-1.5" />
          Send inquiry
        </Button>
      </div>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          Inquiry sent! {proFirstName} will be in touch soon.
        </div>
      )}
    </>
  );
}
