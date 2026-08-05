"use client";

import { type FormEvent, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
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
      const result = await response.json() as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Something went wrong. Please try again.");
      }

      setSubmissionState("success");
      setMessage("You're on the list. You'll be notified when early access opens for you.");
      setEmail("");
    } catch (error) {
      setSubmissionState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (submissionState === "success") {
    return (
      <div className="waitlist-success" role="status" aria-live="polite">
        <span><Check size={20} /></span>
        <div>
          <strong>You&apos;re on the list.</strong>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={submitWaitlistRequest}>
      <label htmlFor="waitlist-email">Your email address</label>
      <input
        id="waitlist-email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button className="button button-dark" type="submit" disabled={submissionState === "submitting"}>
        {submissionState === "submitting" ? "Saving your spot…" : <>Request early access <ArrowUpRight size={18} /></>}
      </button>
      <p className="waitlist-form-note">This email will be used to manage your early-access request.</p>
      {submissionState === "error" && <p className="waitlist-error" role="alert">{message}</p>}
    </form>
  );
}
