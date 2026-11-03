import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const routerState = vi.hoisted(() => ({ query: {} }));

vi.mock("next/router", () => ({
  useRouter: () => ({ query: routerState.query, push: vi.fn() }),
}));

import Contact from "../../pages/contact/index";

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

async function fillForm(user) {
  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Email"), "ada@example.com");
  await user.type(screen.getByLabelText("Subject"), "Project enquiry");
  await user.type(
    screen.getByLabelText("Message"),
    "Hello, I would like to discuss a project."
  );
}

describe("Contact form", () => {
  let fetchMock;

  beforeEach(() => {
    routerState.query = {};
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  it("sends one request and shows a success state", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    expect(
      await screen.findByText(/Message sent successfully/i)
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/send");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(options.body)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Project enquiry",
      message: "Hello, I would like to discuss a project.",
      id: -1,
    });
  });

  it("forwards the service query parameter", async () => {
    routerState.query = { id: "design" };
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    await screen.findByText(/Message sent successfully/i);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).id).toBe("design");
  });

  it("disables the submit button while pending and cannot double submit", async () => {
    let resolveRequest;
    fetchMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    const pendingButton = await screen.findByRole("button", {
      name: /sending/i,
    });
    expect(pendingButton).toBeDisabled();

    await user.click(pendingButton);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveRequest(jsonResponse(200, { ok: true }));
    await screen.findByText(/Message sent successfully/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("blocks invalid input without calling the API", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Subject"), "Hello");
    await user.type(screen.getByLabelText("Message"), "Message");
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(/valid email/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a generic message when the server rejects the request", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(503, { ok: false, error: "unavailable" })
    );
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not be sent/i
    );
  });

  it("explains rate limiting", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(429, { ok: false, error: "rate_limited" })
    );
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /too many requests/i
    );
  });

  it("explains network timeouts", async () => {
    fetchMock.mockRejectedValue(Object.assign(new Error("aborted"), {
      name: "AbortError",
    }));
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/timed out/i);
  });

  it("announces status changes politely", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));
    const user = userEvent.setup();
    render(<Contact />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /let's talk/i }));

    await waitFor(() =>
      expect(status).toHaveTextContent(/Message sent successfully/i)
    );
  });
});
