import type { Metadata } from 'next';
import './globals.css';
import AppProviders from '@/components/AppProviders';

export const metadata: Metadata = {
  title: 'Aurelia | Fine Dining & Digital QR Menu',
  description: 'Exquisite digital QR food menu and reservation experience.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
