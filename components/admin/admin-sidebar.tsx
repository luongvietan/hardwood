"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Library,
  Package2,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { ADMIN_MENU } from "@/lib/admin/resources";

type IconType = LucideIcon;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const defaultOpen = useMemo(
    () => ({
      "Task Manager": pathname.startsWith("/admin/task-manager"),
      "Pages & Templates": pathname.startsWith("/admin/pages-templates"),
      "Product Catalog": pathname.startsWith("/admin/product-catalog"),
      Literature: pathname.startsWith("/admin/literature"),
      Settings: pathname.startsWith("/admin/settings"),
    }),
    [pathname],
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultOpen);

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const rootIcons: Record<string, IconType> = {
    Dashboard: LayoutDashboard,
    "Task Manager": FolderKanban,
    "Pages & Templates": FileText,
    "Product Catalog": Package2,
    Literature: Library,
    Settings,
  };

  return (
    <aside className="h-full border-r bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 px-4 py-4">
        <div className="text-xl font-semibold tracking-tight">DeridexAdmin</div>
        <p className="text-xs text-slate-400">Custom CMS 5.0</p>
      </div>
      <nav className="space-y-2 px-2 py-3">
        {ADMIN_MENU.map((group) => {
          const Icon = rootIcons[group.label] ?? LayoutDashboard;
          if ("href" in group) {
            return (
              <Link
                key={group.href}
                href={group.href}
                className={`block rounded-md px-3 py-2 text-sm transition ${
                  isActive(pathname, group.href)
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {group.label}
                </span>
              </Link>
            );
          }
          const isOpen = openGroups[group.label] ?? false;
          return (
            <div key={group.label} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 hover:bg-slate-900"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {group.label}
                </span>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isOpen ? (
                <div className="space-y-1 border-l border-slate-800 pl-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      isActive(pathname, item.href)
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
