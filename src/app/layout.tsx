import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FelixSphere OPC - Build Your One Person Company",
  description:
    "The all-in-one platform to start, register, and grow your one-person company with AI-powered team agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
