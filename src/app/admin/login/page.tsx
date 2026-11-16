import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="adm-card w-full max-w-[400px] p-7">
        <div className="flex items-center gap-3">
          <Image src="/logo-innovatebf-emblem.png" alt="" width={150} height={127} className="h-10 w-auto" priority />
          <div>
            <p className="font-[family-name:var(--font-sans)] text-xl font-bold leading-none">
              Innovate<span className="text-faso">BF</span>
            </p>
            <p className="mt-1 text-[13px] text-[#6b746f]">Back-office</p>
          </div>
        </div>
        <h1 className="adm-title mt-6 text-[24px]">Connexion</h1>
        <p className="adm-subtitle">Accès réservé aux administrateurs et éditeurs du site.</p>
        <LoginForm />
      </div>
    </main>
  );
}
