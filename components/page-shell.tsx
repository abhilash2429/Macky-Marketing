import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({
  children,
  deferHeaderEntrance = false,
  hideHeader = false,
}: {
  children: React.ReactNode;
  deferHeaderEntrance?: boolean;
  hideHeader?: boolean;
}) {
  return (
    <>
      {!hideHeader && <SiteHeader deferEntrance={deferHeaderEntrance} />}
      {children}
      <SiteFooter />
    </>
  );
}
