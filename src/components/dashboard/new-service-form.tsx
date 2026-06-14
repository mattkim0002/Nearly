"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function NewServiceForm({ categories }: { categories: Category[] }) {
  const [priceType, setPriceType] = useState<"starting_from" | "quote">("starting_from");
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold mb-1.5">
            Service title <span className="text-primary">*</span>
          </label>
          <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
            <input
              type="text"
              placeholder="e.g. Custom hardwood dining table"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold mb-1.5">
            Category <span className="text-primary">*</span>
          </label>
          <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
            <select className="w-full bg-transparent text-sm outline-none text-foreground">
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-1.5">Description</label>
          <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
            <textarea
              rows={5}
              placeholder="Describe what you offer, your process, materials, and anything a client should know…"
              className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <label className="block text-sm font-bold mb-3">Pricing</label>
          <div className="flex gap-3 mb-4">
            {(["starting_from", "quote"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPriceType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  priceType === type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {type === "starting_from" ? "Starting from" : "Project-based quote"}
              </button>
            ))}
          </div>

          {priceType === "starting_from" && (
            <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
              <label className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
                Starting price ($)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 500"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold mb-1.5">
            Location <span className="text-primary">*</span>
          </label>
          <div className="border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
            <input
              type="text"
              placeholder="e.g. Portland, OR"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-bold mb-1.5">Photos</label>
          <div className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ImagePlus className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Upload photos</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Image uploads coming soon — will support JPEG, PNG, WebP up to 10 MB
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg px-3 py-1.5">
              <Upload className="size-3.5" />
              Choose files
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex gap-3">
          <Button type="submit" size="lg" className="flex-1">
            Post service
          </Button>
          <Button type="button" variant="outline" size="lg">
            Save draft
          </Button>
        </div>
      </form>

      {toastVisible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          Service posting coming soon — available at launch!
        </div>
      )}
    </>
  );
}
