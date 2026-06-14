"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Star, Flag } from "lucide-react";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface BookingWidgetProps {
  service: Pick<Service, "price_starting" | "price_type" | "title">;
}

function WidgetContent({ service, onCta }: { service: BookingWidgetProps["service"]; onCta: () => void }) {
  const isQuote = service.price_type === "quote";
  const fee = service.price_starting ? Math.round(service.price_starting * 0.14) : null;
  const total = service.price_starting && fee ? service.price_starting + fee : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          {isQuote ? (
            <span className="text-xl font-bold">Project-based quote</span>
          ) : (
            <>
              <span className="text-2xl font-bold">
                {service.price_starting ? formatPrice(service.price_starting) : "—"}
              </span>
              <span className="text-muted-foreground text-sm ml-1">starting from</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <Star className="size-3.5 fill-primary text-primary" />
          <span>New</span>
        </div>
      </div>

      {/* Stub input fields */}
      <div className="border border-border rounded-xl overflow-hidden mb-4 text-sm">
        <div className="grid grid-cols-2 border-b border-border">
          <div className="p-3 border-r border-border">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Date</p>
            <p className="text-foreground/50">Add date</p>
          </div>
          <div className="p-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Time</p>
            <p className="text-foreground/50">Add time</p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Message</p>
          <p className="text-foreground/50">Describe your project</p>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onCta}>
        {isQuote ? "Request a Quote" : "Check Availability"}
      </Button>
      <p className="text-center text-xs text-muted-foreground mt-3 mb-6">
        You won&apos;t be charged yet
      </p>

      {!isQuote && service.price_starting && fee && total && (
        <div className="space-y-2 pb-4 border-b border-border text-sm">
          <div className="flex justify-between">
            <span className="underline text-muted-foreground">{formatPrice(service.price_starting)} × 1 project</span>
            <span>{formatPrice(service.price_starting)}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline text-muted-foreground">Nearly service fee</span>
            <span>{formatPrice(fee)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-1.5 text-muted-foreground text-xs">
        <Flag className="size-3.5" />
        <button className="underline hover:text-foreground transition-colors">Report this listing</button>
      </div>
    </div>
  );
}

export function BookingWidget({ service }: BookingWidgetProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const handleCta = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="hidden lg:block sticky top-24">
        <WidgetContent service={service} onCta={handleCta} />
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-4">
        <div>
          {service.price_type === "quote" ? (
            <span className="font-bold text-sm">Project-based quote</span>
          ) : (
            <>
              <span className="font-bold">
                {service.price_starting ? formatPrice(service.price_starting) : "—"}
              </span>
              <span className="text-muted-foreground text-xs ml-1">starting from</span>
            </>
          )}
        </div>
        <Button size="sm" onClick={handleCta}>
          {service.price_type === "quote" ? "Request a Quote" : "Check Availability"}
        </Button>
      </div>

      {/* Coming soon toast */}
      {toastVisible && (
        <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          Coming soon — booking will be available shortly.
        </div>
      )}
    </>
  );
}
