import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner"

const raleway = Raleway({
  subsets: ["latin"], // required
  weight: ["700"], // optional
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parsley.io",
  description: "Get Job Recommendations powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable ,raleway.className} ${geistMono.variable} antialiased`}
      >
        <Providers>
        {children}
        <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
