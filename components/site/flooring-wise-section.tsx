import { Cormorant_Garamond } from "next/font/google";

const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const ROW_IMAGE_1 =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=1050&fit=crop&q=85";

const ROW_IMAGE_2 =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&h=1050&fit=crop&q=85";

/** Dark bronze / olive heading color aligned with site luxury flooring palette */
const HEADING = "text-[#4d4428]";

export function FlooringWiseSection() {
  return (
    <section
      className={`${displaySerif.className} w-full min-w-0 bg-white py-14 md:py-20 lg:py-[7rem]`}
      aria-labelledby="flooring-wise-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Row 1: text left, image right */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0 xl:gap-x-16">
          <div className="min-w-0 lg:pr-2">
            <h2
              id="flooring-wise-heading"
              className={`${HEADING} text-[1.65rem] font-bold uppercase leading-[1.15] tracking-[0.06em] sm:text-3xl lg:text-[2.125rem] lg:leading-[1.2]`}
            >
              Are you flooring wise?
            </h2>

            <div className="mt-7 space-y-5 text-[0.98rem] leading-[1.65] text-neutral-900 sm:text-[1.05rem] lg:mt-8 lg:text-[1.0625rem] lg:leading-[1.7]">
              <p>
                One of the first question asked when purchasing a floor is what will be it&apos;s core purpose? Design,
                upgrade, replacing the old, increasing a home value, it&apos;s function, ...?
              </p>
              <p>
                Whichever the answer, it is a significant investment which should not be treated lightly. Hardwood or
                engineered, finished or unfinished, species, cuts, grades, dimensions, applications on grade or below,
                radiant heat, hardness coeficient, humidity, installation techniques, price, color of stain, natural
                variations - all play a role into the decision. With so many considerations, even for laminates and
                vinyls it is wise to consult a specialist to ensure your flooring investment holds true for its
                intent.
              </p>
            </div>

            <div className="mt-9 lg:mt-10">
              <button
                type="button"
                className="rounded-[3px] bg-[#8B7E6C] px-9 py-3 text-[0.8125rem] font-semibold tracking-wide text-white shadow-sm transition hover:brightness-[0.97] sm:px-10 sm:text-sm [font-family:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]"
              >
                Book a free consultation
              </button>
            </div>
          </div>

          <div className="min-w-0 lg:pl-1">
            <div className="overflow-hidden bg-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <img
                src={ROW_IMAGE_1}
                alt="Modern interior with wide-plank wood flooring, glass wall, and staircase"
                className="aspect-[4/3] h-auto w-full object-cover sm:aspect-[5/4] lg:aspect-[11/9] lg:min-h-[min(520px,50vw)]"
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Row 2: image left, text right */}
        <div className="mt-16 grid grid-cols-1 items-center gap-10 md:mt-20 lg:mt-28 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0 xl:gap-x-16">
          <div className="min-w-0 lg:pr-2">
            <div className="overflow-hidden bg-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <img
                src={ROW_IMAGE_2}
                alt="Decorative wood floor with metallic inlay detail"
                className="aspect-[4/3] h-auto w-full object-cover sm:aspect-[5/4] lg:aspect-[11/9] lg:min-h-[min(480px,48vw)]"
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
              />
            </div>
          </div>

          <div className="min-w-0 space-y-10 lg:space-y-12 lg:pl-3">
            <p
              className={`${HEADING} text-[1.125rem] font-semibold leading-[1.45] sm:text-[1.1875rem] lg:text-[1.25rem] lg:leading-[1.5]`}
            >
              White Oak 7 in. custom prefinished long planks with inhouse manufactured column floated stair treads in a
              North Vancouver home.
            </p>
            <p
              className={`${HEADING} text-[1.125rem] font-semibold leading-[1.45] sm:text-[1.1875rem] lg:text-[1.25rem] lg:leading-[1.5]`}
            >
              Stainless steel veneer Italian Design Walnut tiles installed as an entry feature in a Vancouver West side
              home.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
