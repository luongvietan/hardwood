"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { type AdminField } from "@/lib/admin/resources";
import { AdminFieldControl } from "@/components/admin/admin-field-control";

const PRODUCT_GROUPS: Array<{
  id: string;
  title: string;
  description: string;
  keys: string[];
}> = [
  {
    id: "core",
    title: "Core Details",
    description: "Identity and catalog placement",
    keys: ["categoryId", "name", "slug", "announce", "sku", "vendor", "imageUrl", "imageUrls"],
  },
  {
    id: "pricing",
    title: "Pricing & Visibility",
    description: "Pricing, ordering, and publish state",
    keys: ["price", "listPrice", "orderIndex", "visible"],
  },
  {
    id: "specs",
    title: "Specifications",
    description: "Key product specifications used for detail pages",
    keys: [
      "boxContents",
      "collection",
      "dimensions",
      "finish",
      "impactIsolationClass",
      "installation",
      "lockingSystem",
      "printedDesign",
      "soundTransmission",
      "species",
      "wearLayer",
    ],
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Accessory SKUs and optional extras",
    keys: ["accessoryNosing", "accessoryReducer", "accessoryTmold"],
  },
  {
    id: "references",
    title: "Reference Files",
    description: "PDF links for installation, specs, and warranty",
    keys: ["referenceInstallationUrl", "referenceSpecSheetUrl", "referenceWarrantyUrl"],
  },
  {
    id: "content",
    title: "Content",
    description: "Long-form marketing and technical copy",
    keys: ["description", "technicalData"],
  },
];

type ProductFormProps = {
  fields: AdminField[];
  form: Record<string, string | number | boolean | string[]>;
  relations: Record<string, Array<{ value: string; label: string }>>;
  setForm: Dispatch<SetStateAction<Record<string, string | number | boolean | string[]>>>;
  uploadImage: (file: File) => Promise<string | null>;
};

export function ProductForm({ fields, form, relations, setForm, uploadImage }: ProductFormProps) {
  const fieldMap = new Map(fields.map((field) => [field.key, field]));
  const usedKeys = new Set<string>();
  const [imageInput, setImageInput] = useState("");

  const renderRow = (field: AdminField) => {
    const value = form[field.key];
    const selectOptions = relations[field.key] ?? [];

    if (field.type === "imageList") {
      const images = Array.isArray(value) ? value : [];

      return (
        <div key={field.key} className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
          <div className="flex items-start border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:border-b-0 md:border-r">
            {field.label}
          </div>
          <div className="space-y-4 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                className="h-11 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-300 focus:ring"
                placeholder="Paste image URL"
                value={imageInput}
                onChange={(event) => setImageInput(event.target.value)}
              />
              <button
                type="button"
                className="h-11 rounded-md border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  const url = imageInput.trim();
                  if (!url) return;
                  setForm((prev) => ({
                    ...prev,
                    [field.key]: [...images, url],
                  }));
                  setImageInput("");
                }}
              >
                Add URL
              </button>
              <label className="inline-flex h-11 cursor-pointer items-center rounded-md bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800">
                Upload images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (files.length === 0) return;
                    void Promise.all(files.map((file) => uploadImage(file))).then((urls) => {
                      const next = urls.filter((url): url is string => Boolean(url));
                      if (next.length === 0) return;
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: [...images, ...next],
                      }));
                    });
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            {images.length === 0 ? (
              <p className="text-xs text-slate-500">No gallery images yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((url, index) => (
                  <div key={`${url}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-24 w-full overflow-hidden rounded-md bg-white">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500 hover:text-rose-600"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            [field.key]: images.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>#{index + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded border border-slate-200 px-2 py-1 hover:text-slate-800"
                          onClick={() => {
                            if (index === 0) return;
                            const next = [...images];
                            [next[index - 1], next[index]] = [next[index], next[index - 1]];
                            setForm((prev) => ({ ...prev, [field.key]: next }));
                          }}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="rounded border border-slate-200 px-2 py-1 hover:text-slate-800"
                          onClick={() => {
                            if (index === images.length - 1) return;
                            const next = [...images];
                            [next[index + 1], next[index]] = [next[index], next[index + 1]];
                            setForm((prev) => ({ ...prev, [field.key]: next }));
                          }}
                        >
                          Down
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={field.key} className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <div
          className={`flex border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:border-b-0 md:border-r ${
            field.type === "textarea" ? "items-start pt-4" : "items-center"
          }`}
        >
          {field.label}
          {field.required ? <span className="ml-1 text-rose-500">*</span> : null}
        </div>
        <div className="bg-white px-4 py-3">
          <AdminFieldControl
            field={field}
            value={value}
            selectOptions={selectOptions}
            setForm={setForm}
            uploadImage={uploadImage}
            selectPlaceholder="- Select -"
          />
        </div>
      </div>
    );
  };

  const renderedGroups = PRODUCT_GROUPS.map((group) => {
    const groupFields = group.keys.map((key) => fieldMap.get(key)).filter(Boolean) as AdminField[];
    if (groupFields.length === 0) return null;
    groupFields.forEach((field) => usedKeys.add(field.key));

    return (
      <section key={group.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">{group.title}</h3>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {groupFields.length} fields
            </span>
          </div>
          <p className="text-xs text-slate-500">{group.description}</p>
        </div>
        <div className="divide-y divide-slate-200">{groupFields.map(renderRow)}</div>
      </section>
    );
  });

  const remainingFields = fields.filter((field) => !usedKeys.has(field.key));

  if (remainingFields.length > 0) {
    renderedGroups.push(
      <section key="other" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Other Details</h3>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {remainingFields.length} fields
            </span>
          </div>
          <p className="text-xs text-slate-500">Unsorted product attributes</p>
        </div>
        <div className="divide-y divide-slate-200">{remainingFields.map(renderRow)}</div>
      </section>
    );
  }

  return <div className="space-y-6">{renderedGroups}</div>;
}
