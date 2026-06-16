import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import TopFrame from "@/components/grammar/TopFrame";
import LiabilityStrip from "@/components/grammar/LiabilityStrip";
import AskTheGarden from "@/components/garden/AskTheGarden";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Herbarium type stack. Loaded here (not via CSS @import) because
            Tailwind v4 / lightningcss drops remote @import url() statements. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Archivo+Black&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        />
      </head>
      <body data-surface="tkg">
        <Suspense fallback={<div style={{ height: 56 }} />}>
          <TopFrame />
        </Suspense>
        <main className="min-h-[calc(100vh-200px)]">
          {children}
        </main>
        <LiabilityStrip />
        <footer
          className="relative overflow-hidden border-t border-[var(--paper-line)]"
          style={{ background: 'var(--paper-warm)' }}
        >
          {/* developed umbrella-bloom specimen — a soft herbarium watermark tying the
              Toxicology Knowledge Garden to the wider Knowledge Gardens enterprise */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/umbrella-bloom.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-1/2 select-none"
            style={{ top: '50%', transform: 'translate(-50%, -48%)', width: 196, opacity: 0.28, mixBlendMode: 'multiply' }}
          />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-14 sm:flex-row sm:px-6 lg:px-8">
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
        <AskTheGarden />
      </body>
    </html>
  );
}
