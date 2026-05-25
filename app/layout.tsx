import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StoryForge AI - Generate Viral TikTok AI Series',
  description: 'Automatically generate viral TikTok AI series with AI-powered character creation, story generation, episode scripting, and video prompt generation.',
  openGraph: {
    title: 'StoryForge AI',
    description: 'Generate viral TikTok AI series automatically',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
