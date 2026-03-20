import { IENavbar } from "@/components/innovons/IENavbar";
import { AdminSidebar } from "@/components/innovons/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <IENavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-gray-950 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
