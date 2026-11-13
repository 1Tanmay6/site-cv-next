const GITHUB_API_URL = "https://api.github.com";
const HTTP_TIMEOUT_MS = 10_000;

export class ContactStoreConfigurationError extends Error {
  constructor(message = "Contact store is not configured") {
    super(message);
    this.name = "ContactStoreConfigurationError";
  }
}

export class ContactStoreError extends Error {
  constructor(message, { provider = "github", code, responseCode } = {}) {
    super(message);
    this.name = "ContactStoreError";
    this.provider = provider;
    this.code = code;
    this.command = "HTTP";
    this.responseCode = responseCode;
  }
}

function resolveStore(environment) {
  const requested = String(environment.CONTACT_STORE || "github")
    .trim()
    .toLowerCase();

  if (requested !== "github" && requested !== "json") {
    throw new ContactStoreConfigurationError("Invalid CONTACT_STORE");
  }

  return requested;
}

export function validateContactStoreConfiguration(environment = process.env) {
  const provider = resolveStore(environment);

  if (provider === "json") {
    return provider;
  }

  const { repo_name: repository, git_pat_token: token } = environment;

  if (!repository) {
    throw new ContactStoreConfigurationError(
      "Missing contact store configuration: repo_name"
    );
  }

  if (!token) {
    throw new ContactStoreConfigurationError(
      "Missing contact store configuration: git_pat_token"
    );
  }

  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new ContactStoreConfigurationError(
      "Invalid repo_name; expected owner/repository"
    );
  }

  return provider;
}

function buildRequestText(payload, requestId, receivedAt) {
  return [
    "New portfolio contact request",
    "",
    `Request ID: ${requestId}`,
    `Received at: ${receivedAt}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    `Service: ${payload.serviceId}`,
    "",
    "Message:",
    payload.message,
    "",
  ].join("\n");
}

async function putFile(path, body, token) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(`${GITHUB_API_URL}${path}`, {
      method: "PUT",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "site-cv-next-contact",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError" || error?.name === "TimeoutError") {
      throw new ContactStoreError("GitHub request timed out", {
        code: "ETIMEDOUT",
      });
    }
    throw new ContactStoreError("GitHub request failed", {
      code: "ECONNECTION",
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    // Do not include the provider response or the token in errors or logs.
    throw new ContactStoreError("GitHub rejected the request", {
      code: response.status === 401 || response.status === 403 ? "EAUTH" : "EHTTP",
      responseCode: response.status,
    });
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
}

/**
 * Stores one validated contact request as a new text file in a GitHub repo.
 * The file path never contains visitor PII; a fresh UUID prevents collisions.
 */
export async function saveContactRequest(payload, environment = process.env) {
  const provider = validateContactStoreConfiguration(environment);
  const requestId = crypto.randomUUID();
  const receivedAt = new Date().toISOString();
  const day = receivedAt.slice(0, 10);
  const path = `contacts/${day}/${requestId}.txt`;

  if (provider === "json") {
    return { provider, id: requestId, path };
  }

  const text = buildRequestText(payload, requestId, receivedAt);
  const result = await putFile(
    `/repos/${environment.repo_name}/contents/${path}`,
    {
      message: `chore: add contact request ${requestId}`,
      content: Buffer.from(text, "utf8").toString("base64"),
    },
    environment.git_pat_token
  );

  return {
    provider,
    id: requestId,
    path,
    htmlUrl: result?.content?.html_url,
  };
}
