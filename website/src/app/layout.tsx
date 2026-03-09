import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Toxicology Knowledge Garden",
    template: "%s | Toxicology Knowledge Garden",
  },
  description:
    "Explore 329 substances in your drinking water. Evidence-based toxicology data from EWG, PubChem, and EPA — built for everyone from concerned parents to researchers.",
  keywords: ["toxicology", "water quality", "contaminants", "PFAS", "drinking water", "health effects"],
  openGraph: {
    siteName: "The Knowledge Gardens — Toxicology",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-[var(--color-gold)]/20 bg-[var(--color-cream)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-3 no-underline">
              <GearIcon />
              <div>
                <div className="font-[var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                  The Knowledge Gardens
                </div>
                <div className="font-[var(--font-mono)] text-xs tracking-widest text-[var(--color-steel)] uppercase">
                  Toxicology
                </div>
              </div>
            </a>
            <nav className="hidden gap-6 font-[var(--font-mono)] text-sm md:flex">
              <a href="/substances" className="text-[var(--color-steel)] hover:text-[var(--color-teal)]">Substances</a>
              <a href="/health-effects" className="text-[var(--color-steel)] hover:text-[var(--color-teal)]">Health Effects</a>
              <a href="/about" className="text-[var(--color-steel)] hover:text-[var(--color-teal)]">About</a>
            </nav>
          </div>
        </header>

        <main className="min-h-[calc(100vh-140px)]">
          {children}
        </main>

        <footer className="border-t border-[var(--color-gold)]/20 bg-[var(--color-cream)]">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="font-[var(--font-mono)] text-xs text-[var(--color-steel)]">
                Data sources: EWG · PubChem · EPA
              </div>
              <div className="font-[var(--font-mono)] text-xs text-[var(--color-steel)]">
                © 2026 The Knowledge Gardens · XR Workers
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function GearIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" style={{ animation: 'spin 12s linear infinite' }}>
      <path
        d="M12 1l1.5 3.2a7.5 7.5 0 012.8 1.6L19.5 4l1 2.6-3 1.7a7.5 7.5 0 01.5 3.2h3.5v2.8H18a7.5 7.5 0 01-.5 3.2l3 1.7-1 2.6-3.2-1.8a7.5 7.5 0 01-2.8 1.6L12 23l-1.5-3.2a7.5 7.5 0 01-2.8-1.6L4.5 20l-1-2.6 3-1.7A7.5 7.5 0 016 12.5H2.5V9.7H6a7.5 7.5 0 01.5-3.2l-3-1.7 1-2.6 3.2 1.8a7.5 7.5 0 012.8-1.6L12 1z"
        fill="none" stroke="var(--color-copper)" strokeWidth="0.8"
      />
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="var(--color-copper)" strokeWidth="0.8" />
    </svg>
  );
}
