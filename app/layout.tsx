// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: "700",        // ← 700 = bold
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      {/* This makes EVERYTHING bold and Inter by default */}
      <body className="font-bold min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}