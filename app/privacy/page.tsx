import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacySections } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" sections={privacySections} />;
}
