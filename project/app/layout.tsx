import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
title: 'EarthWise Coach - Sustainable Living & Wellness',
description: 'Your personal AI coach for sustainable living and holistic wellness',
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body className={inter.className}>
<ThemeProvider>
<NavBar />
{children}
<Toaster />
</ThemeProvider>
</body>
</html>
);
}