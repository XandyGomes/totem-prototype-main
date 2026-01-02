'use client';

import { TotemProvider } from '@/contexts/TotemContext';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TotemProvider>
          {children}
          <Toaster />
        </TotemProvider>
      </body>
    </html>
  );
}
