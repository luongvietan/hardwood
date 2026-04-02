const COLUMNS = [
  {
    title: "PRODUCTS",
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?w=480&h=640&fit=crop&q=80",
    alt: "Assorted hardwood and laminate flooring planks",
    cta: "Browse our catalogue",
    href: "#",
  },
  {
    title: "SERVICES",
    image:
      "https://plus.unsplash.com/premium_photo-1683134399397-2407679051f7?w=480&h=640&fit=crop&q=80",
    alt: "Professional floor sanding and refinishing",
    cta: "Explore Services",
    href: "#",
  },
  {
    title: "GALLERY",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=480&h=640&fit=crop&q=80",
    alt: "Light wood flooring with a puppy resting",
    cta: "View our work",
    href: "#",
  },
] as const;

export function ProductsServicesGallerySection() {
  return (
    <section className="w-full bg-white py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* flex + basis: reliable 3 equal columns from sm; single column on narrow phones */}
        <div className="flex w-full flex-col gap-12 sm:flex-row sm:gap-6 lg:gap-10">
          {COLUMNS.map(({ title, image, alt, cta, href }) => (
            <div
              key={title}
              className="flex min-w-0 flex-1 flex-col items-center text-center sm:basis-0"
            >
              <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-[#4B411D] sm:text-xl">
                {title}
              </h2>

              <div className="mt-8 w-full max-w-[280px] sm:max-w-[300px]">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-200 shadow-sm ring-1 ring-black/5">
                  <img
                    src={image}
                    alt={alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <a
                href={href}
                className="mt-8 inline-flex min-w-[200px] items-center justify-center rounded-md bg-[#8B7E6C] px-8 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:brightness-95 sm:px-10"
              >
                {cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
