import { sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

/*
 * Tables PostgreSQL (Supabase). La sécurité par ligne (RLS) est activée partout, sans aucune
 * règle d'accès : l'API de données de Supabase, ouverte sur le schéma public, n'y donne accès
 * à rien. Seul le serveur du site, propriétaire des tables, les lit et les écrit.
 */

/** Horodatage ISO 8601 (UTC), gardé en texte : même format que `toISOString()`, donc comparable tel quel. */
export const nowIso = sql`to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;

const createdAt = () => text("created_at").notNull().default(nowIso);

const updatedAt = () => text("updated_at").notNull().default(nowIso);

const id = () => integer("id").primaryKey().generatedByDefaultAsIdentity();

/* ---------- Comptes et sessions ---------- */

export const users = pgTable(
  "users",
  {
    id: id(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["admin", "editor"] }).notNull().default("editor"),
    disabled: boolean("disabled").notNull().default(false),
    lastLoginAt: text("last_login_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
).enableRLS();

/** Sessions : seul le hachage SHA-256 du jeton est stocké. */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: text("expires_at").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId), index("sessions_expires_idx").on(t.expiresAt)],
).enableRLS();

/** Compteur de requêtes pour la limitation de débit (connexion, formulaires publics). */
export const rateLimits = pgTable(
  "rate_limits",
  {
    id: id(),
    bucket: text("bucket").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("rate_limits_bucket_idx").on(t.bucket, t.createdAt)],
).enableRLS();

export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    userEmail: text("user_email"),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    createdAt: createdAt(),
  },
  (t) => [index("audit_created_idx").on(t.createdAt)],
).enableRLS();

/* ---------- Contenus ---------- */

/** Blocs uniques (paramètres, sections de l'accueil), stockés en JSON validé par zod. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: updatedAt(),
}).enableRLS();

/** Éléments des collections (patronage, programme, partenaires…), données en JSON validé par zod. */
export const items = pgTable(
  "items",
  {
    id: id(),
    collection: text("collection").notNull(),
    position: integer("position").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    data: jsonb("data").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("items_collection_idx").on(t.collection, t.position)],
).enableRLS();

/** Corrections de contenu déjà appliquées à cette base (scripts/content-migrations.ts), une seule fois chacune. */
export const contentMigrations = pgTable("content_migrations", {
  id: text("id").primaryKey(),
  appliedAt: createdAt(),
}).enableRLS();

/* ---------- Mesure d'audience (sans cookie) ---------- */

/**
 * Pages vues : aucune adresse IP n'est stockée. `visitor` est un hachage de
 * l'adresse IP, du navigateur et du sel du jour : il compte les visiteurs
 * uniques d'une journée sans permettre de les reconnaître le lendemain.
 */
export const pageViews = pgTable(
  "page_views",
  {
    id: id(),
    day: text("day").notNull(),
    path: text("path").notNull(),
    locale: text("locale").notNull(),
    visitor: text("visitor").notNull(),
    referrer: text("referrer").notNull().default(""),
    /** Première page de la visite : la seule qui porte le site d'origine */
    entry: boolean("entry").notNull().default(false),
    device: text("device").notNull(),
    country: text("country").notNull().default(""),
    createdAt: createdAt(),
  },
  (t) => [index("page_views_day_idx").on(t.day, t.visitor)],
).enableRLS();

/** Sel quotidien de l'identifiant de visiteur, supprimé le lendemain. */
export const analyticsSalts = pgTable("analytics_salts", {
  day: text("day").primaryKey(),
  salt: text("salt").notNull(),
}).enableRLS();

export const media = pgTable("media", {
  id: id(),
  url: text("url").notNull(),
  storageKey: text("storage_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  alt: text("alt").notNull().default(""),
  uploadedBy: integer("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}).enableRLS();

/* ---------- Formulaires publics ---------- */

export const registrations = pgTable(
  "registrations",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    organization: text("organization").notNull().default(""),
    type: text("type").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("registrations_created_idx").on(t.createdAt)],
).enableRLS();

export const messages = pgTable(
  "messages",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("messages_created_idx").on(t.createdAt)],
).enableRLS();

export const candidatures = pgTable(
  "candidatures",
  {
    id: id(),
    numero: text("numero").notNull(),
    status: text("status", { enum: ["recu", "pieces_manquantes", "en_evaluation", "retenu", "non_retenu"] })
      .notNull()
      .default("recu"),
    title: text("title").notNull(),
    applicantName: text("applicant_name").notNull(),
    email: text("email").notNull(),
    category: text("category").notNull(),
    data: jsonb("data").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("candidatures_numero_unique").on(t.numero), index("candidatures_created_idx").on(t.createdAt)],
).enableRLS();

export type User = typeof users.$inferSelect;
export type Role = User["role"];
