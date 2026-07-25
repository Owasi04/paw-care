"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function Providers({ children, session }) {
  // Create a single client that persists across renders
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider session={session} refetchInterval={30 * 60}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
