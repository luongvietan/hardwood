export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "email"
  | "password";

export type AdminField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  list?: boolean;
  relationResource?: string;
};

export type AdminResource = {
  key: string;
  model: string;
  title: string;
  subtitle: string;
  fields: AdminField[];
  defaultOrderBy?: { [k: string]: "asc" | "desc" };
};

export const ADMIN_MENU = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Task Manager",
    items: [
      { label: "Projects", href: "/admin/task-manager/projects" },
      { label: "Tasks", href: "/admin/task-manager/tasks" },
    ],
  },
  {
    label: "Pages & Templates",
    items: [
      { label: "Home Blocks", href: "/admin/pages-templates/home-blocks" },
      { label: "Pages & Structure", href: "/admin/pages-templates/pages-structure" },
      { label: "Email Templates", href: "/admin/pages-templates/email-templates" },
    ],
  },
  {
    label: "Product Catalog",
    items: [
      { label: "Categories", href: "/admin/product-catalog/categories" },
      { label: "Products", href: "/admin/product-catalog/products" },
    ],
  },
  {
    label: "Literature",
    items: [
      { label: "Item", href: "/admin/literature/item" },
      { label: "Folders", href: "/admin/literature/folders" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Testimonial", href: "/admin/settings/testimonial" },
      { label: "Phrase", href: "/admin/settings/phrase" },
      { label: "Defaults", href: "/admin/settings/defaults" },
      { label: "Administrators", href: "/admin/settings/administrators" },
    ],
  },
] as const;

const resources = {
  projects: {
    key: "projects",
    model: "project",
    title: "Projects",
    subtitle: "Task Manager / Projects",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "title", label: "Project Name", type: "text", required: true, list: true },
      { key: "slug", label: "Project Slug", type: "text", required: true, list: true },
      { key: "status", label: "Status", type: "text", list: true },
      { key: "priority", label: "Priority", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "dueDate", label: "Due Date", type: "date" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  tasks: {
    key: "tasks",
    model: "task",
    title: "Tasks",
    subtitle: "Task Manager / Tasks",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "projectId", label: "Project", type: "select", relationResource: "projects", list: true },
      { key: "title", label: "Task Name", type: "text", required: true, list: true },
      { key: "status", label: "Status", type: "text", list: true },
      { key: "assignee", label: "Assignee", type: "text" },
      { key: "priority", label: "Priority", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "dueDate", label: "Due Date", type: "date" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  "home-blocks": {
    key: "home-blocks",
    model: "homeBlock",
    title: "Home Blocks",
    subtitle: "Pages & Templates / Home Blocks",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "callbackKey", label: "Name / Callback", type: "text", required: true, list: true },
      { key: "header", label: "Header", type: "text", required: true, list: true },
      { key: "subheader", label: "Subheader", type: "text" },
      { key: "content", label: "Content", type: "textarea" },
      { key: "imageUrl", label: "Image URL", type: "text" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  "pages-structure": {
    key: "pages-structure",
    model: "pageStructure",
    title: "Pages & Structure",
    subtitle: "Pages & Templates / Pages & Structure",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "parentId", label: "Parent Page", type: "select", relationResource: "pages-structure", list: true },
      { key: "title", label: "Page Name", type: "text", required: true, list: true },
      { key: "slug", label: "Page Link", type: "text", required: true, list: true },
      { key: "template", label: "Template", type: "text" },
      { key: "metaTitle", label: "Meta Title", type: "text" },
      { key: "metaDescription", label: "Meta Description", type: "textarea" },
      { key: "content", label: "Page Content", type: "textarea" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  "email-templates": {
    key: "email-templates",
    model: "emailTemplate",
    title: "Email Templates",
    subtitle: "Pages & Templates / Email Templates",
    fields: [
      { key: "name", label: "Template Name", type: "text", required: true, list: true },
      { key: "slug", label: "Template Key", type: "text", required: true, list: true },
      { key: "subject", label: "Subject", type: "text", required: true, list: true },
      { key: "body", label: "Body", type: "textarea", required: true },
      { key: "isActive", label: "Visible", type: "boolean", list: true },
    ],
  },
  categories: {
    key: "categories",
    model: "category",
    title: "Shop Categories",
    subtitle: "Product Catalog / Categories",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "parentId", label: "Category Parent", type: "select", relationResource: "categories", list: true },
      { key: "name", label: "Category Name", type: "text", required: true, list: true },
      { key: "slug", label: "Category Link", type: "text", required: true, list: true },
      { key: "metaKeywords", label: "Meta Keywords", type: "text" },
      { key: "metaDescription", label: "Meta Description", type: "text" },
      { key: "metaTitle", label: "Category Title (website title)", type: "text" },
      { key: "description", label: "Category Description", type: "textarea" },
      { key: "imageUrl", label: "Image URL", type: "text" },
      { key: "content", label: "Category Text", type: "textarea" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  products: {
    key: "products",
    model: "product",
    title: "Products List",
    subtitle: "Product Catalog / Products",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "categoryId", label: "Product Category", type: "select", relationResource: "categories", list: true },
      { key: "name", label: "Product Name", type: "text", required: true, list: true },
      { key: "slug", label: "Product Link", type: "text", required: true, list: true },
      { key: "announce", label: "Announce", type: "text" },
      { key: "sku", label: "Vendor Code", type: "text", list: true },
      { key: "vendor", label: "Vendor", type: "text", list: true },
      { key: "price", label: "Price", type: "number", list: true },
      { key: "listPrice", label: "List Price", type: "number" },
      { key: "imageUrl", label: "Image URL", type: "text" },
      { key: "description", label: "Description Text", type: "textarea" },
      { key: "technicalData", label: "Technical Data", type: "textarea" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  "literature-item": {
    key: "literature-item",
    model: "literatureItem",
    title: "Literature Item",
    subtitle: "Literature / Item",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "folderId", label: "Folder", type: "select", relationResource: "literature-folders", list: true },
      { key: "title", label: "Item Title", type: "text", required: true, list: true },
      { key: "slug", label: "Item Link", type: "text", required: true, list: true },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "fileUrl", label: "File URL", type: "text" },
      { key: "imageUrl", label: "Image URL", type: "text" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  "literature-folders": {
    key: "literature-folders",
    model: "literatureFolder",
    title: "Literature Folders",
    subtitle: "Literature / Folders",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "name", label: "Folder Name", type: "text", required: true, list: true },
      { key: "slug", label: "Folder Link", type: "text", required: true, list: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  testimonial: {
    key: "testimonial",
    model: "testimonial",
    title: "Testimonials",
    subtitle: "Settings / Testimonial",
    defaultOrderBy: { orderIndex: "asc" as const },
    fields: [
      { key: "author", label: "Author", type: "text", required: true, list: true },
      { key: "role", label: "Role", type: "text", list: true },
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "rating", label: "Rating", type: "number", list: true },
      { key: "orderIndex", label: "Order", type: "number", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  phrase: {
    key: "phrase",
    model: "phrase",
    title: "Phrases",
    subtitle: "Settings / Phrase",
    fields: [
      { key: "key", label: "Phrase Key", type: "text", required: true, list: true },
      { key: "value", label: "Phrase Value", type: "textarea", required: true, list: true },
      { key: "locale", label: "Locale", type: "text", list: true },
      { key: "visible", label: "Visible", type: "boolean", list: true },
    ],
  },
  defaults: {
    key: "defaults",
    model: "defaultSetting",
    title: "Default Data",
    subtitle: "Settings / Defaults",
    fields: [
      { key: "groupName", label: "Group", type: "text", list: true },
      { key: "key", label: "Setting Key", type: "text", required: true, list: true },
      { key: "value", label: "Value", type: "textarea", required: true, list: true },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  administrators: {
    key: "administrators",
    model: "administrator",
    title: "Administrators",
    subtitle: "Settings / Administrators",
    fields: [
      { key: "email", label: "Email", type: "email", required: true, list: true },
      { key: "username", label: "Username", type: "text", required: true, list: true },
      { key: "passwordHash", label: "Password", type: "password", required: true },
      { key: "role", label: "Role", type: "text", list: true },
      { key: "description", label: "Description", type: "text", list: true },
      { key: "isActive", label: "Visible", type: "boolean", list: true },
    ],
  },
} satisfies Record<string, AdminResource>;

export type ResourceKey = keyof typeof resources;

export const ADMIN_RESOURCES = resources;

export function getResourceConfig(resource: string) {
  return ADMIN_RESOURCES[resource as ResourceKey] ?? null;
}
