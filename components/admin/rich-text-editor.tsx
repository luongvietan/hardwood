"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eraser,
  Heading4,
  Heading5,
  Heading6,
  ImagePlus,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Underline as UnderlineIcon,
  Strikethrough,
  Table2,
  Unlink2,
  Undo2,
} from "lucide-react";

type RichTextEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
};

type ToolbarButton = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action: (run: RunAction) => void;
};

type RunAction = (fn: (chain: ReturnType<NonNullable<ReturnType<typeof useEditor>>["chain"]>) => unknown) => void;

export function RichTextEditor({ id, value, onChange, onImageUpload }: RichTextEditorProps) {
  const [focused, setFocused] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputId = `${id}-image-upload`;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto", "tel"],
      }),
      Image.configure({
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "min-h-40 w-full p-3 text-sm outline-none prose prose-sm max-w-none prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2",
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  const run: RunAction = useCallback(
    (fn) => {
      if (!editor) {
        return;
      }
      fn(editor.chain().focus());
    },
    [editor],
  );

  const toolbarButtons: ToolbarButton[] = useMemo(
    () => [
      { title: "Undo", icon: Undo2, action: (doRun) => doRun((chain) => chain.undo().run()) },
      { title: "Redo", icon: Redo2, action: (doRun) => doRun((chain) => chain.redo().run()) },
      { title: "Bold", icon: Bold, action: (doRun) => doRun((chain) => chain.toggleBold().run()) },
      { title: "Italic", icon: Italic, action: (doRun) => doRun((chain) => chain.toggleItalic().run()) },
      { title: "Underline", icon: UnderlineIcon, action: (doRun) => doRun((chain) => chain.toggleUnderline().run()) },
      { title: "Strike", icon: Strikethrough, action: (doRun) => doRun((chain) => chain.toggleStrike().run()) },
      { title: "H4", icon: Heading4, action: (doRun) => doRun((chain) => chain.toggleHeading({ level: 4 }).run()) },
      { title: "H5", icon: Heading5, action: (doRun) => doRun((chain) => chain.toggleHeading({ level: 5 }).run()) },
      { title: "H6", icon: Heading6, action: (doRun) => doRun((chain) => chain.toggleHeading({ level: 6 }).run()) },
      { title: "Align left", icon: AlignLeft, action: (doRun) => doRun((chain) => chain.setTextAlign("left").run()) },
      { title: "Align center", icon: AlignCenter, action: (doRun) => doRun((chain) => chain.setTextAlign("center").run()) },
      { title: "Align right", icon: AlignRight, action: (doRun) => doRun((chain) => chain.setTextAlign("right").run()) },
      { title: "Align justify", icon: AlignJustify, action: (doRun) => doRun((chain) => chain.setTextAlign("justify").run()) },
      { title: "Bullet list", icon: List, action: (doRun) => doRun((chain) => chain.toggleBulletList().run()) },
      { title: "Number list", icon: ListOrdered, action: (doRun) => doRun((chain) => chain.toggleOrderedList().run()) },
      { title: "Outdent", icon: IndentDecrease, action: (doRun) => doRun((chain) => chain.liftListItem("listItem").run()) },
      { title: "Indent", icon: IndentIncrease, action: (doRun) => doRun((chain) => chain.sinkListItem("listItem").run()) },
      {
        title: "Table",
        icon: Table2,
        action: (doRun) => doRun((chain) => chain.insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()),
      },
      { title: "Code", icon: Code2, action: (doRun) => doRun((chain) => chain.toggleCodeBlock().run()) },
      { title: "Clear", icon: Eraser, action: (doRun) => doRun((chain) => chain.clearNodes().unsetAllMarks().run()) },
    ],
    [],
  );

  async function handleUploadImage(file: File) {
    if (!file) {
      return;
    }
    if (!onImageUpload || !editor) {
      return;
    }
    setUploading(true);
    try {
      const uploadedUrl = await onImageUpload(file);
      if (uploadedUrl) {
        editor.chain().focus().setImage({ src: uploadedUrl }).run();
      }
    } finally {
      setUploading(false);
    }
  }

  function insertImageFromUrl() {
    if (!editor) {
      return;
    }
    const url = window.prompt("Enter image URL");
    if (!url) {
      return;
    }
    editor.chain().focus().setImage({ src: url }).run();
  }

  function insertLink() {
    if (!editor) {
      return;
    }
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) {
      return;
    }
    if (!url) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="rounded-md border border-slate-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b bg-slate-50 p-2">
        {toolbarButtons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.title}
              type="button"
              title={button.title}
              onClick={() => button.action(run)}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
        <button
          type="button"
          title="Link"
          onClick={insertLink}
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Unlink"
          onClick={() => run((chain) => chain.unsetLink().run())}
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
        >
          <Unlink2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Image URL"
          onClick={insertImageFromUrl}
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
        <label
          htmlFor={fileInputId}
          className="inline-flex h-8 items-center justify-center rounded border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          {uploading ? "Uploading..." : "Upload"}
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleUploadImage(file);
            }
            event.currentTarget.value = "";
          }}
        />
      </div>
      <div
        id={id}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`min-h-40 w-full p-3 text-sm outline-none ${
          focused ? "ring-2 ring-slate-300 ring-inset" : ""
        }`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
