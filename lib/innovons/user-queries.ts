import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Need, Proposal } from "./types";
import { MOCK_NEEDS } from "./mock-data";

// Profil utilisateur etendu
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: "UTILISATEUR" | "PARRAIN" | "INNOVATEUR" | "ADMINISTRATEUR";
  organisation?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

// Mock user
const MOCK_USER_PROFILE: UserProfile = {
  id: "mock-user-1",
  full_name: "Adama Ouedraogo",
  email: "adama@example.bf",
  role: "INNOVATEUR",
  organisation: "TechBF Lab",
  bio: "Entrepreneur technologique au Burkina Faso, passionne par les solutions locales.",
  avatar_url: undefined,
  created_at: "2025-01-15T00:00:00Z",
};

// Mock proposals soumises par l'utilisateur
const MOCK_USER_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    need_id: "need-001",
    titre: "Application mobile de diagnostic precoce",
    description:
      "Plateforme mobile permettant aux agents de sante communautaires de faire des diagnostics precoces via IA.",
    porteur: "Adama Ouedraogo",
    organisation: "TechBF Lab",
    statut: "EN_ATTENTE",
    created_at: "2026-02-10T00:00:00Z",
  },
  {
    id: "prop-2",
    need_id: "need-003",
    titre: "Systeme d'alerte meteo agricole SMS",
    description:
      "Solution SMS pour alerter les agriculteurs des risques meteorologiques en temps reel.",
    porteur: "Adama Ouedraogo",
    organisation: "TechBF Lab",
    statut: "RETENU",
    created_at: "2026-01-20T00:00:00Z",
  },
];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    !url.includes("your-project") &&
    !key.includes("your-anon-key")
  );
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return MOCK_USER_PROFILE;

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("ie_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return (data as UserProfile) ?? null;
  } catch {
    return MOCK_USER_PROFILE;
  }
}

export async function getUserNeeds(userId: string): Promise<Need[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_NEEDS.slice(0, 3).map((n) => ({ ...n, auteur_id: userId }));
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      },
    );

    const { data } = await supabase
      .from("ie_needs")
      .select("*")
      .eq("auteur_id", userId)
      .order("created_at", { ascending: false });

    return (data ?? []) as Need[];
  } catch {
    return MOCK_NEEDS.slice(0, 3).map((n) => ({ ...n, auteur_id: userId }));
  }
}

export async function getUserProposals(userId: string): Promise<Proposal[]> {
  if (!isSupabaseConfigured()) return MOCK_USER_PROPOSALS;

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      },
    );

    const { data } = await supabase
      .from("ie_proposals")
      .select("*")
      .eq("auteur_id", userId)
      .order("created_at", { ascending: false });

    return (data ?? []) as Proposal[];
  } catch {
    return MOCK_USER_PROPOSALS;
  }
}
