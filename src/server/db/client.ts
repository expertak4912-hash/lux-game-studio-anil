/**
 * MongoDB connection.
 *
 * SERVER ONLY. This module must never be imported from a route file or from the top level of a
 * `*.functions.ts` module — those are bundled for the browser and the connection string would
 * leak. Import it lazily inside a server handler instead:
 *
 *     const { getDb } = await import("@/server/db/client");
 *
 * The client is cached at module scope. Node keeps the module alive between requests, and
 * serverless platforms reuse warm instances, so a single pooled connection is shared rather than
 * reconnecting per request (which would exhaust Atlas connection limits under load).
 */
import { MongoClient, type Db } from "mongodb";

let clientPromise: Promise<MongoClient> | undefined;
let dbName: string | undefined;

function readConfig(): { uri: string; database: string } {
  const uri = process.env["MONGODB_URI"];
  const database = process.env["MONGODB_DATABASE"];

  const missing = [...(!uri ? ["MONGODB_URI"] : []), ...(!database ? ["MONGODB_DATABASE"] : [])];
  if (missing.length > 0) {
    const message =
      `Missing environment variable(s): ${missing.join(", ")}. ` +
      `Copy .env.example to .env and fill in your MongoDB connection details.`;
    console.error(`[db] ${message}`);
    throw new Error(message);
  }

  return { uri: uri!, database: database! };
}

/** Connects on first call, then reuses the pooled client for the process lifetime. */
export function getClient(): Promise<MongoClient> {
  if (!clientPromise) {
    const { uri, database } = readConfig();
    dbName = database;

    const client = new MongoClient(uri, {
      // Keep the pool small: serverless platforms run many short-lived instances, and Atlas
      // shared tiers cap total connections across all of them.
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10_000,
      retryWrites: true,
    });

    clientPromise = client.connect().catch((error: unknown) => {
      // Reset so the next request retries instead of reusing a permanently rejected promise.
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(dbName ?? readConfig().database);
}

/** Closes the pool. Used by scripts (seed) so the process can exit; not used by the server. */
export async function closeClient(): Promise<void> {
  if (!clientPromise) return;
  const client = await clientPromise;
  clientPromise = undefined;
  await client.close();
}
