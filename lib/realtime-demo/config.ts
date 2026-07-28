/**
 * Public configuration for the in-browser Macky voice demo.
 *
 * Everything here is public by design. The Turnstile *site* key and the Worker
 * base URL are meant to ship in the client bundle; the Turnstile *secret* and the
 * Azure key live only in the Cloudflare Worker. The browser only ever holds a
 * short-lived, single-use demo token minted by the Worker.
 */

/** Base URL of the realtime-proxy Worker (no trailing slash). */
export const DEMO_WORKER_BASE = (
  process.env.NEXT_PUBLIC_DEMO_WORKER_BASE ??
  "https://realtime-proxy.speedmac.workers.dev"
).replace(/\/$/, "");

/**
 * Cloudflare Turnstile site key. The `1x…AA` value is Cloudflare's official
 * "always passes" test key — fine for local dev, but the real key must be set via
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY before the demo works against the deployed Worker
 * (which verifies against the matching secret).
 */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

/** POST endpoint that verifies Turnstile and mints a single-use demo token. */
export const DEMO_TOKEN_URL = `${DEMO_WORKER_BASE}/demo/token`;

/**
 * WebSocket URL for the gated realtime proxy. The `https`/`http` base is rewritten
 * to `wss`/`ws`; the single-use token rides as a query param.
 */
export function demoRealtimeUrl(token: string): string {
  const wsBase = DEMO_WORKER_BASE.replace(/^http/, "ws");
  return `${wsBase}/demo/realtime?token=${encodeURIComponent(token)}`;
}

/** Audio sample rate for the realtime protocol, both directions (Hz). */
export const DEMO_SAMPLE_RATE = 24_000;

/**
 * RMS gate below which a captured utterance is treated as silence and never
 * committed (≈ −42 dBFS). Matches the Mac app so an untouched mic never triggers
 * a response.
 */
export const DEMO_RMS_GATE = 0.008;
