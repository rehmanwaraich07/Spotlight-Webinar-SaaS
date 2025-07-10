import type { Metadata } from "next";
import { Asul } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const asulFont = Asul({
  subsets: ["latin"],
  variable: "--font-asul",
  weight: ["400", "700"], // Add this line
});

export const metadata: Metadata = {
  title: "Spotlight",
  description:
    "Spotlight helps businesses host professional webinars, manage clients, and grow faster with smart automation—all in one powerful SaaS platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${asulFont.variable} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
