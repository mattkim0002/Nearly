"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const BIO_LIMIT = 300;

interface BioSectionProps {
  name: string | null;
  bio: string | null;
}

export function BioSection({ name, bio }: BioSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!bio) return null;

  const firstName = name?.split(" ")[0] ?? "the Pro";
  const isLong = bio.length > BIO_LIMIT;
  const displayedBio = isLong && !expanded ? bio.slice(0, BIO_LIMIT) + "…" : bio;

  return (
    <div className="py-8 border-b border-border">
      <h2 className="text-xl font-bold mb-4">About {firstName}</h2>
      <p className="text-muted-foreground leading-relaxed">{displayedBio}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1 font-bold underline hover:text-primary transition-colors text-sm"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronRight className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      )}
    </div>
  );
}
