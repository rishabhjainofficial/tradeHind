import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RoleProvider } from '@/context/RoleContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Zero layout shift (CLS) Next.js Google Font optimization
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#008080',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "TradeHind - India's Hybrid B2B Marketplace & Hyperlocal Directory",
  description:
    'Connect with verified manufacturers, wholesalers, and service suppliers across India. Get instant quotes, compare RFQs, and unlock direct BuyLeads.',
  keywords: [
    'B2B Marketplace India',
    'BuyLeads',
    'Verified Suppliers',
    'GST Quotation',
    'Wholesale India',
    'Udaipur Marble',
    'Industrial Machinery',
  ],
  openGraph: {
    title: 'TradeHind - Verified B2B Marketplace & Directory',
    description:
      'Find top manufacturers and wholesale suppliers across India with instant GST quotations and verified BuyLeads.',
    url: 'https://tradehind.com',
    siteName: 'TradeHind',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <RoleProvider>
          <div className="page-wrapper">
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
