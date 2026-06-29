import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function ShinyButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-[#0a0a0a] px-8 text-sm font-semibold tracking-[1.1px] text-white transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9089E2] focus-visible:ring-offset-2",
        "before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.55),transparent)] before:animate-[shiny-button_1.8s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
