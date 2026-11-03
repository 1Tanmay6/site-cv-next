import nodemailer from "nodemailer";

const REQUIRED_SMTP_VARIABLES = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "MAIL_FROM",
  "MAIL_TO",
];

const SMTP_TIMEOUTS = Object.freeze({
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000,
});

export class MailConfigurationError extends Error {
  constructor(message = "Mail is not configured") {
    super(message);
    this.name = "MailConfigurationError";
  }
}

function readSmtpConfiguration(environment = process.env) {
  if (environment.CONTACT_MAIL_TRANSPORT === "json") {
    // Deterministic, credential-free transport for automated tests. It never
    // opens a network connection and must only be enabled deliberately.
    return { jsonTransport: true };
  }

  const missing = REQUIRED_SMTP_VARIABLES.filter(
    (variable) => !environment[variable]
  );

  if (missing.length > 0) {
    throw new MailConfigurationError(
      `Missing mail configuration: ${missing.join(", ")}`
    );
  }

  const port = Number.parseInt(environment.SMTP_PORT, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new MailConfigurationError("Invalid SMTP_PORT");
  }

  const secure =
    environment.SMTP_SECURE === "true" ||
    (environment.SMTP_SECURE === undefined && port === 465);

  return {
    host: environment.SMTP_HOST,
    port,
    secure,
    auth: {
      user: environment.SMTP_USER,
      pass: environment.SMTP_PASSWORD,
    },
    tls: { minVersion: "TLSv1.2" },
    ...SMTP_TIMEOUTS,
  };
}

export function createTransporter(environment = process.env) {
  const configuration = readSmtpConfiguration(environment);
  return nodemailer.createTransport(configuration);
}

export function buildMailOptions(payload, environment = process.env) {
  const from = environment.MAIL_FROM;
  const to = environment.MAIL_TO;

  if (!from || !to) {
    throw new MailConfigurationError("Missing MAIL_FROM or MAIL_TO");
  }

  const service =
    payload.serviceId === "not-from-service"
      ? "Not from services"
      : `From services: ${payload.serviceId}`;

  return {
    from,
    to,
    // Subject is server-prefixed and the visitor value is validated for CR/LF
    // before reaching this function.
    subject: `Portfolio contact: ${payload.subject}`,
    text: [
      "New contact request",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Subject: ${payload.subject}`,
      `Service: ${service}`,
      "",
      "Message:",
      payload.message,
    ].join("\n"),
  };
}

export async function sendContactMail(payload, environment = process.env) {
  const transporter = createTransporter(environment);
  return transporter.sendMail(buildMailOptions(payload, environment));
}
