/** Warm light wood — top strip + bottom border */
const WOOD_TEXTURE =
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=2400&h=400&fit=crop&q=85";

const IMG_FOREST =
  "https://images.unsplash.com/photo-1441974231531-622692581c58?w=900&h=650&fit=crop&q=85";

const IMG_RACCOON =
  "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=520&h=780&fit=crop&q=85";

const IMG_MOUNTAIN =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=650&fit=crop&q=85";

const orangeBtn =
  "rounded-md bg-[#FF7A1A] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:brightness-95 [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]";

export function ProductsSaleBestValueSection() {
  return (
    <section className="w-full min-w-0 bg-white" aria-labelledby="products-sale-heading">
      {/* Top wood strip — headings over left & right columns */}
      <div
        className="w-full bg-cover bg-center py-[1.35rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] sm:py-6"
        style={{ backgroundImage: `url(${WOOD_TEXTURE})` }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.75fr)_minmax(0,1.15fr)] lg:items-center lg:justify-center lg:gap-x-10 lg:px-10">
          <p
            id="products-sale-heading"
            className="min-w-0 flex-1 text-center text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white drop-shadow-sm sm:text-sm lg:col-span-1 [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]"
          >
            Products
          </p>
          <span className="hidden min-w-0 lg:col-span-1 lg:block" aria-hidden />
          <p className="min-w-0 flex-1 text-center text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white drop-shadow-sm sm:text-sm lg:col-span-1 [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]">
            Best
          </p>
        </div>
      </div>

      {/* Sub-headings on white — aligned to same column grid */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-row items-baseline justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.75fr)_minmax(0,1.15fr)] lg:items-baseline lg:justify-center lg:gap-x-10 lg:px-10">
          <p className="min-w-0 flex-1 text-center text-lg font-bold uppercase tracking-wide text-black sm:text-xl lg:col-span-1 [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]">
            On Sale
          </p>
          <span className="hidden lg:col-span-1 lg:block" aria-hidden />
          <p className="min-w-0 flex-1 text-center text-lg font-bold uppercase tracking-wide text-black sm:text-xl lg:col-span-1 [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]">
            Value
          </p>
        </div>
      </div>

      {/* Three columns — center narrower; raccoon block starts lower */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.75fr)_minmax(0,1.15fr)] lg:gap-x-10 xl:gap-x-12">
          {/* Left */}
          <div className="flex min-w-0 flex-col items-center">
            <div className="w-full overflow-hidden bg-neutral-200 shadow-sm ring-1 ring-black/5">
              <img
                src={IMG_FOREST}
                alt="Sunlit forest with tall trees and moss"
                className="aspect-[4/3] w-full object-cover"
                sizes="(min-width: 1024px) 38vw, 100vw"
                loading="lazy"
              />
            </div>
            <a href="/on-sale" className={`mt-6 inline-flex w-full max-w-[280px] justify-center sm:max-w-none ${orangeBtn}`}>
              Explore what&apos;s on Sale
            </a>
          </div>

          {/* Center — portrait image + copy; starts lower on large screens */}
          <div className="flex min-w-0 flex-col items-center lg:mt-10 lg:pt-2">
            <div className="w-full max-w-[220px] overflow-hidden bg-neutral-200 shadow-sm ring-1 ring-black/5 sm:max-w-[240px]">
              <img
                src={IMG_RACCOON}
                alt="Raccoon peeking near a tree"
                className="aspect-[3/4] w-full object-cover object-[center_20%]"
                sizes="(min-width: 1024px) 22vw, 240px"
                loading="lazy"
              />
            </div>
            <p className="mt-6 max-w-[26rem] text-center text-[0.8125rem] leading-relaxed text-[#444444] sm:text-sm lg:max-w-none [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]">
              Who would have thought that I will make it on the Hardwoodliving&apos;s website page - &apos;How&apos;
              would you ask? Well, me and my family always hang out in the woods around. We know our woods, just like
              Hardwoodliving does. More so, I&apos;m always looking for a bargain - who doesn&apos;t like a good bargain?
              Am I always lucky? No, but I&apos;m sure to keep trying.
            </p>
            <div className="mt-8 flex w-full max-w-[280px] flex-col gap-3 sm:max-w-[300px]">
              <button type="button" className={`w-full ${orangeBtn}`}>
                Apply here for a discount
              </button>
              <a
                href="#"
                className="rounded-md bg-[#8B7D6B] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:brightness-95 [font-family:var(--font-geist-sans),ui-sans-serif,sans-serif]"
              >
                Trades Sign In
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="flex min-w-0 flex-col items-center">
            <div className="w-full overflow-hidden bg-neutral-200 shadow-sm ring-1 ring-black/5">
              <img
                src={IMG_MOUNTAIN}
                alt="Mountain landscape with evergreen forest"
                className="aspect-[4/3] w-full object-cover"
                sizes="(min-width: 1024px) 38vw, 100vw"
                loading="lazy"
              />
            </div>
            <a href="/best-value" className={`mt-6 inline-flex w-full max-w-[280px] justify-center sm:max-w-none ${orangeBtn}`}>
              Explore Best Value
            </a>
          </div>
        </div>
      </div>

      {/* Bottom thin wood strip */}
      <div
        className="h-2.5 w-full bg-cover bg-center sm:h-3"
        style={{ backgroundImage: `url(${WOOD_TEXTURE})` }}
        aria-hidden
      />
    </section>
  );
}
