"use client";

import { ChevronsUp } from "lucide-react";

export function FooterScrollTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white text-white transition hover:bg-white/10"
      aria-label="Back to top"
    >
      <ChevronsUp className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}
