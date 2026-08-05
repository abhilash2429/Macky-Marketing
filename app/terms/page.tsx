import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsDocument } from "@/lib/content";

export const metadata: Metadata = { title: "Terms of use" };

export default function TermsPage() {
  return <LegalPage document={termsDocument} />;
}
