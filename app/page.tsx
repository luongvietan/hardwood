import { Check, Facebook, Instagram, MessageCircle, Send, Twitter } from "lucide-react";

import { BoutiqueExperienceSection } from "@/components/site/boutique-experience-section";
import { FlooringWiseSection } from "@/components/site/flooring-wise-section";
import { FreeConsultationSection } from "@/components/site/free-consultation-section";
import { LookingForFloorSection } from "@/components/site/looking-for-floor-section";
import { ProductsServicesGallerySection } from "@/components/site/products-services-gallery-section";
import { SupplyToFinishSection } from "@/components/site/supply-to-finish-section";
import { ProductsSaleBestValueSection } from "@/components/site/products-sale-best-value-section";
import { WhyHardwoodlivingSection } from "@/components/site/why-hardwoodliving-section";
import { SiteShell } from "@/components/site/site-shell";

const categories = ["Hardwoods", "Engineered", "Laminates", "Vinyl", "Mats"] as const;

const HERO_BACKGROUND_IMAGE =
  "https://plus.unsplash.com/premium_photo-1676823547752-1d24e8597047?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Home() {
  return (
    <SiteShell heroLayout>
      <section className="relative flex min-h-[100svh] w-full flex-col bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BACKGROUND_IMAGE})` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/15 to-black/25"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[100svh] flex-1 flex-col px-4 pb-6 pt-44 sm:px-6 sm:pt-48 lg:px-10 lg:pt-52">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div>
                  <h1 className="text-6xl font-black leading-[0.95] tracking-tight text-black sm:text-7xl lg:text-[5.5rem]">
                    FLOORS
                  </h1>
                  <p className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-[var(--brand-warm-brown)] sm:text-2xl">
                    CRAFTED WITH CARE
                  </p>
                  <p
                    className="mt-3 text-2xl text-gray-800 sm:text-3xl"
                    style={{ fontFamily: "var(--font-hero-script), cursive" }}
                  >
                    Complimentary consultation
                  </p>
                </div>
                <a
                  href="#faq"
                  className="mt-4 shrink-0 self-start text-sm font-bold uppercase tracking-wide text-gray-900 underline decoration-gray-900/40 underline-offset-4 transition hover:text-[var(--brand-orange)] sm:mt-16 sm:self-auto"
                >
                  FAQ
                </a>
              </div>
            </div>
            <div className="hidden flex-1 lg:block" aria-hidden />
          </div>

          <div className="mx-auto mt-auto flex w-full max-w-7xl flex-col gap-8 pt-10">
            <div className="flex flex-col items-stretch justify-between gap-6 lg:flex-row lg:items-end">
              <div className="order-2 flex justify-center gap-2 lg:order-1 lg:justify-start">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Twitter, label: "X" },
                  { Icon: Send, label: "Telegram" },
                  { Icon: MessageCircle, label: "WhatsApp" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-md transition hover:bg-gray-800"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </a>
                ))}
              </div>

              <div className="order-1 flex flex-1 flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:order-2">
                <button
                  type="button"
                  className="w-full min-w-[200px] rounded-xl bg-[var(--brand-orange)] px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:brightness-95 sm:w-auto sm:px-10"
                >
                  Book a showroom visit
                </button>
                <button
                  type="button"
                  className="w-full min-w-[200px] rounded-xl bg-gray-700 px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-gray-800 sm:w-auto sm:px-10"
                >
                  Request more info
                </button>
              </div>

              <div className="order-3 flex justify-center lg:justify-end">
                <a
                  href="#"
                  className="rounded-md border border-gray-300 bg-white/90 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 shadow-sm backdrop-blur-sm transition hover:border-gray-400"
                >
                  Trades Sign In
                </a>
              </div>
            </div>

            <div className="border-t border-gray-900/15 bg-white/90 px-3 py-4 shadow-sm backdrop-blur-md sm:px-6">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 sm:gap-x-8 sm:text-xs">
                {categories.map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    {i > 0 ? <span className="hidden text-gray-400 sm:inline">|</span> : null}
                    <span>{item}</span>
                    <Check className="h-3.5 w-3.5 shrink-0 text-[var(--brand-orange)] sm:h-4 sm:w-4" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LookingForFloorSection />

      

      <ProductsServicesGallerySection />

      <BoutiqueExperienceSection />

      <SupplyToFinishSection />

      <FreeConsultationSection />

      <FlooringWiseSection />

      <WhyHardwoodlivingSection />

      <ProductsSaleBestValueSection />

    </SiteShell>
  );
}
