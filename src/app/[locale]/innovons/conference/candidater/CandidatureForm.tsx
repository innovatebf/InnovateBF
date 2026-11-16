"use client";

import { useEffect, useId, useRef, useState } from "react";
import f from "@/components/form.module.css";
import { Icon } from "@/components/Icon";
import {
  affiliationLabel,
  categories,
  declarations,
  domaines,
  emptyCandidature,
  isUrl,
  labelIn,
  labelOf,
  lengths,
  messages,
  modes,
  pieceRules,
  pieceTypes,
  statutsPorteur,
  stepOfPath,
  steps,
  stepTitle,
  trlLevels,
  validateStep,
  type Candidature,
  type Choice,
  type Piece,
  type PieceType,
} from "@/content/candidature";
import { localize, type Translate } from "@/i18n";
import { useLocale, useT } from "@/i18n/client";
import { api, ApiClientError } from "@/lib/api-client";
import s from "./candidature.module.css";

type Done = { numero: string; date: string; email: string; emailSent: boolean; missingDemo: boolean };
const mo = (n: number, t: Translate) => `${(n / 1024 / 1024).toFixed(1)} ${t("Mo", "MB")}`;

/* ---------- Champs ---------- */

function Text({
  label,
  value,
  onChange,
  required,
  error,
  max,
  help,
  type = "text",
  multiline,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  max?: number;
  help?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  const t = useT();
  const props = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onChange(e.target.value),
    maxLength: max,
    required,
    autoComplete,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-err` : help ? `${id}-help` : undefined,
  };
  return (
    <div className={`${f.field} ${error ? f.invalid : ""}`}>
      <label htmlFor={id} className={f.labelText}>
        {label}
        {required && <span className={f.req}> *</span>}
      </label>
      {help && (
        <span id={`${id}-help`} className={f.help}>
          {help}
        </span>
      )}
      {multiline ? <textarea rows={5} className={f.textarea} {...props} /> : <input type={type} className={f.input} {...props} />}
      {multiline && max && (
        <span className={f.counter}>
          {value.length} / {max} {t("caractères", "characters")}
        </span>
      )}
      {error && (
        <span id={`${id}-err`} className={f.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly Choice[];
  required?: boolean;
  error?: string;
}) {
  const id = useId();
  const locale = useLocale();
  const t = useT();
  return (
    <div className={`${f.field} ${error ? f.invalid : ""}`}>
      <label htmlFor={id} className={f.labelText}>
        {label}
        {required && <span className={f.req}> *</span>}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required} aria-invalid={!!error} className={f.select}>
        <option value="">{t("— Choisir —", "— Select —")}</option>
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {labelIn(o, locale)}
          </option>
        ))}
      </select>
      {error && (
        <span className={f.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  const name = useId();
  const t = useT();
  return (
    <fieldset className={`${f.fieldset} ${error ? f.invalid : ""}`}>
      <legend className={f.labelText}>
        {label}
        <span className={f.req}> *</span>
      </legend>
      <div className={f.choices}>
        {[true, false].map((v) => (
          <label key={String(v)} className={f.choice}>
            <input type="radio" name={name} checked={value === v} onChange={() => onChange(v)} />
            {v ? t("Oui", "Yes") : t("Non", "No")}
          </label>
        ))}
      </div>
      {error && (
        <span className={f.error} role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
}

function Check({
  label,
  value,
  onChange,
  required,
  error,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className={error ? f.invalid : undefined}>
      <label className={f.check} style={error ? { borderColor: "var(--color-ember)" } : undefined}>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error} />
        <span>
          {label}
          {required && <span className={f.req}> *</span>}
        </span>
      </label>
      {error && (
        <span className={f.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/* ---------- Pièces jointes ---------- */

/** Mode de téléversement fourni par le serveur selon le stockage connecté (null : liens uniquement). */
/** Envoi direct du fichier vers le stockage, avec suivi de la progression (non disponible avec fetch). */
function sendFile(url: string, file: File, contentType: string, onProgress: (ratio: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Envoi refusé (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Envoi interrompu"));
    xhr.send(file);
  });
}

function Pieces({
  pieces,
  onChange,
  uploadsEnabled,
  error,
}: {
  pieces: Piece[];
  onChange: (p: Piece[]) => void;
  uploadsEnabled: boolean;
  error?: string;
}) {
  const locale = useLocale();
  const t = useT();
  const [type, setType] = useState<PieceType>("demonstrateur");
  const [mode, setMode] = useState<"upload" | "lien">(uploadsEnabled ? "upload" : "lien");
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const total = pieces.reduce((n, p) => n + (p.taille ?? 0), 0);
  const uploading = progress !== null;
  const percent = Math.round((progress ?? 0) * 100);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMessage("");
    const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
    if (!pieceRules.extensions.includes(ext)) return setMessage(t("Format non accepté.", "File format not accepted."));
    if (file.size > pieceRules.maxFile) return setMessage(t("Fichier trop volumineux (25 Mo maximum).", "File too large (25 MB maximum)."));
    if (total + file.size > pieceRules.maxTotal) return setMessage(t("Le total des pièces dépasse 60 Mo.", "Total attachment size exceeds 60 MB."));
    setProgress(0);
    try {
      // Dossier aléatoire : chaque pièce a sa propre adresse, sans écraser celle d'un autre candidat
      const name = file.name.normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\w.-]+/g, "_").slice(-100);
      const { uploadUrl, url } = await api<{ uploadUrl: string; url: string }>("/api/public/candidature-files", {
        method: "POST",
        body: { pathname: `${crypto.randomUUID()}/${name}` },
      });
      await sendFile(uploadUrl, file, pieceRules.contentTypeOf[ext], setProgress);
      onChange([...pieces, { type, mode: "upload", url, nom: file.name, taille: file.size }]);
    } catch {
      setMessage(t("L'envoi du fichier a échoué. Vérifiez votre connexion ou utilisez un lien externe.", "The file upload failed. Check your connection or use an external link."));
    } finally {
      setProgress(null);
    }
  }

  function addLink() {
    if (!isUrl(link)) return setMessage(localize(messages.lienInvalide, locale));
    setMessage("");
    onChange([...pieces, { type, mode: "lien", url: link.trim() }]);
    setLink("");
  }

  return (
    <div className={s.pieces}>
      <p className={f.help}>
        {t(
          "Formats : PDF, PNG, JPG, MP4, ZIP — 25 Mo par fichier, 60 Mo au total. Pour les contenus volumineux ou une connexion lente, préférez un lien externe.",
          "Formats: PDF, PNG, JPG, MP4, ZIP — 25 MB per file, 60 MB in total. For large files or a slow connection, use an external link instead.",
        )}
      </p>
      {pieces.length > 0 && (
        <ul className={s.pieceList}>
          {pieces.map((p, i) => (
            <li key={i} className={s.piece}>
              <span className={s.badge}>{labelOf(pieceTypes, p.type, locale)}</span>
              <span className={s.pieceName}>{p.mode === "lien" ? p.url : `${p.nom} (${mo(p.taille ?? 0, t)})`}</span>
              <button type="button" className={s.linkBtn} onClick={() => onChange(pieces.filter((_, j) => j !== i))}>
                {t("Retirer", "Remove")}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={s.adder}>
        <div className={s.adderRow}>
          <select aria-label={t("Type de pièce", "Attachment type")} value={type} onChange={(e) => setType(e.target.value as PieceType)} className={f.select}>
            {pieceTypes.map((pt) => (
              <option key={pt.code} value={pt.code}>
                {labelIn(pt, locale)}
                {pt.required ? t(" (obligatoire)", " (required)") : ""}
              </option>
            ))}
          </select>
          <div className={f.choices} style={{ marginTop: 0 }}>
            {(["upload", "lien"] as const).map((m) => (
              <label key={m} className={f.choice} style={m === "upload" && !uploadsEnabled ? { opacity: 0.5 } : undefined}>
                <input
                  type="radio"
                  name="mode-piece"
                  checked={mode === m}
                  disabled={m === "upload" && !uploadsEnabled}
                  onChange={() => setMode(m)}
                />
                {m === "upload" ? t("Fichier", "File") : t("Lien", "Link")}
              </label>
            ))}
          </div>
        </div>
        {mode === "upload" ? (
          <label className={`btn btn-line ${uploading ? "opacity-70" : ""}`} style={{ justifySelf: "start", cursor: "pointer" }}>
            <Icon name="arrow-up-right" className="size-4" />
            {uploading ? t(`Téléversement… ${percent} %`, `Uploading… ${percent}%`) : t("Téléverser un fichier", "Upload a file")}
            <input type="file" className="sr-only" accept={pieceRules.extensions.join(",")} onChange={onFile} disabled={uploading} />
          </label>
        ) : (
          <div className={s.adderRow}>
            <input
              type="url"
              placeholder="https://"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              aria-label={t("Lien", "Link")}
              className={f.input}
            />
            <button type="button" className="btn btn-line" onClick={addLink}>
              {t("Ajouter le lien", "Add link")}
            </button>
          </div>
        )}
        {uploading && (
          <div className={s.progress} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className={s.progressFill} style={{ width: `${percent}%` }} />
          </div>
        )}
        {!uploadsEnabled && (
          <p className={f.help}>
            {t(
              "Le téléversement de fichiers n'est pas disponible pour le moment : ajoutez un lien (Google Drive, YouTube, GitHub…).",
              "File upload is not available at the moment. Add a link instead (Google Drive, YouTube, GitHub…).",
            )}
          </p>
        )}
        {(message || error) && (
          <span className={f.error} role="alert">
            {message || error}
          </span>
        )}
      </div>
      {!pieces.some((p) => p.type === "demonstrateur") && (
        <p className={`${f.alert} ${f.alertInfo}`}>
          {t(
            "Sans démonstrateur, votre dossier sera marqué « pièces manquantes » : vous aurez 72 h après la soumission pour le compléter.",
            "Without a demonstrator, your application will be marked “missing attachments”; you will have 72 hours after submission to complete it.",
          )}
        </p>
      )}
    </div>
  );
}

/* ---------- Récapitulatif ---------- */

function Recap({ d, goTo }: { d: Candidature; goTo: (i: number) => void }) {
  const locale = useLocale();
  const t = useT();
  const yn = (v: boolean | null) => (v ? t("Oui", "Yes") : t("Non", "No"));
  const p = d.porteur;
  const blocks: Record<string, [string, string][]> = {
    A: [
      [t("Nom", "Name"), `${p.prenom} ${p.nom}`],
      [t("Statut", "Status"), labelOf(statutsPorteur, p.statut, locale)],
      [t("Structure / organisation", "Organization"), p.structure],
      [t("Email", "Email"), p.email],
      [t("Téléphone", "Phone"), p.telephone],
      [t("Ville", "City"), `${p.ville}, ${p.pays}`],
      [t("Membres de l'équipe", "Team members"), p.equipe],
      [t("Structure organisatrice", "Affiliation with an organizing body"), yn(p.affiliationOrganisateur) + (p.affiliationPrecision ? ` — ${p.affiliationPrecision}` : "")],
    ],
    B: [
      [t("Titre du projet", "Project title"), d.projet.titre],
      [t("Domaine fonctionnel", "Functional domain"), labelOf(domaines, d.projet.domaine, locale)],
      [t("Catégorie", "Category"), labelOf(categories, d.projet.categorie, locale)],
      [t("Résumé du projet", "Project summary"), d.projet.resume],
      [t("Problème endogène adressé", "Endogenous problem addressed"), d.projet.problemeEndogene],
    ],
    C: [
      [t("Description technique", "Technical description"), d.technique.description],
      [t("Caractère innovant", "Innovativeness"), d.technique.caractereInnovant],
      ["TRL", d.technique.trl ? `TRL ${d.technique.trl} — ${trlLevels(locale)[d.technique.trl - 1]}` : ""],
      [t("Faisabilité", "Feasibility"), d.technique.faisabilite],
    ],
    D: [
      [t("Impact sociétal", "Societal impact"), d.impact.societal],
      [t("Impact économique", "Economic impact"), d.impact.economique],
      [t("Impact environnemental", "Environmental impact"), d.impact.environnemental],
      [t("Contribution au développement endogène", "Contribution to endogenous development"), d.impact.contributionEndogene],
    ],
    E: d.pieces.length
      ? d.pieces.map((pc) => [labelOf(pieceTypes, pc.type, locale), pc.mode === "lien" ? pc.url : pc.nom ?? ""])
      : [[t("Pièces jointes", "Attachments"), "—"]],
    F: [...declarations.obligatoires, ...declarations.optionnels].map((x) => [labelIn(x, locale), yn(d.declarations[x.code])]),
    G: [
      [t("Mode de présentation prévu", "Planned presentation mode"), labelOf(modes, d.presentation.modePrevu, locale)],
      [t("Besoins logistiques", "Logistics needs"), d.presentation.besoinsLogistiques],
      [t("Diaspora", "Diaspora"), yn(d.presentation.diaspora) + (d.presentation.paysResidence ? ` — ${d.presentation.paysResidence}` : "")],
    ],
  };
  return (
    <div className={s.recap}>
      {steps.map((id, i) => (
        <div key={id} className={s.recapBlock}>
          <div className={s.recapHead}>
            <h3 className={s.recapTitle}>
              {id}. {stepTitle(id, locale)}
            </h3>
            <button type="button" className={`${s.linkBtn} ${s.linkBtnGreen}`} onClick={() => goTo(i)}>
              {t("Modifier", "Edit")}
            </button>
          </div>
          <dl className={s.recapList}>
            {blocks[id].map(([k, v], j) => (
              <div key={j}>
                <dt>{k}</dt>
                <dd>{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/* ---------- Formulaire ---------- */

export function CandidatureForm({ uploadsEnabled }: { uploadsEnabled: boolean }) {
  const locale = useLocale();
  const t = useT();
  const [d, setD] = useState<Candidature>(emptyCandidature);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [online, setOnline] = useState(true);
  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const dirty = d !== emptyCandidature && !done;
  const isRecap = step === steps.length;
  const id = steps[step];
  const fixFields = t("Veuillez corriger les champs signalés.", "Please correct the highlighted fields.");

  // Avertit avant de quitter la page avec une saisie en cours
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, done]);

  const set =
    <K extends keyof Candidature>(section: K, key: keyof Candidature[K]) =>
    (value: unknown) => {
      setD((prev) => ({ ...prev, [section]: { ...(prev[section] as object), [key]: value } }));
      setErrors((e) => ({ ...e, [`${String(section)}.${String(key)}`]: "" }));
    };
  const err = (path: string) => errors[path] || undefined;

  function goTo(i: number) {
    setAlert("");
    setStep(i);
  }

  function next() {
    const e = validateStep(id, d, locale);
    setErrors(e);
    if (Object.keys(e).length) return setAlert(fixFields);
    goTo(step + 1);
  }

  async function submit() {
    for (let i = 0; i < steps.length; i++) {
      const e = validateStep(steps[i], d, locale);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(i);
        return setAlert(fixFields);
      }
    }
    setSending(true);
    setAlert("");
    try {
      const r = await api<Done>("/api/public/candidatures", { method: "POST", body: d });
      setDone(r);
      setD(emptyCandidature);
    } catch (e) {
      if (e instanceof ApiClientError && e.code === "VALIDATION_ERROR") {
        setErrors(e.fields);
        const first = Object.keys(e.fields)[0];
        if (first) setStep(steps.indexOf(stepOfPath(first)));
        setAlert(fixFields);
      } else if (e instanceof ApiClientError) {
        setAlert(e.message);
      } else {
        setAlert(t("Une erreur est survenue. Réessayez dans quelques instants.", "An error occurred. Please try again in a few moments."));
      }
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div ref={top} className={s.wrap}>
        <div className={s.done} role="status">
          <span className={s.doneIcon}>
            <Icon name="check" className="size-7" strokeWidth={2.4} />
          </span>
          <h2 ref={heading} tabIndex={-1} className={s.doneTitle}>
            {t("Candidature reçue", "Application received")}
          </h2>
          <dl className={s.doneTable}>
            <div>
              <dt>{t("Numéro de dossier", "Reference number")}</dt>
              <dd>{done.numero}</dd>
            </div>
            <div>
              <dt>{t("Date de soumission", "Submission date")}</dt>
              <dd>{done.date}</dd>
            </div>
          </dl>
          <p className={s.doneText}>
            {done.emailSent
              ? t(
                  `Un accusé de réception récapitulant votre dossier a été envoyé à ${done.email}.`,
                  `A confirmation email summarizing your application has been sent to ${done.email}.`,
                )
              : t(
                  "L'email de confirmation n'a pas pu être envoyé : notez bien votre numéro de dossier, il vous sera demandé pour tout échange avec le comité.",
                  "The confirmation email could not be sent. Please make a note of your reference number, as you will need it for any correspondence with the committee.",
                )}
          </p>
          {done.missingDemo && (
            <p className={`${f.alert} ${f.alertInfo} mt-4`}>
              {t(
                "Pièce manquante : démonstrateur. Vous avez 72 h pour l'envoyer en répondant à l'accusé de réception.",
                "Missing attachment: demonstrator. You have 72 hours to send it by replying to the confirmation email.",
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  const P = d.porteur;
  const body: Record<string, React.ReactNode> = {
    A: (
      <>
        <div className={f.grid2}>
          <Text label={t("Nom", "Last name")} value={P.nom} onChange={set("porteur", "nom")} required error={err("porteur.nom")} max={lengths.court} autoComplete="family-name" />
          <Text label={t("Prénom", "First name")} value={P.prenom} onChange={set("porteur", "prenom")} required error={err("porteur.prenom")} max={lengths.court} autoComplete="given-name" />
        </div>
        <Select label={t("Statut", "Status")} value={P.statut} onChange={set("porteur", "statut")} options={statutsPorteur} required error={err("porteur.statut")} />
        <div className={f.grid2}>
          <Text label={t("Structure / organisation", "Organization")} value={P.structure} onChange={set("porteur", "structure")} max={lengths.court} autoComplete="organization" />
          <Text label={t("Téléphone", "Phone")} type="tel" value={P.telephone} onChange={set("porteur", "telephone")} required error={err("porteur.telephone")} autoComplete="tel" />
        </div>
        <Text
          label={t("Email", "Email")}
          type="email"
          help={t("Votre accusé de réception sera envoyé à cette adresse.", "Your confirmation email will be sent to this address.")}
          value={P.email}
          onChange={set("porteur", "email")}
          required
          error={err("porteur.email")}
          autoComplete="email"
        />
        <div className={f.grid2}>
          <Text label={t("Pays", "Country")} value={P.pays} onChange={set("porteur", "pays")} required error={err("porteur.pays")} autoComplete="country-name" />
          <Text label={t("Ville", "City")} value={P.ville} onChange={set("porteur", "ville")} required error={err("porteur.ville")} autoComplete="address-level2" />
        </div>
        <Text
          label={t("Membres de l'équipe (si candidature en équipe)", "Team members (if applying as a team)")}
          value={P.equipe}
          onChange={set("porteur", "equipe")}
          multiline
          max={lengths.long}
        />
        <YesNo
          label={localize(affiliationLabel, locale)}
          value={P.affiliationOrganisateur}
          onChange={set("porteur", "affiliationOrganisateur")}
          error={err("porteur.affiliationOrganisateur")}
        />
        {P.affiliationOrganisateur && (
          <Text
            label={t("Précisez la structure et la nature du lien", "Specify the organization and the nature of your affiliation")}
            value={P.affiliationPrecision}
            onChange={set("porteur", "affiliationPrecision")}
            required
            error={err("porteur.affiliationPrecision")}
            max={lengths.court}
          />
        )}
      </>
    ),
    B: (
      <>
        <Text label={t("Titre du projet", "Project title")} value={d.projet.titre} onChange={set("projet", "titre")} required error={err("projet.titre")} max={lengths.court} />
        <div className={f.grid2}>
          <Select
            label={t("Domaine fonctionnel", "Functional domain")}
            value={d.projet.domaine}
            onChange={set("projet", "domaine")}
            options={domaines}
            required
            error={err("projet.domaine")}
          />
          <Select label={t("Catégorie", "Category")} value={d.projet.categorie} onChange={set("projet", "categorie")} options={categories} required error={err("projet.categorie")} />
        </div>
        <Text
          label={t("Résumé du projet", "Project summary")}
          value={d.projet.resume}
          onChange={set("projet", "resume")}
          required
          error={err("projet.resume")}
          multiline
          max={lengths.resume}
        />
        <Text
          label={t("Problème endogène adressé", "Endogenous problem addressed")}
          help={t("Quel besoin local du Burkina Faso le projet résout-il ?", "What local need in Burkina Faso does the project address?")}
          value={d.projet.problemeEndogene}
          onChange={set("projet", "problemeEndogene")}
          required
          error={err("projet.problemeEndogene")}
          multiline
          max={lengths.long}
        />
      </>
    ),
    C: (
      <>
        <Text
          label={t("Description technique", "Technical description")}
          value={d.technique.description}
          onChange={set("technique", "description")}
          required
          error={err("technique.description")}
          multiline
          max={lengths.long}
        />
        <Text
          label={t("Caractère innovant", "Innovativeness")}
          value={d.technique.caractereInnovant}
          onChange={set("technique", "caractereInnovant")}
          required
          error={err("technique.caractereInnovant")}
          multiline
          max={lengths.long}
        />
        <fieldset className={`${f.fieldset} ${err("technique.trl") ? f.invalid : ""}`}>
          <legend className={f.labelText}>
            {t("Niveau de maturité technologique (TRL)", "Technology readiness level (TRL)")}
            <span className={f.req}> *</span>
          </legend>
          <span className={f.help}>{t("Votre estimation ; l'évaluateur porte son propre jugement.", "This is your estimate; the evaluator will make their own assessment.")}</span>
          <div className={s.trl}>
            {trlLevels(locale).map((label, i) => (
              <label key={label} className={s.trlItem}>
                <input type="radio" name="trl" checked={d.technique.trl === i + 1} onChange={() => set("technique", "trl")(i + 1)} />
                <strong>TRL {i + 1}</strong>
                <span>{label}</span>
              </label>
            ))}
          </div>
          {err("technique.trl") && (
            <span className={f.error} role="alert">
              {err("technique.trl")}
            </span>
          )}
        </fieldset>
        <Text
          label={t("Faisabilité (ressources, calendrier, risques)", "Feasibility (resources, timeline, risks)")}
          value={d.technique.faisabilite}
          onChange={set("technique", "faisabilite")}
          required
          error={err("technique.faisabilite")}
          multiline
          max={lengths.long}
        />
      </>
    ),
    D: (
      <>
        <Text
          label={t("Impact sociétal", "Societal impact")}
          help={t("Bénéficiaires, ampleur, pertinence locale.", "Beneficiaries, scale, local relevance.")}
          value={d.impact.societal}
          onChange={set("impact", "societal")}
          required
          error={err("impact.societal")}
          multiline
          max={lengths.long}
        />
        <Text
          label={t("Impact économique", "Economic impact")}
          help={t("Création de valeur, viabilité, emplois.", "Value creation, viability, jobs.")}
          value={d.impact.economique}
          onChange={set("impact", "economique")}
          required
          error={err("impact.economique")}
          multiline
          max={lengths.long}
        />
        <Text
          label={t("Impact environnemental", "Environmental impact")}
          value={d.impact.environnemental}
          onChange={set("impact", "environnemental")}
          required
          error={err("impact.environnemental")}
          multiline
          max={lengths.long}
        />
        <Text
          label={t("Contribution au développement endogène", "Contribution to endogenous development")}
          value={d.impact.contributionEndogene}
          onChange={set("impact", "contributionEndogene")}
          required
          error={err("impact.contributionEndogene")}
          multiline
          max={lengths.long}
        />
      </>
    ),
    E: (
      <Pieces
        pieces={d.pieces}
        onChange={(p) => setD((prev) => ({ ...prev, pieces: p }))}
        uploadsEnabled={uploadsEnabled}
        error={Object.entries(errors).find(([k, v]) => k.startsWith("pieces.") && v)?.[1]}
      />
    ),
    F: (
      <>
        <p className={s.subTitle}>{t("Déclarations obligatoires", "Required declarations")}</p>
        {declarations.obligatoires.map((x) => (
          <Check
            key={x.code}
            label={labelIn(x, locale)}
            value={d.declarations[x.code]}
            onChange={set("declarations", x.code)}
            required
            error={err(`declarations.${x.code}`)}
          />
        ))}
        <p className={s.subTitle}>{t("Consentements optionnels", "Optional consent")}</p>
        {declarations.optionnels.map((x) => (
          <Check key={x.code} label={labelIn(x, locale)} value={d.declarations[x.code]} onChange={set("declarations", x.code)} />
        ))}
      </>
    ),
    G: (
      <>
        <Select
          label={t("Mode de présentation prévu", "Planned presentation mode")}
          value={d.presentation.modePrevu}
          onChange={set("presentation", "modePrevu")}
          options={modes}
          required
          error={err("presentation.modePrevu")}
        />
        <Text
          label={t("Besoins logistiques", "Logistics needs")}
          value={d.presentation.besoinsLogistiques}
          onChange={set("presentation", "besoinsLogistiques")}
          multiline
          max={lengths.long}
        />
        <Check label={t("Je fais partie de la diaspora", "I am a member of the diaspora")} value={d.presentation.diaspora} onChange={set("presentation", "diaspora")} />
        {d.presentation.diaspora && (
          <Text
            label={t("Pays de résidence", "Country of residence")}
            value={d.presentation.paysResidence}
            onChange={set("presentation", "paysResidence")}
            max={lengths.pays}
          />
        )}
      </>
    ),
  };

  const total = steps.length + 1;
  return (
    <div ref={top} className={s.wrap}>
      <div className={s.card}>
        <ol className={s.steps} aria-label={t("Étape", "Steps")}>
          {[...steps, "recap"].map((x, i) => (
            <li
              key={x}
              className={`${s.step} ${i === step ? s.stepActive : i < step ? s.stepDone : ""}`}
              aria-current={i === step ? "step" : undefined}
            >
              {x === "recap" ? "✓" : x}
            </li>
          ))}
        </ol>
        <div className={s.bar} aria-hidden="true">
          <div className={s.barFill} style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <p className={s.stepInfo}>{t(`Étape ${step + 1} sur ${total}`, `Step ${step + 1} of ${total}`)}</p>
        <h2 ref={heading} tabIndex={-1} className={s.stepTitle}>
          {isRecap ? t("Récapitulatif", "Summary") : `${id}. ${stepTitle(id, locale)}`}
        </h2>

        <div key={step} className={s.body}>
          {step === 0 && (
            <p className={`${f.alert} ${f.alertInfo}`}>
              {t(
                "Votre saisie n'est pas enregistrée : ne fermez pas cet onglet avant d'avoir soumis votre candidature.",
                "Your answers are not saved, so do not close this tab until you have submitted your application.",
              )}
            </p>
          )}
          {alert && (
            <p className={`${f.alert} ${f.alertError}`} role="alert">
              {alert}
            </p>
          )}
          {!online && (
            <p className={`${f.alert} ${f.alertError}`} role="status">
              {t(
                "Vous êtes hors ligne. L'envoi de votre candidature et des pièces nécessite une connexion.",
                "You are offline. Submitting your application and attachments requires an internet connection.",
              )}
            </p>
          )}
          {isRecap ? <Recap d={d} goTo={goTo} /> : body[id]}
        </div>

        <div className={s.nav}>
          {step > 0 ? (
            <button type="button" className="btn btn-line" onClick={() => goTo(step - 1)} disabled={sending}>
              {t("Précédent", "Back")}
            </button>
          ) : (
            <span />
          )}
          {isRecap ? (
            <button type="button" className="btn btn-primary disabled:opacity-60" onClick={submit} disabled={sending || !online}>
              {sending ? t("Envoi en cours…", "Sending…") : t("Soumettre ma candidature", "Submit my application")}
              {!sending && <Icon name="arrow" className="size-4" />}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={next}>
              {t("Suivant", "Next")}
              <Icon name="arrow" className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
