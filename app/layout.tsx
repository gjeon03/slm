import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegister from "./components/pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SLM - Simple Link Manager",
    template: "%s | SLM"
  },
  description: "간단하고 빠른 링크 단축 서비스. 임시 링크를 생성하고 관리하세요. | Simple and fast link shortening service. Create and manage temporary links.",
  keywords: "링크 단축, URL 단축, 임시 링크, 링크 관리, SLM, link shortener, URL shortener, temporary links, link management, short links",
  authors: [{ name: "SLM Team" }],
  creator: "SLM",
  publisher: "SLM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://slm.quickkit.net'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
      'en-US': '/?lang=en',
    },
  },
  openGraph: {
    title: "SLM - Simple Link Manager",
    description: "간단하고 빠른 링크 단축 서비스. 임시 링크를 생성하고 관리하세요. | Simple and fast link shortening service.",
    url: 'https://slm.quickkit.net',
    siteName: 'SLM',
    locale: 'ko_KR',
    type: 'website',
    alternateLocale: ['en_US'],
    images: [
      {
        url: '/slm-icon.png',
        width: 512,
        height: 512,
        alt: 'SLM Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "SLM - Simple Link Manager",
    description: "간단하고 빠른 링크 단축 서비스 | Simple link shortening service",
    images: ['/slm-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
    yandex: '',
    yahoo: '',
  },
  manifest: '/manifest.json',
  themeColor: '#374151',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SLM',
  },
  icons: {
    apple: '/slm-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="alternate" hrefLang="ko" href="https://slm.quickkit.net/" />
        <link rel="alternate" hrefLang="en" href="https://slm.quickkit.net/?lang=en" />
        <link rel="alternate" hrefLang="x-default" href="https://slm.quickkit.net/" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen`}
      >
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
