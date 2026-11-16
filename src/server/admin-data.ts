import "server-only";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { db, schema } from "./db/client";
import { errors } from "./http";

/** Données du back-office : listes paginées avec recherche, statistiques. */

export type Page<T> = { items: T[]; total: number; page: number; pageSize: number };
type ListOpts = { page: number; pageSize: number; q?: string };

const escapeLike = (q: string) => `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

function search(q: string | undefined, columns: PgColumn[]): SQL | undefined {
  const term = q?.trim().slice(0, 100);
  if (!term) return undefined;
  return or(...columns.map((c) => ilike(c, escapeLike(term))));
}

export async function listRegistrations({ page, pageSize, q }: ListOpts) {
  const where = search(q, [schema.registrations.name, schema.registrations.email, schema.registrations.organization]);
  const [items, [{ n }]] = await Promise.all([
    db.select().from(schema.registrations).where(where).orderBy(desc(schema.registrations.id)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ n: count() }).from(schema.registrations).where(where),
  ]);
  return { items, total: n, page, pageSize };
}

export async function listMessages({ page, pageSize, q }: ListOpts) {
  const where = search(q, [schema.messages.name, schema.messages.email, schema.messages.subject]);
  const [items, [{ n }]] = await Promise.all([
    db.select().from(schema.messages).where(where).orderBy(desc(schema.messages.id)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ n: count() }).from(schema.messages).where(where),
  ]);
  return { items, total: n, page, pageSize };
}

export const CANDIDATURE_STATUSES = ["recu", "pieces_manquantes", "en_evaluation", "retenu", "non_retenu"] as const;
export type CandidatureStatus = (typeof CANDIDATURE_STATUSES)[number];

export async function listCandidatures({ page, pageSize, q, status }: ListOpts & { status?: CandidatureStatus }) {
  const where = and(
    search(q, [schema.candidatures.numero, schema.candidatures.title, schema.candidatures.applicantName, schema.candidatures.email]),
    status ? eq(schema.candidatures.status, status) : undefined,
  );
  const columns = {
    id: schema.candidatures.id,
    numero: schema.candidatures.numero,
    status: schema.candidatures.status,
    title: schema.candidatures.title,
    applicantName: schema.candidatures.applicantName,
    email: schema.candidatures.email,
    category: schema.candidatures.category,
    createdAt: schema.candidatures.createdAt,
  };
  const [items, [{ n }]] = await Promise.all([
    db.select(columns).from(schema.candidatures).where(where).orderBy(desc(schema.candidatures.id)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ n: count() }).from(schema.candidatures).where(where),
  ]);
  return { items, total: n, page, pageSize };
}

export async function getCandidature(id: number) {
  const [row] = await db.select().from(schema.candidatures).where(eq(schema.candidatures.id, id)).limit(1);
  if (!row) throw errors.notFound("Candidature introuvable.");
  return row;
}

export async function listUsers() {
  return db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      disabled: schema.users.disabled,
      lastLoginAt: schema.users.lastLoginAt,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .orderBy(schema.users.id);
}

export async function listAudit({ page, pageSize, q }: ListOpts) {
  const where = q ? or(ilike(schema.auditLog.userEmail, escapeLike(q)), ilike(schema.auditLog.entity, escapeLike(q))) : undefined;
  const [items, [{ n }]] = await Promise.all([
    db.select().from(schema.auditLog).where(where).orderBy(desc(schema.auditLog.id)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ n: count() }).from(schema.auditLog).where(where),
  ]);
  return { items, total: n, page, pageSize };
}

export async function getStats() {
  const [[reg], [msg], [unread], [cand], [media]] = await Promise.all([
    db.select({ n: count() }).from(schema.registrations),
    db.select({ n: count() }).from(schema.messages),
    db.select({ n: count() }).from(schema.messages).where(eq(schema.messages.read, false)),
    db.select({ n: count() }).from(schema.candidatures),
    db.select({ n: count() }).from(schema.media),
  ]);
  const byStatus = await db
    .select({ status: schema.candidatures.status, n: count() })
    .from(schema.candidatures)
    .groupBy(schema.candidatures.status);
  return {
    registrations: reg.n,
    messages: msg.n,
    unreadMessages: unread.n,
    candidatures: cand.n,
    media: media.n,
    candidaturesByStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.n])) as Partial<Record<CandidatureStatus, number>>,
  };
}
