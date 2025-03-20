import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
import Header from "./header";
import Footer from "./footer";
import Script from "next/script";

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
    default: 'JYO-PX',
    template: '%s | JYO-PX',
  },
  description: 'Jyoshna\'s Practice App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WBQW2BCHB6"></script>
        <script
        dangerouslySetInnerHTML={{
          __html:`
            window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-WBQW2BCHB6');`
        }}

        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-100 text-gray-800`}
      >
        <Header></Header>
        <main className="flex-grow">{children}</main> 
        <Footer></Footer>
      </body>
    </html>
  );
}
