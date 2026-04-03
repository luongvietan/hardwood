import type { ReactNode } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

import { prisma, safeDbCall } from "@/lib/db";
import { SiteFooter } from "@/components/site/site-footer";

function BrandLogo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-black text-white">
        <Leaf
          className="pointer-events-none absolute size-7 text-emerald-500/90"
          strokeWidth={1.5}
          aria-hidden
        />
        <span className="relative z-10 text-lg font-bold leading-none">H</span>
      </div>
      <div
        className={`font-serif font-semibold tracking-wide text-black ${compact ? "text-sm sm:text-base" : "text-xs sm:text-sm"}`}
      >
        HARDWOODLIVING
      </div>
    </Link>
  );
}

export async function SiteShell({
  children,
  heroLayout = false,
}: {
  children: ReactNode;
  /** Full-bleed hero: header overlays imagery (home). */
  heroLayout?: boolean;
}) {
  const navPages = await safeDbCall([], async () =>
    prisma.pageStructure.findMany({
      where: { visible: true },
      orderBy: { orderIndex: "asc" },
      select: { id: true, title: true, slug: true, parentId: true, orderIndex: true },
    }),
  );
  const categories = await safeDbCall([], async () =>
    prisma.category.findMany({
      where: { visible: true },
      orderBy: { orderIndex: "asc" },
      select: { id: true, name: true, slug: true, parentId: true, orderIndex: true },
    }),
  );

  const fallbackNav = [
    { id: "products", label: "Products", href: "/products" },
    { id: "best-value", label: "Best Value", href: "/best-value" },
    { id: "on-sale", label: "On Sale", href: "/on-sale" },
    { id: "service", label: "Service", href: "/service" },
    { id: "reviews", label: "Reviews", href: "/reviews" },
    { id: "us", label: "Us", href: "/us" },
  ];

  const navItems =
    navPages.length > 0
      ? navPages.map((page) => ({
          id: page.id,
          label: page.title,
          href: page.slug.startsWith("/") ? page.slug : `/${page.slug}`,
          parentId: page.parentId,
          slug: page.slug,
          orderIndex: page.orderIndex ?? 0,
        }))
      : fallbackNav.map((item, index) => ({
          ...item,
          parentId: null as string | null,
          slug: item.href,
          orderIndex: index,
        }));

  type NavNode = (typeof navItems)[number] & { children: NavNode[] };
  const nodeMap = new Map<string, NavNode>();
  for (const item of navItems) {
    nodeMap.set(item.id, { ...item, children: [] });
  }
  const roots: NavNode[] = [];
  for (const node of nodeMap.values()) {
    if (node.parentId && nodeMap.has(String(node.parentId))) {
      nodeMap.get(String(node.parentId))?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortNodes = (list: NavNode[]) => {
    list.sort((a, b) => {
      if (a.orderIndex !== b.orderIndex) {
        return a.orderIndex - b.orderIndex;
      }
      return a.label.localeCompare(b.label);
    });
    list.forEach((node) => sortNodes(node.children));
  };
  sortNodes(roots);
  const topLevel = roots;

  type CategoryNode = {
    id: string;
    label: string;
    href: string;
    parentId: string | null;
    orderIndex: number;
    children: CategoryNode[];
  };
  const categoryMap = new Map<string, CategoryNode>();
  for (const category of categories) {
    categoryMap.set(String(category.id), {
      id: String(category.id),
      label: category.name,
      href: `/products/${category.slug}`,
      parentId: category.parentId ? String(category.parentId) : null,
      orderIndex: category.orderIndex ?? 0,
      children: [],
    });
  }
  const categoryRoots: CategoryNode[] = [];
  for (const node of categoryMap.values()) {
    if (node.parentId && categoryMap.has(node.parentId)) {
      categoryMap.get(node.parentId)?.children.push(node);
    } else {
      categoryRoots.push(node);
    }
  }
  const sortCategoryNodes = (list: CategoryNode[]) => {
    list.sort((a, b) => {
      if (a.orderIndex !== b.orderIndex) {
        return a.orderIndex - b.orderIndex;
      }
      return a.label.localeCompare(b.label);
    });
    list.forEach((node) => sortCategoryNodes(node.children));
  };
  sortCategoryNodes(categoryRoots);

  const footerNav = [
    { label: "Products", href: "/products" },
    { label: "Best Value", href: "/best-value" },
    { label: "On Sale", href: "/on-sale" },
    { label: "Service", href: "/service" },
    { label: "Reviews", href: "/reviews" },
    { label: "Us", href: "/us" },
    { label: "Contact Us", href: "mailto:info@hardwoodliving.com" },
  ];

  const navLinkClass = heroLayout
    ? "text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 transition hover:text-[var(--brand-orange)] sm:text-xs"
    : "transition hover:text-orange-500";

  const navClassName = heroLayout
    ? "relative z-20 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-wide text-gray-800 sm:gap-x-7"
    : "relative z-20 hidden flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wide text-gray-800 lg:flex";

  const renderFlyout = (
    items: Array<NavNode | CategoryNode>,
    isRoot = false,
  ): React.ReactNode => (
    <div
      className={`absolute z-30 hidden min-w-[210px] flex-col gap-1 rounded border border-gray-200 bg-white p-2 text-[11px] font-semibold uppercase text-gray-700 shadow-lg ${
        isRoot ? "left-0 top-full group-hover:flex" : "left-full top-0 group-hover/item:flex"
      }`}
    >
      {items.map((child) => {
        const hasChildren = child.children.length > 0;
        return (
          <div key={child.id} className="relative group/item">
            <Link
              href={child.href}
              className="flex items-center justify-between rounded px-2 py-1 hover:bg-orange-50 hover:text-orange-600"
            >
              <span>{child.label}</span>
              {hasChildren ? <span className="text-xs text-gray-400">+</span> : null}
            </Link>
            {hasChildren ? renderFlyout(child.children, false) : null}
          </div>
        );
      })}
    </div>
  );

  const renderNavLinks = () =>
    topLevel.map((item) => {
      const slugKey = String(item.slug ?? "").replace(/^\//, "");
      const isStore = slugKey === "store";
      const children = isStore ? categoryRoots : item.children ?? [];
      if (children.length === 0) {
        return (
          <Link key={item.id} href={item.href} className={navLinkClass}>
            {item.label}
          </Link>
        );
      }
      return (
        <div key={item.id} className="relative group">
          <Link href={item.href} className={navLinkClass}>
            {item.label}
          </Link>
          {renderFlyout(children, true)}
        </div>
      );
    });

  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-black">
      <header
        className={
          heroLayout
            ? "absolute left-0 right-0 top-0 z-50"
            : "w-full border-b border-gray-200"
        }
      >
        {heroLayout ? (
          <div className="mx-auto max-w-7xl px-4 pb-2 pt-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <BrandLogo compact />
              <div className="flex flex-wrap items-center justify-end gap-2">
                <a
                  href="tel:6047265453"
                  className="rounded-md bg-[var(--brand-orange)] px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:brightness-95 sm:text-xs"
                >
                  604.726.5453
                </a>
                <a
                  href="mailto:info@hardwoodliving.com"
                  className="rounded-md bg-gray-600 px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-gray-700 sm:text-xs"
                >
                  info@hardwoodliving.com
                </a>
                <Link
                  href="/admin"
                  className="rounded-md border border-gray-300/80 bg-white/70 px-3 py-2 text-[11px] font-bold text-gray-700 backdrop-blur-sm transition hover:text-[var(--brand-orange)]"
                >
                  Admin
                </Link>
              </div>
            </div>
            <nav className={`${navClassName} mt-5 border-t border-gray-900/10 pt-4`}>
              {renderNavLinks()}
            </nav>
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 py-3 text-xs font-semibold text-gray-600">
                <span>2328</span>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="tel:6047265453"
                    className="rounded bg-orange-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
                  >
                    604.726.5453
                  </a>
                  <a
                    href="mailto:info@hardwoodliving.com"
                    className="rounded bg-gray-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-gray-600"
                  >
                    info@hardwoodliving.com
                  </a>
                  <Link
                    href="/admin"
                    className="rounded border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:text-orange-500"
                  >
                    Admin
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 py-6">
                <BrandLogo />

                <nav className={navClassName}>{renderNavLinks()}</nav>

                <a
                  href="#"
                  className="hidden text-xs font-bold uppercase text-gray-700 transition hover:text-orange-500 lg:block"
                >
                  Trades Sign In
                </a>
              </div>
            </div>
          </>
        )}
      </header>

      <main className="w-full flex-1">{children}</main>

      <SiteFooter links={footerNav} />
    </div>
  );
}
