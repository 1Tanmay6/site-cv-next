import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn();
  const createTransport = vi.fn(() => ({ sendMail }));
  return { sendMail, createTransport };
});

vi.mock("nodemailer", () => ({
  default: { createTransport },
}));

import {
  MailConfigurationError,
  buildMailOptions,
  createTransporter,
  sendContactMail,
} from "../../lib/mailer";

const environment = {
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "587",
  SMTP_USER: "smtp-user",
  SMTP_PASSWORD: "super-secret",
  MAIL_FROM: "portfolio@example.com",
  MAIL_TO: "owner@example.com",
};

const payload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Project enquiry",
  message: "Hello there",
  serviceId: "design",
};

describe("mailer configuration", () => {
  beforeEach(() => {
    sendMail.mockReset().mockResolvedValue({ messageId: "1" });
    createTransport.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds a TLS-enabled transporter with timeouts", () => {
    createTransporter({ ...environment });

    expect(createTransport).toHaveBeenCalledWith({
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: { user: "smtp-user", pass: "super-secret" },
      tls: { minVersion: "TLSv1.2" },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  });

  it("uses implicit TLS for port 465 and explicit overrides", () => {
    createTransporter({ ...environment, SMTP_PORT: "465" });
    expect(createTransport.mock.calls.at(-1)[0].secure).toBe(true);

    createTransporter({
      ...environment,
      SMTP_PORT: "587",
      SMTP_SECURE: "true",
    });
    expect(createTransport.mock.calls.at(-1)[0].secure).toBe(true);
  });

  it("throws a configuration error when required values are missing", () => {
    expect(() => createTransporter({})).toThrow(MailConfigurationError);
  });

  it("throws for an invalid port", () => {
    expect(() =>
      createTransporter({ ...environment, SMTP_PORT: "not-a-port" }),
    ).toThrow(MailConfigurationError);
  });

  it("uses a credential-free JSON transport only when explicitly enabled", () => {
    createTransporter({ CONTACT_MAIL_TRANSPORT: "json" });
    expect(createTransport).toHaveBeenCalledWith({ jsonTransport: true });
  });

  it("keeps sender and recipient server-controlled", () => {
    const options = buildMailOptions(payload, environment);

    expect(options.from).toBe("portfolio@example.com");
    expect(options.to).toBe("owner@example.com");
    expect(options.subject).toBe("Portfolio contact: Project enquiry");
    expect(options.text).toContain("Name: Ada Lovelace");
    expect(options.text).toContain("Email: ada@example.com");
    expect(options.text).toContain("From services: design");
    expect(options.text).toContain("Hello there");
    expect(options.text).not.toContain("super-secret");
  });

  it("labels non-service submissions explicitly", () => {
    const options = buildMailOptions(
      { ...payload, serviceId: "not-from-service" },
      environment,
    );

    expect(options.text).toContain("Service: Not from services");
  });

  it("sends exactly one message without exposing credentials", async () => {
    await sendContactMail(payload, environment);

    expect(createTransport).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(1);

    const options = sendMail.mock.calls[0][0];
    expect(JSON.stringify(options)).not.toContain("super-secret");
    expect(JSON.stringify(options)).not.toContain("smtp-user");
  });
});
