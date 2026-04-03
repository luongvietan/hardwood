"use client";

import { type Dispatch, type SetStateAction } from "react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { type AdminField } from "@/lib/admin/resources";

function isImageField(field: AdminField) {
  const key = field.key.toLowerCase();
  const label = field.label.toLowerCase();
  return key.includes("image") || label.includes("image");
}

type AdminFieldControlProps = {
  field: AdminField;
  value: string | number | boolean | string[];
  selectOptions: Array<{ value: string; label: string }>;
  setForm: Dispatch<SetStateAction<Record<string, string | number | boolean | string[]>>>;
  uploadImage: (file: File) => Promise<string | null>;
  selectPlaceholder?: string;
};

export function AdminFieldControl({
  field,
  value,
  selectOptions,
  setForm,
  uploadImage,
  selectPlaceholder,
}: AdminFieldControlProps) {
  if (field.type === "textarea") {
    return (
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
    );
  }

  if (field.type === "boolean") {
    return (
      <select
        id={field.key}
        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-300 focus:ring"
        value={value ? "true" : "false"}
        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value === "true" }))}
      >
        <option value="true">Visible</option>
        <option value="false">Hidden</option>
      </select>
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={field.key}
        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-300 focus:ring"
        value={String(value ?? "")}
        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
      >
        <option value="">{selectPlaceholder ?? "- Top Level -"}</option>
        {selectOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "text" && isImageField(field)) {
    const previewSrc = String(value ?? "").trim();
    const showPreview = previewSrc.length > 0;

    return (
      <div className="space-y-2">
        <input
          id={field.key}
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-300 focus:ring"
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
        <div className="flex flex-wrap items-center gap-2">
          <label
            htmlFor={`${field.key}-upload`}
            className="inline-flex h-9 cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
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
            <a href={String(value)} target="_blank" rel="noreferrer" className="text-xs text-slate-500 underline">
              Preview
            </a>
          ) : null}
        </div>
        {showPreview ? (
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              <img src={previewSrc} alt="" className="h-full w-full object-cover" />
            </div>
            <span className="text-xs text-slate-500">Image preview</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <input
      id={field.key}
      className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-300 focus:ring"
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
  );
}
