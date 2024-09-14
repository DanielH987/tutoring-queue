"use client";

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from './context/ModalContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <ModalProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
