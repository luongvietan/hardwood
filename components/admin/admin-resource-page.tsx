"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  type AdminField,
  type AdminResource,
  type ResourceKey,
  ADMIN_RESOURCES,
} from "@/lib/admin/resources";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type ItemRecord = Record<string, unknown> & {
  id: string;
  parentId?: string | number;
  orderIndex?: number;
  title?: string;
  name?: string;
  slug?: string;
};
type HierarchyItem = {
  item: ItemRecord;
  depth: number;
  hasChildren: boolean;
  isLastChild: boolean;
  orderLabel: string;
};

const PROTECTED_PAGES = new Set(["store"]);

function defaultForm(fields: AdminField[]) {
  const data: Record<string, string | number | boolean> = {};
  for (const field of fields) {
    if (field.type === "boolean") {
      data[field.key] = true;
    } else if (field.type === "number") {
      data[field.key] = 0;
    } else {
      data[field.key] = "";
    }
  }
  return data;
}

function isImageField(field: AdminField) {
  const key = field.key.toLowerCase();
  const label = field.label.toLowerCase();
  return key.includes("image") || label.includes("image");
}

export function AdminResourcePage({ resourceKey }: { resourceKey: ResourceKey }) {
  const isHierarchyResource = resourceKey === "pages-structure" || resourceKey === "categories";
  const config: AdminResource = ADMIN_RESOURCES[resourceKey];
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(defaultForm(config.fields));
  const [relations, setRelations] = useState<Record<string, Array<{ value: string; label: string }>>>({});
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const editorSectionRef = useRef<HTMLDivElement | null>(null);
  const listFields = useMemo(
    () => config.fields.filter((field: AdminField) => field.list).slice(0, 6),
    [config.fields],
  );

  const hierarchyOptions = useMemo(() => {
    if (!isHierarchyResource) {
      return [];
    }
    const nodes = new Map<string, { item: ItemRecord; children: string[] }>();
    items.forEach((item) => nodes.set(String(item.id), { item, children: [] }));
    const roots: string[] = [];
    items.forEach((item) => {
      const pId = item.parentId ? String(item.parentId) : "";
      if (pId && nodes.has(pId)) nodes.get(pId)!.children.push(String(item.id));
      else roots.push(String(item.id));
    });
    const sortFn = (ids: string[]) =>
      ids.sort(
        (a, b) => (Number(nodes.get(a)?.item.orderIndex) || 0) - (Number(nodes.get(b)?.item.orderIndex) || 0),
      );
    const options: Array<{ value: string; label: string }> = [];
    const walk = (id: string, depth: number) => {
      const node = nodes.get(id);
      if (!node) return;
      const prefix = depth > 0 ? `${"-- ".repeat(depth)}` : "";
      const label = String(node.item.title ?? node.item.name ?? "Untitled");
      options.push({ value: id, label: `${prefix}${label}` });
      const childIds = sortFn(node.children);
      childIds.forEach((childId) => walk(childId, depth + 1));
    };
    sortFn(roots).forEach((rootId) => walk(rootId, 0));
    return options;
  }, [items, isHierarchyResource]);

  const descendantMap = useMemo(() => {
    if (!isHierarchyResource) {
      return new Map<string, Set<string>>();
    }
    const childrenMap = new Map<string, string[]>();
    items.forEach((item) => {
      const parentKey = item.parentId ? String(item.parentId) : "";
      if (!parentKey) return;
      const list = childrenMap.get(parentKey) ?? [];
      list.push(String(item.id));
      childrenMap.set(parentKey, list);
    });
    const map = new Map<string, Set<string>>();
    const visit = (id: string) => {
      if (map.has(id)) return map.get(id)!;
      const set = new Set<string>();
      const kids = childrenMap.get(id) ?? [];
      for (const kid of kids) {
        set.add(kid);
        const kidSet = visit(kid);
        kidSet.forEach((v) => set.add(v));
      }
      map.set(id, set);
      return set;
    };
    items.forEach((item) => visit(String(item.id)));
    return map;
  }, [items, isHierarchyResource]);

  // --- API Actions ---
  async function load() {
    const res = await fetch(`/api/admin/${resourceKey}`);
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const [listRes, optionsRes] = await Promise.all([
        fetch(`/api/admin/${resourceKey}`),
        fetch(`/api/admin/${resourceKey}/options`),
      ]);
      if (cancelled) {
        return;
      }
      const listData = await listRes.json();
      const optionsData = await optionsRes.json();
      if (cancelled) {
        return;
      }
      setItems(listData.items ?? []);
      setRelations(optionsData.options ?? {});
      setLoading(false);
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [resourceKey]);

  useEffect(() => {
    if (!open) {
      return;
    }
    editorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);

  function onCreate() {
    setCurrentId(null);
    setForm(defaultForm(config.fields));
    setOpen(true);
  }

  function onEdit(item: ItemRecord) {
    const next = defaultForm(config.fields);
    for (const field of config.fields) {
      if (field.type === "password") {
        next[field.key] = "";
        continue;
      }
      next[field.key] = (item[field.key] as string | number | boolean) ?? next[field.key];
    }
    setCurrentId(String(item.id));
    setForm(next);
    setOpen(true);
  }

  async function onDelete(id: string) {
    if (resourceKey === "pages-structure") {
      const item = items.find((entry) => String(entry.id) === id);
      const slug = String(item?.slug ?? "").replace(/^\//, "");
      if (PROTECTED_PAGES.has(slug)) {
        window.alert("This page is protected and cannot be deleted.");
        return;
      }
    }
    if (!window.confirm("Delete this item?")) {
      return;
    }
    await fetch(`/api/admin/${resourceKey}/${id}`, { method: "DELETE" });
    setLoading(true);
    await load();
    setLoading(false);
  }

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      window.alert(data.error ?? "Upload failed");
      return null;
    }
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  }

  async function onSubmit() {
    const url = currentId ? `/api/admin/${resourceKey}/${currentId}` : `/api/admin/${resourceKey}`;
    const method = currentId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      window.alert(data.error ?? "Save failed");
      return;
    }
    setOpen(false);
    setLoading(true);
    await load();
    setLoading(false);
  }

  async function moveOrder(itemId: string, direction: "up" | "down") {
    const item = items.find(i => String(i.id) === itemId);
    const siblings = items
      .filter(i => String(i.parentId || "") === String(item?.parentId || ""))
      .sort((a, b) => (Number(a.orderIndex) || 0) - (Number(b.orderIndex) || 0));
    
    const currentIndex = siblings.findIndex(i => String(i.id) === itemId);
    const swapWith = direction === "up" ? siblings[currentIndex - 1] : siblings[currentIndex + 1];

    if (!swapWith) return;

    await Promise.all([
      fetch(`/api/admin/${resourceKey}/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIndex: swapWith.orderIndex }),
      }),
      fetch(`/api/admin/${resourceKey}/${swapWith.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIndex: item?.orderIndex }),
      })
    ]);
    load();
  }

  function readValue(
    item: ItemRecord,
    field: AdminField,
    relationOptions: Record<string, Array<{ value: string; label: string }>>,
  ) {
    const value = item[field.key];
    if (field.type === "boolean") {
      return value ? "Visible" : "Hidden";
    }
    if (field.type === "select") {
      const options = relationOptions[field.key] ?? [];
      const matched = options.find((opt) => opt.value === String(value ?? ""));
      return matched?.label ?? String(value ?? "");
    }
    if (field.type === "date" && value) {
      const date = new Date(String(value));
      return Number.isNaN(date.getTime()) ? String(value ?? "") : date.toLocaleDateString();
    }
    return String(value ?? "");
  }

  async function onQuickToggle(item: ItemRecord, field: AdminField) {
    await fetch(`/api/admin/${resourceKey}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field.key]: !item[field.key] }),
    });
    load();
  }

  function formatOrder(value: unknown) {
    const num = Number(value ?? 0);
    if (!Number.isFinite(num)) {
      return "000";
    }
    return String(Math.max(0, Math.trunc(num))).padStart(3, "0");
  }

  // --- Hierarchy Logic ---
  const displayItems = useMemo(() => {
    if (!isHierarchyResource) {
      return items.map((item) => ({
        item,
        depth: 0,
        hasChildren: false,
        isLastChild: false,
        orderLabel: formatOrder(item.orderIndex),
      }));
    }

    const nodes = new Map<string, { item: ItemRecord; children: string[] }>();
    items.forEach((item) => nodes.set(String(item.id), { item, children: [] }));
    const roots: string[] = [];
    items.forEach((item) => {
      const pId = item.parentId ? String(item.parentId) : "";
      if (pId && nodes.has(pId)) nodes.get(pId)!.children.push(String(item.id));
      else roots.push(String(item.id));
    });

    const sortFn = (ids: string[]) => ids.sort((a, b) => (Number(nodes.get(a)?.item.orderIndex) || 0) - (Number(nodes.get(b)?.item.orderIndex) || 0));
    const flat: HierarchyItem[] = [];

    const walk = (id: string, depth: number, isHidden: boolean, isLast: boolean, orderIndex: number) => {
      const node = nodes.get(id);
      if (!node) return;
      const hasChildren = node.children.length > 0;
      if (!isHidden) {
        flat.push({
          item: node.item,
          depth,
          hasChildren,
          isLastChild: isLast,
          orderLabel: formatOrder(orderIndex),
        });
      }
      
      const childIds = sortFn(node.children);
      childIds.forEach((cId, i) =>
        walk(cId, depth + 1, isHidden || collapsedIds.has(id), i === childIds.length - 1, i),
      );
    };

    sortFn(roots).forEach((rId, i) => walk(rId, 0, false, i === roots.length - 1, i));
    return flat;
  }, [items, isHierarchyResource, collapsedIds]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{config.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{config.subtitle}</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg"
        >
          + Add New
        </button>
      </div>

      {/* Table */}
      {isHierarchyResource ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50/80 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-8 py-4">Name</th>
                <th className="px-6 py-4 text-center">Visible</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-400 animate-pulse">
                    Loading structure...
                  </td>
                </tr>
              ) : (
                displayItems.map(({ item, depth, hasChildren, isLastChild, orderLabel }) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4 relative">
                      <div className="flex items-center" style={{ paddingLeft: depth * 32 }}>
                        {depth > 0 && (
                          <div
                            className="absolute flex items-center"
                            style={{ left: (depth - 1) * 32 + 42 }}
                          >
                            <div
                              className={`w-[2px] ${
                                isLastChild ? "h-5 -top-5" : "h-14 -top-5"
                              } bg-slate-200 absolute`}
                            />
                            <div className="w-4 h-[2px] bg-slate-200" />
                          </div>
                        )}

                        <div className="z-10 flex items-center gap-3">
                          {hasChildren ? (
                            <button
                              onClick={() =>
                                setCollapsedIds((prev) => {
                                  const n = new Set(prev);
                                  n.has(String(item.id))
                                    ? n.delete(String(item.id))
                                    : n.add(String(item.id));
                                  return n;
                                })
                              }
                              className={`w-6 h-6 rounded-md flex items-center justify-center border border-slate-200 bg-white transition-all shadow-sm ${
                                collapsedIds.has(String(item.id)) ? "" : "rotate-90"
                              }`}
                            >
                              <svg
                                className="w-3 h-3 text-slate-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                              </svg>
                            </button>
                          ) : (
                            <div className="w-6 h-6 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="inline-flex min-w-9 justify-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {orderLabel}
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                depth === 0 ? "text-slate-900" : "text-slate-600"
                              }`}
                            >
                              {String(item.title ?? item.name ?? "Untitled")}
                            </span>
                            {depth === 0 ? (
                              <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-indigo-100">
                                {resourceKey === "pages-structure" ? "Root Page" : "Root Category"}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          fetch(`/api/admin/${resourceKey}/${item.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ visible: !item.visible }),
                          }).then(load)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all border shadow-sm ${
                          item.visible
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${
                            item.visible ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                        {item.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 mr-2">
                          <button
                            onClick={() => moveOrder(String(item.id), "up")}
                            className="p-1.5 hover:text-indigo-600 text-slate-400 transition"
                            title="Move Up"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveOrder(String(item.id), "down")}
                            className="p-1.5 hover:text-indigo-600 text-slate-400 transition"
                            title="Move Down"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={() => onEdit(item)}
                          className="h-9 px-4 bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          Edit
                        </button>

                        {resourceKey === "pages-structure" &&
                        PROTECTED_PAGES.has(String(item.slug || "").replace("/", "")) ? (
                          <span className="h-9 w-9" aria-hidden />
                        ) : (
                          <button
                            onClick={() => onDelete(String(item.id))}
                            className="h-9 w-9 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 rounded-lg transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {listFields.map((field) => (
                  <th key={field.key} className="px-4 py-3">
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={listFields.length + 1}
                    className="p-6 text-center text-sm text-slate-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-t">
                    {listFields.map((field) => (
                      <td key={field.key} className="px-4 py-3 text-slate-700">
                        {field.type === "boolean" ? (
                          <button
                            type="button"
                            onClick={() => onQuickToggle(item, field)}
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition ${
                              item[field.key]
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            }`}
                          >
                            {item[field.key] ? "Visible" : "Hidden"}
                          </button>
                        ) : (
                          readValue(item, field, relations)
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          onClick={() => onEdit(item)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="inline-flex rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                          onClick={() => onDelete(String(item.id))}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {open ? (
        <section ref={editorSectionRef} className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">{currentId ? "Edit Item" : "Create Item"}</h2>
              <p className="text-sm text-slate-500">Update fields and save changes.</p>
            </div>
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {config.fields.map((field) => {
                const value = form[field.key];
                const fieldColSpan = field.type === "textarea" ? "md:col-span-2 xl:col-span-3" : "";
                const selectOptions =
                  field.key === "parentId" && isHierarchyResource
                    ? hierarchyOptions.filter((opt) => {
                        const current = currentId ? String(currentId) : "";
                        if (!current) return true;
                        if (opt.value === current) return false;
                        const descendants = descendantMap.get(current);
                        return !descendants?.has(opt.value);
                      })
                    : relations[field.key] ?? [];

                return (
                  <div key={field.key} className={`space-y-1.5 ${fieldColSpan}`}>
                    <label htmlFor={field.key} className="text-sm font-medium text-slate-700">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <RichTextEditor
                        id={field.key}
                        value={String(value ?? "")}
                        onImageUpload={uploadImage}
                        onChange={(nextValue) =>
                          setForm((prev) => ({
                            ...prev,
                            [field.key]: nextValue,
                          }))
                        }
                      />
                    ) : field.type === "boolean" ? (
                      <select
                        id={field.key}
                        className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-300 focus:ring"
                        value={value ? "true" : "false"}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value === "true" }))}
                      >
                        <option value="true">Visible</option>
                        <option value="false">Hidden</option>
                      </select>
                    ) : field.type === "select" ? (
                      <select
                        id={field.key}
                        className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-300 focus:ring"
                        value={String(value ?? "")}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      >
                        <option value="">- Top Level -</option>
                        {selectOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "text" && isImageField(field) ? (
                      <div className="space-y-2">
                        <input
                          id={field.key}
                          className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-300 focus:ring"
                          type="text"
                          value={String(value ?? "")}
                          placeholder="/uploads/example.jpg or https://..."
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                        />
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`${field.key}-upload`}
                            className="inline-flex h-9 cursor-pointer items-center rounded-md border border-slate-300 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Upload image
                          </label>
                          <input
                            id={`${field.key}-upload`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) {
                                return;
                              }
                              void uploadImage(file).then((url) => {
                                if (!url) {
                                  return;
                                }
                                setForm((prev) => ({
                                  ...prev,
                                  [field.key]: url,
                                }));
                              });
                              event.currentTarget.value = "";
                            }}
                          />
                          {value ? (
                            <a
                              href={String(value)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-slate-500 underline"
                            >
                              Preview
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <input
                        id={field.key}
                        className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-300 focus:ring"
                        type={
                          field.type === "number"
                            ? "number"
                            : field.type === "date"
                              ? "date"
                              : field.type === "email"
                                ? "email"
                                : field.type === "password"
                                  ? "password"
                                  : "text"
                        }
                        value={String(value ?? "")}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field.key]: field.type === "number" ? Number(e.target.value || 0) : e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                onClick={onSubmit}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
