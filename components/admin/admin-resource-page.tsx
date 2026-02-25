"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  type AdminField,
  type AdminResource,
  type ResourceKey,
  ADMIN_RESOURCES,
} from "@/lib/admin/resources";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type ItemRecord = Record<string, unknown> & { id: string };

function readValue(item: ItemRecord, field: AdminField) {
  const value = item[field.key];
  if (field.type === "boolean") {
    return value ? (
      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
        Visible
      </span>
    ) : (
      <span className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
        Hidden
      </span>
    );
  }
  if (field.type === "date" && value) {
    return new Date(String(value)).toLocaleDateString();
  }
  return String(value ?? "");
}

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
  const config: AdminResource = ADMIN_RESOURCES[resourceKey];
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(defaultForm(config.fields));
  const [relations, setRelations] = useState<Record<string, Array<{ value: string; label: string }>>>({});
  const editorSectionRef = useRef<HTMLDivElement | null>(null);

  const listFields = useMemo(
    () => config.fields.filter((field: AdminField) => field.list).slice(0, 6),
    [config.fields],
  );

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
    setCurrentId(item.id);
    setForm(next);
    setOpen(true);
  }

  async function onDelete(id: string) {
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
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setOpen(false);
    setLoading(true);
    await load();
    setLoading(false);
  }

  async function onQuickToggle(item: ItemRecord, field: AdminField) {
    const current = Boolean(item[field.key]);
    const res = await fetch(`/api/admin/${resourceKey}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field.key]: !current }),
    });
    if (!res.ok) {
      return;
    }
    await load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{config.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{config.subtitle}</p>
        </div>
        <button
          className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          onClick={onCreate}
          type="button"
        >
          Add New
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
          Records
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  {listFields.map((field) => (
                    <th key={field.key} className="px-4 py-3">
                      {field.label}
                    </th>
                  ))}
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 text-slate-600">{index + 1}</td>
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
                          readValue(item, field)
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          onClick={() => onEdit(item)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="inline-flex rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                          onClick={() => onDelete(item.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                        {(relations[field.key] ?? []).map((opt) => (
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
