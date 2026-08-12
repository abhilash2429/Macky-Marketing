import { NextResponse } from "next/server";
import { getSupabaseAdmin, getWaitlistCount } from "@/lib/supabase";

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

    const count = await getWaitlistCount();

    // Already signed up — treat as success so the form still feels finished.
    if (error?.code === "23505") {
      return NextResponse.json(
        {
          message: "Hold your patience you’re already on the waitlist to try out GTA VI soon :)",
          count,
          added: false,
        },
        { status: 200 },
      );
    }

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "okeeeeeees :)\nYou are in......", count, added: true },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "I couldn’t add you to the waitlist just yet. Please try again shortly." },
      { status: 502 },
    );
  }
}
