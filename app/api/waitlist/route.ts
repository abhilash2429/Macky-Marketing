import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WAITLIST_SOURCE = "macky-marketing-waitlist";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
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

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { error } = await supabase.from("waitlist").insert({
      email: normalizedEmail,
      source: WAITLIST_SOURCE,
    });

    // Already signed up — treat as success so the form still feels finished.
    if (error?.code === "23505") {
      return NextResponse.json({ message: "You’re on the list." }, { status: 200 });
    }

    if (error) {
      throw error;
    }
  } catch {
    return NextResponse.json(
      { message: "I couldn’t add you to the waitlist just yet. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "You’re on the list." }, { status: 201 });
}
