import { IBM_Plex_Mono, Inter, Noto_Sans_Khmer } from 'next/font/google';
import LabShell from '@/components/LabShell';
import './globals.css';

const khmer = Noto_Sans_Khmer({ subsets: ['khmer'], weight: ['400', '500', '600', '700'], variable: '--font-khmer' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono' });

export const metadata = { title: 'Digital Researching Lab', description: 'A virtual chemistry lab for lower and upper secondary students.' };
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0f766e' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${khmer.variable} ${inter.variable} ${mono.variable}`}>
      <body suppressHydrationWarning><LabShell>{children}</LabShell></body>
    </html>
  );
}
