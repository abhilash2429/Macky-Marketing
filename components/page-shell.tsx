import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({ children, deferHeaderEntrance = false }: { children: React.ReactNode; deferHeaderEntrance?: boolean }) {
  return (
    <>
      <SiteHeader deferEntrance={deferHeaderEntrance} />
      {children}
      <SiteFooter />
    </>
  );
}
