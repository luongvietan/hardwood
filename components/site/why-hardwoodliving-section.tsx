import { Leaf } from "lucide-react";

/** End-grain / tree rings — warm, readable under overlay */
const SECTION_BG =
  "https://images.unsplash.com/photo-1541123603104-512285d1d4cb?w=2000&h=1200&fit=crop&q=85";

/** Feet / walking on polished hardwood */
const CARD_IMAGE =
  "https://images.unsplash.com/photo-1616627547586-b904d6fea4d0?w=1200&h=900&fit=crop&q=85";

export function WhyHardwoodlivingSection() {
  return (
    <section
      className="relative isolate w-full min-w-0 overflow-hidden py-16 md:py-20 lg:py-24"
      aria-labelledby="why-hardwoodliving-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${SECTION_BG})` }}
        aria-hidden
      />
      {/* Warm dark overlay for contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-950/55 via-stone-900/45 to-stone-950/60"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">
          {/* Left ~40%: glass panel */}
          <div className="min-w-0 lg:col-span-5">
            <div
              className="rounded-[15px] border border-white/35 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-[10px] sm:p-9 lg:p-10"
              style={{ WebkitBackdropFilter: "blur(10px)" }}
            >
              <div className="space-y-5 text-[0.9375rem] leading-[1.7] text-neutral-900 sm:text-base [font-family:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]">
                <p>
                  Hardwoodliving is a boutique flooring studio built around personal service and straight answers—not
                  high-pressure sales. We take time to understand how you live in your space before we recommend a single
                  plank or profile.
                </p>
                <p>
                  With more than twenty years of experience across residential and commercial work, we supply and
                  install everything from classic Herringbone and rich Walnut hardwoods to high-performance laminates and
                  luxury vinyl when durability and moisture matter most.
                </p>
                <p>
                  From strata refreshes to full commercial schedules, we coordinate product selection, timing, and
                  installation so your floor looks intentional and performs for the long haul.
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <button
                  type="button"
                  className="min-h-[44px] rounded-[2px] bg-[#FF852D] px-5 py-2.5 text-center text-[0.8125rem] font-bold uppercase tracking-wide text-white shadow-sm transition hover:brightness-95 sm:px-6 sm:text-sm [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]"
                >
                  Apply here for a discount
                </button>
                <button
                  type="button"
                  className="min-h-[44px] rounded-[2px] bg-[#6D6964] px-5 py-2.5 text-center text-[0.8125rem] font-bold uppercase tracking-wide text-white shadow-sm transition hover:brightness-95 sm:px-6 sm:text-sm [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]"
                >
                  Find out what our clients say
                </button>
              </div>
            </div>
          </div>

          {/* Right ~60%: heading + image card */}
          <div className="min-w-0 lg:col-span-7">
            <h2
              id="why-hardwoodliving-heading"
              className="mb-6 text-2xl font-bold leading-tight text-white drop-shadow-sm sm:text-3xl lg:mb-8 lg:text-[2rem] lg:tracking-tight [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]"
            >
              Why Hardwoodliving?
            </h2>

            <div className="relative overflow-hidden rounded-[15px] shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
              <img
                src={CARD_IMAGE}
                alt="Polished hardwood flooring"
                className="aspect-[4/3] h-auto w-full object-cover sm:aspect-[16/11]"
                sizes="(min-width: 1024px) 58vw, 100vw"
                loading="lazy"
              />

              {/* Circular brand mark — wood tone, H + leaf */}
              <div
                className="pointer-events-none absolute left-[10%] top-1/2 flex size-[5.5rem] -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white/35 bg-[#4a3428] shadow-lg sm:left-[12%] sm:size-28 md:size-32"
                aria-hidden
              >
                <Leaf
                  className="pointer-events-none absolute size-[4.5rem] text-emerald-500/85 sm:size-[5rem]"
                  strokeWidth={1.35}
                />
                <span className="relative z-10 text-3xl font-bold text-white drop-shadow sm:text-4xl">H</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/55 via-black/25 to-transparent px-4 pb-6 pt-16 sm:pb-8">
                <button
                  type="button"
                  className="rounded-[3px] bg-[#3f3b38]/85 px-6 py-2.5 text-[0.8125rem] font-bold text-white shadow-md backdrop-blur-[6px] transition hover:bg-[#4a4540]/90 sm:px-8 sm:py-3 sm:text-sm [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]"
                >
                  Book your free consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
