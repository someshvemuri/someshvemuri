import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Vemuri Somesh - Software Engineer",
  description:
    "Full-stack software engineer specializing in Java, microservices, and cloud technologies. Building scalable systems at Ford Motor Company.",
  keywords: ["Software Engineer", "Java", "Microservices", "Cloud", "AWS", "GCP"],
  authors: [{ name: "Vemuri Somesh" }],
  openGraph: {
    title: "Vemuri Somesh - Software Engineer",
    description: "Crafting scalable distributed systems and event-driven architectures",
    url: "https://someshvemuri.github.io",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${fraunces.variable} bg-[#f7f8fa] text-slate-900 antialiased selection:bg-emerald-200 selection:text-slate-900`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,#d7f2eb_0%,transparent_35%),radial-gradient(circle_at_90%_15%,#dbeafe_0%,transparent_30%),linear-gradient(to_bottom,#fbfcfd,#f7f8fa)]" />
        {children}
      </body>
    </html>
  );
}
