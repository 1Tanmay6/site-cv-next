export const CONTACT_LIMITS = Object.freeze({
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
});

export const SERVICE_IDS = Object.freeze([
  "genai",
  "datascience",
  "synthetic-data",
  "branding",
  "design",
  "website",
  "copywriting",
  "application",
]);

const ALLOWED_FIELDS = new Set(["name", "email", "subject", "message", "id"]);

// Control characters that must never reach a mail header or body writer.
const FORBIDDEN_CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const charLength = (value) => Array.from(value).length;

function hasNewline(value) {
  return value.includes("\n") || value.includes("\r");
}

function hasControlCharacters(value) {
  return FORBIDDEN_CONTROL_CHARACTERS.test(value);
}

function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

/**
 * Normalizes the optional service identifier. Links from the services page use
 * a small allowlist; anything else is rejected rather than forwarded to mail.
 */
export function normalizeServiceId(value) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === -1 ||
    value === "-1"
  ) {
    return { ok: true, value: "not-from-service" };
  }

  if (typeof value !== "string") {
    return { ok: false };
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "-1") {
    return { ok: true, value: "not-from-service" };
  }

  if (!SERVICE_IDS.includes(normalized)) {
    return { ok: false };
  }

  return { ok: true, value: normalized };
}

/**
 * Validates and normalizes a contact request payload.
 * Returns { ok: true, value } or { ok: false, reason } where reason is safe to
 * expose to the server-side caller but never returned to clients verbatim.
 */
export function validateContactPayload(body) {
  if (!isPlainObject(body)) {
    return { ok: false, reason: "body" };
  }

  for (const key of Object.keys(body)) {
    if (!ALLOWED_FIELDS.has(key)) {
      return { ok: false, reason: "unexpected_field" };
    }
  }

  const { name, email, subject, message } = body;

  if (typeof name !== "string") return { ok: false, reason: "name" };
  if (typeof email !== "string") return { ok: false, reason: "email" };
  if (typeof subject !== "string") return { ok: false, reason: "subject" };
  if (typeof message !== "string") return { ok: false, reason: "message" };

  const normalizedName = name.trim();
  if (
    charLength(normalizedName) < 1 ||
    charLength(normalizedName) > CONTACT_LIMITS.name ||
    hasNewline(normalizedName) ||
    hasControlCharacters(normalizedName)
  ) {
    return { ok: false, reason: "name" };
  }

  const normalizedEmail = email.trim();
  if (
    charLength(normalizedEmail) < 3 ||
    charLength(normalizedEmail) > CONTACT_LIMITS.email ||
    hasNewline(normalizedEmail) ||
    hasControlCharacters(normalizedEmail) ||
    !EMAIL_PATTERN.test(normalizedEmail)
  ) {
    return { ok: false, reason: "email" };
  }

  const normalizedSubject = subject.trim();
  if (
    charLength(normalizedSubject) < 1 ||
    charLength(normalizedSubject) > CONTACT_LIMITS.subject ||
    hasNewline(normalizedSubject) ||
    hasControlCharacters(normalizedSubject)
  ) {
    return { ok: false, reason: "subject" };
  }

  const normalizedMessage = message.trim();
  if (
    charLength(normalizedMessage) < 1 ||
    charLength(normalizedMessage) > CONTACT_LIMITS.message ||
    normalizedMessage.includes("\r") ||
    hasControlCharacters(normalizedMessage)
  ) {
    return { ok: false, reason: "message" };
  }

  const service = normalizeServiceId(body.id);
  if (!service.ok) {
    return { ok: false, reason: "id" };
  }

  return {
    ok: true,
    value: {
      name: normalizedName,
      email: normalizedEmail,
      subject: normalizedSubject,
      message: normalizedMessage,
      serviceId: service.value,
    },
  };
}
