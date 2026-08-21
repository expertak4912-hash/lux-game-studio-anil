/**
 * Password hashing.
 *
 * Uses scrypt from Node's built-in `crypto`. bcrypt and argon2 are both native addons that need a
 * node-gyp toolchain, which breaks on Windows dev machines and on slim deploy images alike.
 * scrypt is memory-hard, in the standard library, and available on every target this app deploys
 * to, so it needs no build step anywhere.
 *
 * Stored format:  scrypt$<N>$<r>$<p>$<salt-b64>$<hash-b64>
 * The parameters live in the string so existing hashes stay verifiable if the cost is raised.
 *
 * SERVER ONLY.
 */
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

// OWASP-recommended baseline for scrypt (N=2^17, r=8, p=1).
const PARAMS = { N: 131_072, r: 8, p: 1 };
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
// scrypt needs roughly 128 * N * r bytes; Node's default maxmem (32 MB) is too small for N=2^17.
const MAX_MEM = 256 * 1024 * 1024;

export const MIN_PASSWORD_LENGTH = 8;

export async function hashPassword(password: string): Promise<string> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, {
    ...PARAMS,
    maxmem: MAX_MEM,
  });

  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

/**
 * Constant-time verification. Returns false rather than throwing on a malformed stored hash, so a
 * corrupted record reads as "wrong password" instead of leaking a distinguishable error.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;

    const [, nRaw, rRaw, pRaw, saltB64, hashB64] = parts;
    const N = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);
    if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

    const salt = Buffer.from(saltB64!, "base64");
    const expected = Buffer.from(hashB64!, "base64");
    if (expected.length === 0) return false;

    const actual = await scrypt(password.normalize("NFKC"), salt, expected.length, {
      N,
      r,
      p,
      maxmem: MAX_MEM,
    });

    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
