"use client";

import { useMemo, useState } from "react";

function uniqueImages(list: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of list) {
    const trimmed = url.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const gallery = useMemo(() => uniqueImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const activeImage = gallery[activeIndex] ?? "";

  if (gallery.length === 0) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-500">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setOrigin({ x, y });
        }}
        onClick={() => setIsZoomed((prev) => !prev)}
      >
        <img
          src={activeImage}
          alt={alt}
          className={`h-full w-full object-cover transition-transform duration-150 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
        />
        <div className="pointer-events-none absolute inset-0 hidden bg-black/10 opacity-0 transition group-hover:opacity-100 md:block" />
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-gray-600 shadow">
          Hover to zoom
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="flex gap-2 overflow-auto pb-1">
          {gallery.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${
                index === activeIndex ? "border-orange-500" : "border-gray-200"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
