import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "CIISIC — CII Industry Academia Excellence Cell State Portal",
  description: "A collaborative hub bridging the gap between industry requirements and student innovations across Madhya Pradesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-off-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
