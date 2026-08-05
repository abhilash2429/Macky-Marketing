import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacyDocument } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy & data use" };

export default function PrivacyPage() {
  return <LegalPage document={privacyDocument} />;
}
