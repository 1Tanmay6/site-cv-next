import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ContactStoreConfigurationError,
  ContactStoreError,
  saveContactRequest,
  validateContactStoreConfiguration,
} from "../../lib/contact-store";

const payload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Project enquiry",
  message: "Hello, I would like to discuss a project.",
  serviceId: "design",
};

const environment = {
  repo_name: "owner/portfolio-contacts",
  git_pat_token: "ghp_test_token",
};

function createResponse({ status = 201, body = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

let fetchMock;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("validateContactStoreConfiguration", () => {
  it("accepts json test mode without credentials", () => {
    expect(validateContactStoreConfiguration({ CONTACT_STORE: "json" })).toBe(
      "json",
    );
  });

  it("requires repo_name", () => {
    expect(() =>
      validateContactStoreConfiguration({ git_pat_token: "token" }),
    ).toThrow(/repo_name/);
  });

  it("requires git_pat_token", () => {
    expect(() =>
      validateContactStoreConfiguration({ repo_name: "owner/repo" }),
    ).toThrow(/git_pat_token/);
  });

  it("rejects an invalid repository name", () => {
    expect(() =>
      validateContactStoreConfiguration({
        repo_name: "not-a-repository",
        git_pat_token: "token",
      }),
    ).toThrow(/owner\/repository/);
  });

  it("rejects an unknown store", () => {
    expect(() =>
      validateContactStoreConfiguration({ CONTACT_STORE: "database" }),
    ).toThrow(ContactStoreConfigurationError);
  });

  it("accepts a complete GitHub configuration", () => {
    expect(validateContactStoreConfiguration(environment)).toBe("github");
  });
});

describe("saveContactRequest", () => {
  it("returns a deterministic success in json test mode without network", async () => {
    const result = await saveContactRequest(payload, {
      CONTACT_STORE: "json",
    });

    expect(result.provider).toBe("json");
    expect(result.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.path).toMatch(/^contacts\/\d{4}-\d{2}-\d{2}\/.+\.txt$/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uploads one new text file to GitHub", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        body: {
          content: {
            html_url: "https://github.com/owner/portfolio-contacts/blob/main/contacts/test.txt",
          },
        },
      }),
    );

    const result = await saveContactRequest(payload, environment);

    expect(result.provider).toBe("github");
    expect(result.htmlUrl).toContain("github.com/owner/portfolio-contacts");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(
      /^https:\/\/api\.github\.com\/repos\/owner\/portfolio-contacts\/contents\/contacts\/\d{4}-\d{2}-\d{2}\/[0-9a-f-]{36}\.txt$/,
    );
    expect(url).not.toContain("ada@example.com");
    expect(url).not.toContain("Project enquiry");

    expect(init.method).toBe("PUT");
    expect(init.headers.authorization).toBe("Bearer ghp_test_token");
    expect(init.headers.accept).toBe("application/vnd.github+json");
    expect(init.headers["x-github-api-version"]).toBe("2022-11-28");

    const body = JSON.parse(init.body);
    expect(body.message).toMatch(/^chore: add contact request [0-9a-f-]{36}$/);
    expect(body.message).not.toContain("ada@example.com");

    const text = Buffer.from(body.content, "base64").toString("utf8");
    expect(text).toContain("Name: Ada Lovelace");
    expect(text).toContain("Email: ada@example.com");
    expect(text).toContain("Subject: Project enquiry");
    expect(text).toContain("Service: design");
    expect(text).toContain("Message:\nHello, I would like to discuss a project.");
    expect(text).toContain(`Request ID: ${result.id}`);

    expect(JSON.stringify(result)).not.toContain("ghp_test_token");
  });

  it("maps GitHub authentication failures to EAUTH", async () => {
    fetchMock.mockResolvedValue(createResponse({ status: 401 }));

    await expect(saveContactRequest(payload, environment)).rejects.toMatchObject(
      {
        name: "ContactStoreError",
        provider: "github",
        code: "EAUTH",
        responseCode: 401,
      },
    );
  });

  it("maps missing repositories to EHTTP", async () => {
    fetchMock.mockResolvedValue(createResponse({ status: 404 }));

    await expect(saveContactRequest(payload, environment)).rejects.toMatchObject(
      { code: "EHTTP", responseCode: 404 },
    );
  });

  it("maps timeouts to ETIMEDOUT", async () => {
    fetchMock.mockRejectedValue(
      Object.assign(new Error("aborted"), { name: "AbortError" }),
    );

    await expect(saveContactRequest(payload, environment)).rejects.toMatchObject(
      { code: "ETIMEDOUT", provider: "github" },
    );
  });

  it("maps network errors to ECONNECTION", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    await expect(saveContactRequest(payload, environment)).rejects.toMatchObject(
      { code: "ECONNECTION", provider: "github" },
    );
  });

  it("never includes the token in delivery errors", async () => {
    fetchMock.mockResolvedValue(createResponse({ status: 403 }));

    try {
      await saveContactRequest(payload, environment);
      throw new Error("expected a store failure");
    } catch (error) {
      expect(error).toBeInstanceOf(ContactStoreError);
      expect(error.message).not.toContain("ghp_test_token");
      expect(JSON.stringify(error)).not.toContain("ghp_test_token");
    }
  });
});
