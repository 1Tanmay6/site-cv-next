import { describe, expect, it } from "vitest";
import {
  CONTACT_LIMITS,
  normalizeServiceId,
  validateContactPayload,
} from "../../lib/contact-schema";

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Project enquiry",
  message: "Hello, I would like to discuss a project.",
  id: "design",
};

describe("normalizeServiceId", () => {
  it.each([
    [undefined, "not-from-service"],
    [null, "not-from-service"],
    ["", "not-from-service"],
    [-1, "not-from-service"],
    ["-1", "not-from-service"],
    [" branding ", "branding"],
    ["DESIGN", "design"],
    ["genai", "genai"],
    ["datascience", "datascience"],
    ["synthetic-data", "synthetic-data"],
  ])("normalizes %p to %p", (input, expected) => {
    expect(normalizeServiceId(input)).toEqual({ ok: true, value: expected });
  });

  it.each([["unknown"], ["design; DROP TABLE"], [0], [{}], [["design"]]])(
    "rejects unsafe service id %p",
    (input) => {
      expect(normalizeServiceId(input)).toEqual({ ok: false });
    },
  );
});

describe("validateContactPayload", () => {
  it("accepts and trims a valid payload", () => {
    const result = validateContactPayload({
      ...validPayload,
      name: "  Ada Lovelace  ",
      email: "  ada@example.com ",
    });

    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Project enquiry",
      message: "Hello, I would like to discuss a project.",
      serviceId: "design",
    });
  });

  it("accepts a payload at the documented length boundaries", () => {
    const result = validateContactPayload({
      name: "a".repeat(CONTACT_LIMITS.name),
      email: `${"a".repeat(CONTACT_LIMITS.email - 13)}@example.com`,
      subject: "s".repeat(CONTACT_LIMITS.subject),
      message: "m".repeat(CONTACT_LIMITS.message),
      id: -1,
    });

    expect(result.ok).toBe(true);
  });

  it.each([
    ["name beyond limit", { name: "a".repeat(CONTACT_LIMITS.name + 1) }],
    [
      "subject beyond limit",
      { subject: "s".repeat(CONTACT_LIMITS.subject + 1) },
    ],
    [
      "message beyond limit",
      { message: "m".repeat(CONTACT_LIMITS.message + 1) },
    ],
    ["empty name", { name: "   " }],
    ["empty message", { message: "\n\n" }],
    ["newline in name", { name: "Ada\nBcc: evil@example.com" }],
    ["CR in name", { name: "Ada\rLovelace" }],
    ["newline in subject", { subject: "Hello\r\nBcc: evil@example.com" }],
    ["invalid email", { email: "not-an-email" }],
    ["email with CRLF", { email: "ada@example.com\r\nBcc: evil@example.com" }],
    ["NUL byte", { message: "hello\u0000world" }],
    ["unexpected field", { admin: true }],
    ["unsafe service id", { id: "billing" }],
  ])("rejects %s", (_label, override) => {
    expect(validateContactPayload({ ...validPayload, ...override }).ok).toBe(
      false,
    );
  });

  it("rejects an overlong email measured in code points", () => {
    const localPart = "😀".repeat(CONTACT_LIMITS.email - 11);
    const result = validateContactPayload({
      ...validPayload,
      email: `${localPart}@example.com`,
    });
    expect(result.ok).toBe(false);
  });

  it.each([[null], [[]], ["string"], [42], [undefined]])(
    "rejects non-object body %p",
    (body) => {
      expect(validateContactPayload(body).ok).toBe(false);
    },
  );

  it("rejects prototype-polluted payloads", () => {
    const body = JSON.parse('{"__proto__":{"polluted":true}}');
    expect(validateContactPayload(body).ok).toBe(false);
  });

  it("accepts unicode text within the limits", () => {
    const result = validateContactPayload({
      ...validPayload,
      name: "José Álvarez 李",
      subject: "Grüße — 相談",
      message: "Line one\nLine two with accents: café, naïve, 日本語",
    });
    expect(result.ok).toBe(true);
  });
});
