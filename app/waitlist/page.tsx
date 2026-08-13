import type { Metadata } from "next";
import Link from "next/link";
import { MackyLogo } from "@/components/macky-logo";
import { PageShell } from "@/components/page-shell";
import { WaitlistForm } from "@/components/waitlist-form";
import { getWaitlistCount } from "@/lib/supabase";
import { publicAssetSrc } from "@/lib/public-asset";

export const metadata: Metadata = {
  title: "Request early access",
  description: "Join the Macky waitlist for early access to a voice assistant that lives in your Mac's notch.",
};

export const dynamic = "force-dynamic";

function waitlistBackgroundSrc() {
  return publicAssetSrc("/assets/waitlist.png");
}

export default async function WaitlistPage() {
  const waitlistCount = await getWaitlistCount();

  return (
    <PageShell hideHeader hideFooter>
      <main className="waitlist-page">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="waitlist-page-bg"
          src={waitlistBackgroundSrc()}
          alt=""
          aria-hidden="true"
        />
        <section className="waitlist-layout" id="waitlist-form" aria-label="Request early access">
          <Link className="waitlist-logo" href="/" aria-label="Macky home">
            <MackyLogo size={56} glow loading="eager" />
          </Link>
          <p className="waitlist-eyebrow">Voice assistant for Mac</p>
          <h1>Let Macky handle the little interruptions.</h1>
          <p className="waitlist-lede">
            A voice assistant that stays in your Mac&apos;s notch until you need a hand.
            Say what you need, then get back to what you were doing.
          </p>
          <WaitlistForm initialCount={waitlistCount} />
        </section>
      </main>
    </PageShell>
  );
}
