import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apollo Adventure Park",
  description: "Website Requirements and Specifications — Apollo Adventure Park",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {/* Nav must remain reachable via tactile or mental input — TECHNICAL_SPEC.md §5 */}
        <nav aria-label="Primary">
          <a href="/">Welcome</a>
          <a href="/tickets">Tickets</a>
          <a href="/poi">Attractions &amp; Dining</a>
          <a href="/stay">Tranquillity Inn</a>
          <a href="/map">Park Map</a>
          <a href="/contact">Contact</a>
        </nav>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
