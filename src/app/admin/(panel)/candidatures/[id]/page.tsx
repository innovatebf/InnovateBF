import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton, StatusSelect } from "@/components/admin/RowActions";
import { formatDateTime, PageHeader } from "@/components/admin/ui";
import {
  categories,
  declarations,
  domaines,
  labelOf,
  modes,
  niveauxTrl,
  pieceTypes,
  statutsPorteur,
  stepTitles,
  type Candidature,
} from "@/content/candidature";
import { getCandidature } from "@/server/admin-data";
import { requirePageUser } from "@/server/auth/guard";
import { piecePath } from "@/server/storage";
import { ApiError } from "@/server/http";

export const metadata: Metadata = { title: "Candidature" };

const yn = (v: boolean | null) => (v ? "Oui" : "Non");

function Block({ title, rows }: { title: string; rows: [string, React.ReactNode][] }) {
  return (
    <section className="adm-card adm-card-pad">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <dl className="grid gap-3">
        {rows.map(([k, v], i) => (
          <div key={i} className="grid gap-1 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <dt className="text-[13.5px] text-[#6b746f]">{k}</dt>
            <dd className="whitespace-pre-wrap break-words text-[14.5px]">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default async function CandidaturePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  if (!/^[1-9]\d{0,9}$/.test(id)) notFound();
  const row = await getCandidature(Number(id)).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!row) notFound();
  const d = row.data as Candidature;
  const p = d.porteur;

  return (
    <>
      <PageHeader
        title={row.title}
        subtitle={
          <>
            Dossier <span className="font-mono">{row.numero}</span> · reçu le {formatDateTime(row.createdAt)}
          </>
        }
        actions={
          <>
            <Link href="/admin/candidatures" className="adm-btn adm-btn-ghost">
              Retour à la liste
            </Link>
            {user.role === "admin" && (
              <DeleteButton url={`/api/admin/candidatures/${row.id}`} label={`le dossier ${row.numero}`} redirectTo="/admin/candidatures" />
            )}
          </>
        }
      />
      <div className="adm-card adm-card-pad mb-4 flex flex-wrap items-center gap-4">
        <span className="adm-label">Statut du dossier</span>
        <StatusSelect id={row.id} status={row.status} />
      </div>
      <div className="grid gap-4">
        <Block
          title={`A. ${stepTitles.A}`}
          rows={[
            ["Nom", `${p.prenom} ${p.nom}`],
            ["Statut", labelOf(statutsPorteur, p.statut)],
            ["Structure", p.structure],
            ["E-mail", <a key="e" href={`mailto:${p.email}`} className="text-faso hover:underline">{p.email}</a>],
            ["Téléphone", p.telephone],
            ["Ville", `${p.ville}, ${p.pays}`],
            ["Équipe", p.equipe],
            ["Affiliation à une structure organisatrice", `${yn(p.affiliationOrganisateur)}${p.affiliationPrecision ? ` — ${p.affiliationPrecision}` : ""}`],
          ]}
        />
        <Block
          title={`B. ${stepTitles.B}`}
          rows={[
            ["Titre", d.projet.titre],
            ["Domaine fonctionnel", labelOf(domaines, d.projet.domaine)],
            ["Catégorie", labelOf(categories, d.projet.categorie)],
            ["Résumé", d.projet.resume],
            ["Problème endogène adressé", d.projet.problemeEndogene],
          ]}
        />
        <Block
          title={`C. ${stepTitles.C}`}
          rows={[
            ["Description technique", d.technique.description],
            ["Caractère innovant", d.technique.caractereInnovant],
            ["Niveau de maturité", d.technique.trl ? `TRL ${d.technique.trl} — ${niveauxTrl[d.technique.trl - 1]}` : ""],
            ["Faisabilité", d.technique.faisabilite],
          ]}
        />
        <Block
          title={`D. ${stepTitles.D}`}
          rows={[
            ["Impact sociétal", d.impact.societal],
            ["Impact économique", d.impact.economique],
            ["Impact environnemental", d.impact.environnemental],
            ["Contribution au développement endogène", d.impact.contributionEndogene],
          ]}
        />
        <Block
          title={`E. ${stepTitles.E}`}
          rows={
            d.pieces.length
              ? d.pieces.map((pc, i) => [
                  `${pieceTypes.find((t) => t.code === pc.type)?.label ?? pc.type} (${pc.mode === "lien" ? "lien" : "fichier"})`,
                  /^https?:\/\//i.test(pc.url) ? (
                    // Fichier téléversé : espace privé, ouvert par un lien temporaire
                    <a
                      key={i}
                      href={pc.mode === "upload" && piecePath(pc.url) ? `/api/admin/candidatures/${row.id}/pieces/${i}` : pc.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="break-all text-faso hover:underline"
                    >
                      {pc.nom || pc.url}
                    </a>
                  ) : (
                    pc.url
                  ),
                ])
              : [["Pièces jointes", "Aucune pièce : démonstrateur manquant"]]
          }
        />
        <Block
          title={`F. ${stepTitles.F}`}
          rows={[...declarations.obligatoires, ...declarations.optionnels].map((x) => [x.label, yn(d.declarations[x.code])])}
        />
        <Block
          title={`G. ${stepTitles.G}`}
          rows={[
            ["Mode de présentation", labelOf(modes, d.presentation.modePrevu)],
            ["Besoins logistiques", d.presentation.besoinsLogistiques],
            ["Diaspora", `${yn(d.presentation.diaspora)}${d.presentation.paysResidence ? ` — ${d.presentation.paysResidence}` : ""}`],
          ]}
        />
      </div>
    </>
  );
}
