import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsSections } from "@/lib/content";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return <LegalPage title="Terms of service" sections={termsSections} />;
}
