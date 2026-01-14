import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

// We are removing the Google Font import to bypass the Turbopack bug

export const metadata: Metadata = {
  title: "NaturaPick | Admin Dashboard",
  description: "Manage your urban gardening and sustainability stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We use standard system font classes that don't require network requests or local loaders */}
      <body className="antialiased font-sans">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          expand={false}
          theme="light"
        />
      </body>
    </html>
  );
}
