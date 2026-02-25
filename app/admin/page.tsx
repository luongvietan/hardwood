import { prisma, safeDbCall } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [projects, tasks, pages, categories, products] = await Promise.all([
    safeDbCall(0, async () => prisma.project.count()),
    safeDbCall(0, async () => prisma.task.count()),
    safeDbCall(0, async () => prisma.pageStructure.count()),
    safeDbCall(0, async () => prisma.category.count()),
    safeDbCall(0, async () => prisma.product.count()),
  ]);

  const stats = [
    { label: "Projects", value: projects },
    { label: "Tasks", value: tasks },
    { label: "Pages", value: pages },
    { label: "Categories", value: categories },
    { label: "Products", value: products },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of records in your custom CMS.</p>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
          Overview
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Total Records</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item) => (
                <tr key={item.label} className="border-t">
                  <td className="px-4 py-3 text-slate-700">{item.label}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
