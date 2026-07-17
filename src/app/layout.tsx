import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AdminGod - Portfolio",
  description:
    "Portfolio of AdminGod, focused on practical full-stack engineering, automation, and polished web interfaces.",
  icons: {
    icon: "/admingod_white_transparent.png",
    shortcut: "/admingod_white_transparent.png",
    apple: "/admingod_white_transparent.png",
  },
  openGraph: {
    title: "AdminGod - Portfolio",
    description:
      "Practical full-stack engineering, automation, and polished web interfaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
