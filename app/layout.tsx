import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Keepy Uppy - Soccer Ball Juggling Game",
  description: "A fun and challenging soccer ball juggling game where you keep the ball in the air using your shoe. Hit the walls for bonus points and try to beat your high score!",
  metadataBase: new URL('https://keepy-uppy.vercel.app'),
  openGraph: {
    title: "Keepy Uppy - Soccer Ball Juggling Game",
    description: "Keep the ⚽️ in the air with your 👟. Hit the walls for bonus points!",
    url: 'https://keepy-uppy.vercel.app',
    siteName: 'Keepy Uppy',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Keepy Uppy Game Preview'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Keepy Uppy - Soccer Ball Juggling Game",
    description: "Keep the ⚽️ in the air with your 👟. Hit the walls for bonus points!",
    images: ['/og-image.jpg'], // Same image as OG
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

