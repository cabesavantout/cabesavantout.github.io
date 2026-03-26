import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabestany Avant Tout | Espace equipe",
  description: "Webapp interne de campagne municipale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="page-shell">{children}</body>
    </html>
  );
}
