"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const TYPEWRITER_SAMPLE = "you@company.com";
const TYPEWRITER_MS = 48;

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterRef = useRef<number | null>(null);

  useEffect(() => {
    function clearTypewriter() {
      if (typewriterRef.current !== null) {
        window.clearInterval(typewriterRef.current);
        typewriterRef.current = null;
      }
    }

    function startTypewriter() {
      if (email.trim()) {
        inputRef.current?.focus();
        return;
      }

      clearTypewriter();
      setPlaceholder("");
      inputRef.current?.focus();

      let index = 0;
      typewriterRef.current = window.setInterval(() => {
        index += 1;
        setPlaceholder(TYPEWRITER_SAMPLE.slice(0, index));
        if (index >= TYPEWRITER_SAMPLE.length && typewriterRef.current !== null) {
          window.clearInterval(typewriterRef.current);
          typewriterRef.current = null;
        }
      }, TYPEWRITER_MS);
    }

    window.addEventListener("waitlist:typewriter", startTypewriter);
    return () => {
      window.removeEventListener("waitlist:typewriter", startTypewriter);
      clearTypewriter();
    };
  }, [email]);

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
        ref={inputRef}
        id="waitlist-email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        placeholder={placeholder}
        onChange={(event) => {
          setPlaceholder("");
          setEmail(event.target.value);
        }}
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
