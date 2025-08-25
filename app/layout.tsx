import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import StoreProvider from "./redux/provider";

export const metadata: Metadata = {
  title: "Daisy - Healthcare Management System",
  description: "Electronic Medical Records and Healthcare Management Platform",
  generator: "v0.app",
};

/**
 * RootLayout for the application.
 *
 * Key Changes:
 * 1. Removed manual `<head>` and `<body>` tags. Next.js handles these.
 * 2. Removed the inline `<style>` block to prevent potential hydration mismatches.
 * 3. Applied the font variables directly to the `<html>` tag using `className`.
 * This is the standard and safest way to apply global fonts with Next.js and geist.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
