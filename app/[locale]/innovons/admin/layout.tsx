import { IENavbar } from "@/components/innovons/IENavbar";
import { AdminSidebar } from "@/components/innovons/AdminSidebar";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireRole('admin', locale);

  return (
    <div className="flex min-h-screen flex-col">
      <IENavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-[#0D0D0D] p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
