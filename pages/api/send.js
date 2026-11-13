import { validateContactPayload } from "../../lib/contact-schema";
import { createRateLimiter, getClientIp } from "../../lib/rate-limit";
import { saveContactRequest } from "../../lib/contact-store";

// The handler owns body parsing so malformed JSON and oversized payloads fail
// closed with generic responses instead of framework error pages.
export const config = {
  api: {
    bodyParser: false,
  },
};

function readInteger(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.min(Math.max(parsed, minimum), maximum);
}

const BODY_LIMIT_BYTES = readInteger(
  process.env.CONTACT_BODY_LIMIT_BYTES,
  16 * 1024,
  1024,
  64 * 1024,
);

const RATE_LIMIT_MAX = readInteger(
  process.env.CONTACT_RATE_LIMIT_MAX,
  5,
  1,
  1000,
);

const RATE_LIMIT_WINDOW_MS = readInteger(
  process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
  60_000,
  1000,
  3_600_000,
);

const GLOBAL_RATE_LIMIT_MAX = readInteger(
  process.env.CONTACT_GLOBAL_RATE_LIMIT_MAX,
  60,
  1,
  10_000,
);

const GLOBAL_RATE_LIMIT_WINDOW_MS = readInteger(
  process.env.CONTACT_GLOBAL_RATE_LIMIT_WINDOW_MS,
  60_000,
  1000,
  3_600_000,
);

const rateLimiter = createRateLimiter({
  limit: RATE_LIMIT_MAX,
  windowMs: RATE_LIMIT_WINDOW_MS,
});

// Broader cap shared by all clients. This protects a single instance from
// distributed abuse even when each individual IP stays under its own budget.
const globalRateLimiter = createRateLimiter({
  limit: GLOBAL_RATE_LIMIT_MAX,
  windowMs: GLOBAL_RATE_LIMIT_WINDOW_MS,
});

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [name, value] of Object.entries(extraHeaders)) {
    response.setHeader(name, value);
  }
  response.end(JSON.stringify(payload));
}

function getConfiguredOrigins(request) {
  const configured = (process.env.CONTACT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured.length > 0) {
    return configured;
  }

  const host = request.headers["x-forwarded-host"] || request.headers.host;
  if (!host) return [];

  const protocol = (request.headers["x-forwarded-proto"] || "http")
    .split(",")[0]
    .trim();

  return [`${protocol}://${host}`, `http://${host}`, `https://${host}`];
}

function isCrossSiteRequest(request) {
  if (request.headers["sec-fetch-site"] === "cross-site") {
    return true;
  }

  const origin = request.headers.origin;
  if (typeof origin !== "string" || origin.length === 0) {
    // Non-browser clients omit Origin; they still pass method, validation and
    // rate-limit checks.
    return false;
  }

  return !getConfiguredOrigins(request).includes(origin);
}

function hasJsonContentType(request) {
  const contentType = request.headers["content-type"];
  if (typeof contentType !== "string") return false;
  return contentType.split(";")[0].trim().toLowerCase() === "application/json";
}

function readJsonBody(request, limitBytes) {
  return new Promise((resolve) => {
    const contentLength = Number.parseInt(
      request.headers["content-length"],
      10,
    );
    if (Number.isInteger(contentLength) && contentLength > limitBytes) {
      resolve({ ok: false, reason: "too_large" });
      return;
    }

    const chunks = [];
    let size = 0;
    let exceeded = false;

    request.on("data", (chunk) => {
      if (exceeded) return;
      size += chunk.length;
      if (size > limitBytes) {
        exceeded = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      if (exceeded) {
        resolve({ ok: false, reason: "too_large" });
        return;
      }

      const raw = Buffer.concat(chunks).toString("utf8");
      if (raw.trim().length === 0) {
        resolve({ ok: false, reason: "empty" });
        return;
      }

      try {
        resolve({ ok: true, value: JSON.parse(raw) });
      } catch {
        resolve({ ok: false, reason: "malformed" });
      }
    });

    request.on("error", () => {
      resolve({ ok: false, reason: "read_error" });
    });
  });
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    sendJson(
      response,
      405,
      { ok: false, error: "method_not_allowed" },
      { Allow: "POST" },
    );
    return;
  }

  if (!hasJsonContentType(request)) {
    sendJson(response, 415, { ok: false, error: "unsupported_media_type" });
    return;
  }

  if (isCrossSiteRequest(request)) {
    sendJson(response, 403, { ok: false, error: "forbidden" });
    return;
  }

  const rateLimit = rateLimiter.check(getClientIp(request));
  if (!rateLimit.allowed) {
    sendJson(
      response,
      429,
      { ok: false, error: "rate_limited" },
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
    return;
  }

  const globalRateLimit = globalRateLimiter.check("global");
  if (!globalRateLimit.allowed) {
    sendJson(
      response,
      429,
      { ok: false, error: "rate_limited" },
      { "Retry-After": String(globalRateLimit.retryAfterSeconds) },
    );
    return;
  }

  const body = await readJsonBody(request, BODY_LIMIT_BYTES);

  if (!body.ok) {
    if (body.reason === "too_large") {
      sendJson(response, 413, { ok: false, error: "payload_too_large" });
      return;
    }
    sendJson(response, 400, { ok: false, error: "invalid_request" });
    return;
  }

  const validation = validateContactPayload(body.value);
  if (!validation.ok) {
    sendJson(response, 400, { ok: false, error: "invalid_request" });
    return;
  }

  try {
    await saveContactRequest(validation.value);
  } catch (error) {
    // Deliberately no message content, addresses, or credentials in logs.
    // Configuration errors only contain environment variable names.
    if (error?.name === "ContactStoreConfigurationError") {
      console.error(`[contact] store configuration error: ${error.message}`);
    } else {
      console.error("[contact] store request failed", {
        name: error?.name,
        provider: error?.provider,
        code: error?.code,
        command: error?.command,
        responseCode: error?.responseCode,
      });
    }
    sendJson(response, 503, { ok: false, error: "unavailable" });
    return;
  }

  sendJson(response, 200, { ok: true });
}
