import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import TopFrame from "@/components/grammar/TopFrame";
import LiabilityStrip from "@/components/grammar/LiabilityStrip";

export const metadata: Metadata = {
  title: {
    default: "Toxicology Knowledge Garden",
    template: "%s | Toxicology Knowledge Garden",
  },
  description:
    "Three sources behind every claim — toxicology organized for consumers, clinicians, counsel, hygienists, and inspectors.",
  openGraph: {
    siteName: "Toxicology Knowledge Garden",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body data-surface="tkg">
        <Suspense fallback={<div style={{ height: 56 }} />}>
          <TopFrame />
        </Suspense>
        <main className="min-h-[calc(100vh-200px)]">
          {children}
        </main>
        <LiabilityStrip />
        <footer
          className="border-t border-[var(--paper-line)]"
          style={{ background: 'var(--paper-warm)' }}
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
            <div
              className="text-[var(--ink-mute)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              three sources behind every claim
            </div>
            <div
              className="text-[var(--ink-mute)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              © 2026 · the knowledge gardens
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
