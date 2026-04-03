import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site/site-shell";
import { ProductGallery } from "@/components/site/product-gallery";
import { prisma, safeDbCall } from "@/lib/db";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;

  const product = await safeDbCall(null, async () =>
    prisma.product.findFirst({
      where: {
        slug: productSlug,
        visible: true,
        category: { slug: categorySlug },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        announce: true,
        description: true,
        imageUrl: true,
        imageUrls: true,
        boxContents: true,
        collection: true,
        dimensions: true,
        finish: true,
        impactIsolationClass: true,
        installation: true,
        lockingSystem: true,
        printedDesign: true,
        soundTransmission: true,
        species: true,
        wearLayer: true,
        accessoryNosing: true,
        accessoryReducer: true,
        accessoryTmold: true,
        referenceInstallationUrl: true,
        referenceSpecSheetUrl: true,
        referenceWarrantyUrl: true,
      },
    }),
  );

  if (!product) {
    notFound();
  }

  const images = [
    ...(Array.isArray(product.imageUrls) ? product.imageUrls : []),
    ...(product.imageUrl ? [product.imageUrl] : []),
  ];

  const details = [
    { label: "Box Contents", value: product.boxContents },
    { label: "Collection", value: product.collection },
    { label: "Dimensions", value: product.dimensions },
    { label: "Finish", value: product.finish },
    { label: "Impact Isolation Class", value: product.impactIsolationClass },
    { label: "Installation", value: product.installation },
    { label: "Locking System", value: product.lockingSystem },
    { label: "Printed Design", value: product.printedDesign },
    { label: "Sound Transmission", value: product.soundTransmission },
    { label: "Species", value: product.species },
    { label: "Wear Layer", value: product.wearLayer },
  ].filter((item) => item.value);

  const accessories = [
    { label: "Nosing", value: product.accessoryNosing },
    { label: "Reducer", value: product.accessoryReducer },
    { label: "T-Mold", value: product.accessoryTmold },
  ].filter((item) => item.value);

  const references = [
    { label: "Installation", url: product.referenceInstallationUrl },
    { label: "Specification Sheet", url: product.referenceSpecSheetUrl },
    { label: "Warranty", url: product.referenceWarrantyUrl },
  ].filter((item) => item.url);

  return (
    <SiteShell>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <ProductGallery images={images} alt={product.name} />
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                {product.announce ?? "Product"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">{product.name}</h1>
            </div>
            {product.description ? (
              <p className="text-sm leading-7 text-gray-600">{product.description}</p>
            ) : null}

            <button className="mt-4 w-full rounded-none bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600">
              See it in my room
            </button>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Request information</h3>
              <div className="mt-3 grid gap-3 text-xs">
                <input
                  className="h-10 w-full border border-gray-300 px-3"
                  placeholder="Name"
                />
                <input
                  className="h-10 w-full border border-gray-300 px-3"
                  placeholder="Email"
                />
                <input
                  className="h-10 w-full border border-gray-300 px-3"
                  placeholder="Phone Number"
                />
                <button className="w-fit rounded-none bg-orange-500 px-6 py-2 text-xs font-bold text-white">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Product Details</h2>
            <div className="mt-4 divide-y divide-gray-200 rounded border border-gray-200 bg-white">
              {details.map((item) => (
                <div key={item.label} className="grid grid-cols-[200px_1fr] gap-4 px-6 py-3 text-sm">
                  <span className="font-semibold uppercase text-gray-600">{item.label}</span>
                  <span className="text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                Accessories for {product.name}
              </h2>
              <div className="mt-3 divide-y divide-gray-200 rounded border border-gray-200 bg-white">
                {accessories.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">No accessories listed.</div>
                ) : (
                  accessories.map((item) => (
                    <div key={item.label} className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3 text-sm">
                      <span className="font-semibold uppercase text-gray-600">{item.label}</span>
                      <span className="text-gray-700">{item.value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                Reference Materials for {product.name}
              </h2>
              <div className="mt-3 space-y-2 text-sm">
                {references.length === 0 ? (
                  <p className="text-gray-500">No reference files yet.</p>
                ) : (
                  references.map((item) => (
                    <a
                      key={item.label}
                      href={item.url ?? "#"}
                      className="block font-semibold uppercase text-orange-600 hover:text-orange-700"
                    >
                      {item.label}
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
