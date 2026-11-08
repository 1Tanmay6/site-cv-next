import { Readable } from "node:stream";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/contact-store", () => ({
  saveContactRequest: vi.fn().mockResolvedValue({ messageId: "test" }),
}));

let handler;
let ipCounter = 0;

function createRequest(body) {
  ipCounter += 1;
  const payload = Buffer.from(JSON.stringify(body));
  const request = Readable.from([payload]);
  request.method = "POST";
  request.socket = { remoteAddress: `192.0.2.${ipCounter}` };
  request.headers = {
    host: "localhost:3000",
    "content-type": "application/json",
    "x-forwarded-for": `192.0.2.${ipCounter}`,
    "content-length": String(payload.length),
  };
  return request;
}

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(chunk) {
      this.body = chunk ? JSON.parse(chunk) : undefined;
    },
  };
}

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Project enquiry",
  message: "Hello, I would like to discuss a project.",
  id: "design",
};

describe("global contact rate limit", () => {
  beforeAll(async () => {
    vi.stubEnv("CONTACT_GLOBAL_RATE_LIMIT_MAX", "3");
    vi.stubEnv("CONTACT_RATE_LIMIT_MAX", "100");
    vi.resetModules();
    ({ default: handler } = await import("../../pages/api/send"));
  });

  it("blocks distributed requests once the instance-wide budget is spent", async () => {
    const statuses = [];

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const response = createResponse();
      await handler(createRequest(validPayload), response);
      statuses.push(response.statusCode);
    }

    expect(statuses).toEqual([200, 200, 200, 429]);
  });
});
