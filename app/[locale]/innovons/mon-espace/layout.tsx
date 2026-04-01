import { IENavbar } from "@/components/innovons/IENavbar";
import { MonEspaceSidebar } from "@/components/innovons/MonEspaceSidebar";

export default function MonEspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <IENavbar />
      <div className="flex flex-1">
        <MonEspaceSidebar />
        <main className="flex-1 overflow-auto bg-[#f8f9fa] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
