"use client";

import ToasterClient from "@/components/ToasterClient";
import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToasterClient />
      {children}
    </SessionProvider>
  );
}
