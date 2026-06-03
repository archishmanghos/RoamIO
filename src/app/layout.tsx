import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "RoamIO | Effortless Exploration",
  description:
    "Discover tailored itineraries designed by AI to match your unique travel style. No clutter, no stress, just pure exploration.",
  keywords: ["travel", "AI", "itinerary", "trip planning", "vacation"],
  openGraph: {
    title: "RoamIO — Your Next Escape, Planned in Seconds",
    description:
      "AI-powered travel planning that matches your style. Get personalized itineraries in seconds.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
