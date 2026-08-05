import type { Metadata } from "next";
import { Fragment_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const fragmentMono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Macky — Voice in. Action out.",
    template: "%s — Macky",
  },
  description:
    "Macky is an early-access voice assistant that lives in your Mac's notch and helps across macOS and the apps you choose to connect.",
  icons: { icon: "/assets/macky-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${instrumentSerif.variable} ${fragmentMono.variable}`}>{children}</body>
    </html>
  );
}
