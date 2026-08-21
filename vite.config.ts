// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The wrapper defaults to Nitro's `cloudflare-module` preset. Cloudflare Workers is a V8-isolate
// runtime with no raw TCP, so the MongoDB driver cannot run there. We build a plain Node server
// instead, which runs unchanged on a VPS, Docker, Railway, Render, AWS and Vercel.
//
//   local / VPS / Docker / Railway / Render → node-server  (node .output/server/index.mjs)
//   Vercel                                  → NITRO_PRESET=vercel
//
// Nothing in the application code is host-specific; only this preset changes.
const preset = process.env["NITRO_PRESET"] ?? "node-server";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper,
    // which also serves the /api/media/* routes). nitro/vite builds from this.
    server: { entry: "server" },
  },
  nitro: { preset },

  vite: {
    ssr: {
      // Keep the MongoDB driver out of the SSR bundle so Rollup never tries to resolve the
      // optional native add-ons it lazily requires (kerberos, snappy, mongodb-client-encryption).
      // Nitro still traces it into the server output.
      external: ["mongodb"],
    },
  },
});
