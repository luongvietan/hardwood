import Link from "next/link";

import { prisma, safeDbCall } from "@/lib/db";
import { getDefaultSettingsMap } from "@/lib/site-content";

export default async function Home() {
  const [blocks, settings] = await Promise.all([
    safeDbCall([], async () =>
      prisma.homeBlock.findMany({
        where: { visible: true },
        orderBy: { orderIndex: "asc" },
        take: 8,
      }),
    ),
    getDefaultSettingsMap(),
  ]);

  const siteTitle = settings["site-title"] || "Hardwood Living";
  const heroBadge = settings["hero-badge"] || "";
  const heroTitle = settings["hero-title"] || "";
  const heroDescription = settings["hero-description"] || "";
  const primaryCtaLabel = settings["hero-primary-cta-label"] || "";
  const primaryCtaHref = settings["hero-primary-cta-href"] || "";
  const secondaryCtaLabel = settings["hero-secondary-cta-label"] || "";
  const secondaryCtaHref = settings["hero-secondary-cta-href"] || "";
  const blocksHeading = settings["home-blocks-heading"] || "Home Blocks";
  const blocksSubheading = settings["home-blocks-subheading"] || "";
  const emptyBlocksMessage = settings["home-blocks-empty-message"] || "";

  return (
    <div className="min-h-screen bg-white text-[#1f2937]">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-semibold">{siteTitle}</h1>
          <Link href="/admin" className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            Admin CMS
          </Link>
        </div>
      </header>

      {(heroBadge || heroTitle || heroDescription || primaryCtaLabel || secondaryCtaLabel) && (
        <section className="bg-[#f4f1ec] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            {heroBadge ? <p className="text-sm font-semibold tracking-[0.2em] text-[#8d6e4a]">{heroBadge}</p> : null}
            {heroTitle ? (
              <h2 className="mt-3 max-w-3xl text-5xl leading-tight font-semibold text-[#1f2937]">{heroTitle}</h2>
            ) : null}
            {heroDescription ? <p className="mt-6 max-w-2xl text-lg text-[#4b5563]">{heroDescription}</p> : null}
            {(primaryCtaLabel || secondaryCtaLabel) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCtaLabel ? (
                  primaryCtaHref ? (
                    <Link href={primaryCtaHref} className="rounded bg-[#2b8654] px-5 py-3 text-sm font-semibold text-white">
                      {primaryCtaLabel}
                    </Link>
                  ) : (
                    <span className="rounded bg-[#2b8654] px-5 py-3 text-sm font-semibold text-white">{primaryCtaLabel}</span>
                  )
                ) : null}
                {secondaryCtaLabel ? (
                  secondaryCtaHref ? (
                    <Link
                      href={secondaryCtaHref}
                      className="rounded border border-[#2b8654] px-5 py-3 text-sm font-semibold text-[#2b8654]"
                    >
                      {secondaryCtaLabel}
                    </Link>
                  ) : (
                    <span className="rounded border border-[#2b8654] px-5 py-3 text-sm font-semibold text-[#2b8654]">
                      {secondaryCtaLabel}
                    </span>
                  )
                ) : null}
              </div>
            )}
          </div>
        </section>
      )}

      <main className="mx-auto max-w-6xl px-6 py-10">
        {blocksHeading ? <h3 className="text-2xl font-semibold">{blocksHeading}</h3> : null}
        {blocksSubheading ? <p className="mt-2 text-sm text-gray-600">{blocksSubheading}</p> : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {blocks.length === 0 ? (
            emptyBlocksMessage ? (
              <div className="rounded border border-dashed border-gray-300 p-6 text-sm text-gray-600">{emptyBlocksMessage}</div>
            ) : null
          ) : (
            blocks.map((block) => (
              <article key={block.id} className="rounded border border-gray-200 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">{block.callbackKey}</p>
                <h4 className="mt-2 text-xl font-semibold">{block.header}</h4>
                {block.subheader ? <p className="mt-1 text-gray-600">{block.subheader}</p> : null}
                {block.content ? (
                  <div
                    className="mt-3 text-sm text-gray-600 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                ) : null}
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
