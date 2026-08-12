"use client";

import { type FormEvent, useState } from "react";
import { Check } from "lucide-react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

function waitlistCountLabel(count: number) {
  if (count === 1) return "There is 1 other on the waitlist.";
  return `There are ${Math.max(0, count).toLocaleString()} others on the waitlist.`;
}

export function WaitlistForm({ initialCount = 0 }: { initialCount?: number }) {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(initialCount);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function submitWaitlistRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json() as {
        message?: string;
        count?: number;
        added?: boolean;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Something went wrong. Please try again.");
      }

      if (typeof result.count === "number") {
        setCount(result.count);
      } else if (result.added !== false) {
        setCount((current) => current + 1);
      }

      setSubmissionState("success");
      setMessage("You're on the list. You'll be notified when early access opens for you.");
      setEmail("");
    } catch (error) {
      setSubmissionState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="waitlist-signup">
      {submissionState === "success" ? (
        <div className="waitlist-success" role="status" aria-live="polite">
          <span><Check size={18} /></span>
          <div>
            <strong>You&apos;re on the list.</strong>
            <p>{message}</p>
          </div>
        </div>
      ) : (
        <>
          <p className="waitlist-social" aria-live="polite">{waitlistCountLabel(count)}</p>
          <form className="waitlist-form" onSubmit={submitWaitlistRequest}>
            <label className="sr-only" htmlFor="waitlist-email">Email address</label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              placeholder="Enter your email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" disabled={submissionState === "submitting"}>
              {submissionState === "submitting" ? "Saving…" : "Request access"}
            </button>
            {submissionState === "error" && <p className="waitlist-error" role="alert">{message}</p>}
          </form>
        </>
      )}
    </div>
  );
}
