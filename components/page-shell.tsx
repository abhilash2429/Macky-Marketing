import { SiteFooter } from "@/components/site-footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
