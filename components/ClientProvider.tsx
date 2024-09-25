"use client";

import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from '../app/context/ModalContext';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </SessionProvider>
  );
}