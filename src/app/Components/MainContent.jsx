"use client";
import { usePathname } from "next/navigation";

export default function MainContent({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <main className={isDashboard ? "w-full" : "w-11/12 mx-auto"}>
      {children}
    </main>
  );
}
