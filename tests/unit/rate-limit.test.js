import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRateLimiter, getClientIp } from "../../lib/rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-31T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit and blocks the next one", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });

    expect(limiter.check("ip-a")).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.check("ip-a")).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.check("ip-a")).toMatchObject({
      allowed: false,
      retryAfterSeconds: 60,
    });
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });

    expect(limiter.check("ip-a").allowed).toBe(true);
    expect(limiter.check("ip-a").allowed).toBe(false);
    expect(limiter.check("ip-b").allowed).toBe(true);
  });

  it("resets after the window elapses", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });

    expect(limiter.check("ip-a").allowed).toBe(true);
    expect(limiter.check("ip-a").allowed).toBe(false);

    vi.advanceTimersByTime(1_001);

    expect(limiter.check("ip-a").allowed).toBe(true);
  });

  it("supports an injected clock", () => {
    let timestamp = 1_000;
    const limiter = createRateLimiter({
      limit: 1,
      windowMs: 500,
      now: () => timestamp,
    });

    expect(limiter.check("ip").allowed).toBe(true);
    expect(limiter.check("ip").allowed).toBe(false);

    timestamp = 1_600;
    expect(limiter.check("ip").allowed).toBe(true);
  });

  it("prunes expired buckets once the map grows", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });

    for (let index = 0; index < 1001; index += 1) {
      limiter.check(`ip-${index}`);
    }

    expect(limiter.size).toBeLessThanOrEqual(1001);

    vi.advanceTimersByTime(1_001);
    limiter.check("trigger-cleanup");
    expect(limiter.size).toBe(1);
  });
});

describe("getClientIp", () => {
  it("prefers the first forwarded-for address", () => {
    expect(
      getClientIp({
        headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
      })
    ).toBe("203.0.113.10");
  });

  it("falls back to x-real-ip and the socket address", () => {
    expect(getClientIp({ headers: { "x-real-ip": "198.51.100.7" } })).toBe(
      "198.51.100.7"
    );
    expect(getClientIp({ headers: {}, socket: { remoteAddress: "::1" } })).toBe(
      "::1"
    );
    expect(getClientIp({ headers: {} })).toBe("unknown");
  });
});
