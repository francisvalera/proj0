"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// This is a client-side wrapper for the SessionProvider from NextAuth.
// It allows client components to access the user's session data.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
