/**
 * User records — replaces Supabase `auth.users` plus the `user_roles` join table.
 *
 * SERVER ONLY. `password_hash` must never leave this module; use `toPublicUser` for anything
 * that crosses to the client.
 */
import type { Document } from "mongodb";
import { collectionFor } from "@/server/db/collections";
import { toId, type Row } from "@/server/db/serialize";
import { hashPassword } from "./password";
import type { PublicUser, UserRole } from "@/shared/types";

type UserDoc = Document & {
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date | null;
};

async function users() {
  return collectionFor<UserDoc>("users");
}

/** Emails are stored lowercase so lookups and the unique index are case-insensitive. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function toPublicUser(doc: (Row & { _id?: unknown }) | null): PublicUser | null {
  if (!doc) return null;
  return {
    id: String(doc["_id"]),
    email: String(doc["email"]),
    role: doc["role"] === "admin" ? "admin" : "editor",
  };
}

export async function findUserByEmail(email: string) {
  const collection = await users();
  return collection.findOne({ email: normalizeEmail(email) });
}

export async function findUserById(id: string) {
  const collection = await users();
  try {
    return await collection.findOne({ _id: toId(id) as never });
  } catch {
    return null;
  }
}

/** Number of accounts holding the admin role. Gates the first-run setup flow. */
export async function countAdmins(): Promise<number> {
  const collection = await users();
  return collection.countDocuments({ role: "admin" });
}

export async function createUser(
  email: string,
  password: string,
  role: UserRole,
): Promise<PublicUser> {
  const collection = await users();
  const now = new Date();

  const result = await collection.insertOne({
    email: normalizeEmail(email),
    password_hash: await hashPassword(password),
    role,
    created_at: now,
    updated_at: now,
    last_login_at: null,
  } as never);

  return { id: result.insertedId.toString(), email: normalizeEmail(email), role };
}

export async function recordLogin(id: string): Promise<void> {
  const collection = await users();
  await collection.updateOne({ _id: toId(id) as never }, { $set: { last_login_at: new Date() } });
}

export async function setPassword(id: string, password: string): Promise<void> {
  const collection = await users();
  await collection.updateOne(
    { _id: toId(id) as never },
    { $set: { password_hash: await hashPassword(password), updated_at: new Date() } },
  );
}
