import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'Vredz Health Hub',
  description: 'Personal health, workout & meal tracker',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        {/* Desktop: offset for sidebar. Mobile: offset for bottom nav */}
        <main style={{
          minHeight: '100dvh',
          paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
        }} className="lg:ml-[220px] lg:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
