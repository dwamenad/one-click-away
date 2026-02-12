import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "One Click Away",
  description: "Turn social place ideas into ready-to-use trip plans"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-8">{children}</main>
      </body>
    </html>
  );
}
