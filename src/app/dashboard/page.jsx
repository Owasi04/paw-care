"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Loader2,
  LayoutDashboard,
  PawPrint,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Download,
  Package,
  Clock,
  User,
  Menu,
  X,
  Moon,
  Sun,
  House,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import MainContent from "./Components/main";

// ─── Sidebar navigation items ──────────────────────────────
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Pets", icon: PawPrint, href: "/dashboard/pets" },
  { name: "Appointments", icon: Calendar, href: "/dashboard/my-appointments" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
  { name: "Health Records", icon: FileText, href: "/dashboard/records" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

// ─── Component ──────────────────────────────────────────────
const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      {/* ─── Sidebar (desktop) ─── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 p-4 transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 mb-8">
          {/* Tip: If your logo has a white background, consider adding dark:invert or changing it in dark mode */}
          <Image
            alt="Logo"
            src="/Logo.jpg"
            width={100}
            height={100}
            className="dark:brightness-95"
          />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>

          <Link
            href="/"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <House className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 text-sm font-medium">
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {session.user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Mobile overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Main content ─── */}
      <MainContent
        session={session}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
};

export default Dashboard;
