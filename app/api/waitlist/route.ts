import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const waitlistWebhookUrl = process.env.WAITLIST_WEBHOOK_URL;

  if (!waitlistWebhookUrl) {
    return NextResponse.json(
      { message: "Early access is not open just yet. Please check back soon." },
      { status: 503 },
    );
  }

  let email: unknown;

  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ message: "Please enter your email address." }, { status: 400 });
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const webhookResponse = await fetch(waitlistWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), source: "macky-marketing-waitlist" }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!webhookResponse.ok) {
      throw new Error("Waitlist webhook rejected the request.");
    }
  } catch {
    return NextResponse.json(
      { message: "I couldn’t add you to the waitlist just yet. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "You’re on the list." }, { status: 201 });
}
