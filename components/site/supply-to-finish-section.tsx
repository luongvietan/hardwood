import { Check } from "lucide-react";

const AUDIENCE = [
  "Home Owners",
  "Designers",
  "Builders",
  "Contractors",
  "Property Managers",
  "Developers",
  "Restoration",
  "Renovators",
] as const;

const cardTitleClass =
  "text-sm font-bold uppercase tracking-wide text-[#3d3420] sm:text-base";

export function SupplyToFinishSection() {
  return (
    <section className="w-full min-w-0 bg-white py-14 lg:py-20">
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Flex + flex-1: avoids grid col-span issues; each column gets ~1/3 width on lg */}
        <div className="flex w-full min-w-0 flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-8 xl:gap-10">
          {/* Left column */}
          <div className="flex min-w-0 w-full flex-1 flex-col gap-8 lg:basis-0">
            <article className="w-full overflow-hidden rounded-lg bg-[#fdf9ee] shadow-sm ring-1 ring-black/5">
              <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                <h3 className={cardTitleClass}>Residential</h3>
              </div>
              <div className="mt-3 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="overflow-hidden rounded-md bg-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=560&h=360&fit=crop&q=80"
                    alt="Suburban home with lawn"
                    className="aspect-[5/3] h-auto w-full max-w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>

            <article className="w-full overflow-hidden rounded-lg bg-[#efefef] shadow-sm ring-1 ring-black/5">
              <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                <div className="overflow-hidden rounded-md bg-neutral-300">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=560&h=360&fit=crop&q=80"
                    alt="Modern strata apartment building"
                    className="aspect-[5/3] h-auto w-full max-w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                <h3 className={cardTitleClass}>Strata Buildings</h3>
              </div>
            </article>
          </div>

          {/* Middle column — vertically centered vs side stacks */}
          <div className="flex min-w-0 w-full flex-1 flex-col items-center justify-center lg:basis-0 lg:px-1">
            <div className="flex w-full max-w-md flex-col items-center sm:max-w-none">
              <div className="flex items-start justify-center gap-3 sm:gap-4">
                <div className="text-center">
                  <p className="text-sm font-bold uppercase leading-snug tracking-wide text-[#3d3420] sm:text-base">
                    Supply to
                  </p>
                  <p className="text-sm font-bold uppercase leading-snug tracking-wide text-[#3d3420] sm:text-base">
                    Finish
                  </p>
                </div>
                <Check
                  className="mt-1 size-5 shrink-0 text-[#8B6914] sm:size-6"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </div>

              <ul className="mt-10 w-full space-y-3.5 px-1 sm:px-2">
                {AUDIENCE.map((label) => (
                  <li
                    key={label}
                    className="flex w-full min-w-0 items-center justify-between gap-4 text-sm text-[#3d3420] sm:text-base"
                  >
                    <span className="min-w-0 shrink leading-snug">{label}</span>
                    <Check
                      className="size-4 shrink-0 text-[#8B6914] sm:size-[18px]"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="flex min-w-0 w-full flex-1 flex-col gap-8 lg:basis-0">
            <article className="w-full overflow-hidden rounded-lg bg-[#fdf9ee] shadow-sm ring-1 ring-black/5">
              <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                <h3 className={cardTitleClass}>Commercial</h3>
              </div>
              <div className="mt-3 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="overflow-hidden rounded-md bg-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?w=560&h=360&fit=crop&q=80"
                    alt="Modern office interior"
                    className="aspect-[5/3] h-auto w-full max-w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>

            <article className="w-full overflow-hidden rounded-lg bg-[#efefef] shadow-sm ring-1 ring-black/5">
              <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                <div className="overflow-hidden rounded-md bg-neutral-300">
                  <img
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=560&h=360&fit=crop&q=80"
                    alt="Blueprints and planning for new construction"
                    className="aspect-[5/3] h-auto w-full max-w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                <h3 className={cardTitleClass}>New Construction</h3>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
