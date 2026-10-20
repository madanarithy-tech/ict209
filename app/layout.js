import { Cormorant_Garamond, Inter, Noto_Sans_Khmer } from 'next/font/google';
import LabShell from '@/components/LabShell';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-serif' });
const khmer = Noto_Sans_Khmer({ subsets: ['khmer'], weight: ['400', '600', '700'], variable: '--font-khmer' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'], variable: '--font-inter' });

export const metadata = { title: 'Digital Researching Lab' };
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${khmer.variable} ${inter.variable}`}>
      <body><LabShell>{children}</LabShell></body>
    </html>
  );
}
