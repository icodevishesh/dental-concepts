import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-white text-gray-900 p-8">{children}</main>
    </div>
  );
}
