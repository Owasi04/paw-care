"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Menu,
  X,
  Moon,
  Sun,
  House,
  HelpCircle,
  Search,
  Bell,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// ─── Sidebar navigation items ──────────────────────────────
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Pets", icon: PawPrint, href: "/dashboard/my-pets" },
  { name: "Appointments", icon: Calendar, href: "/dashboard/my-appointments" },
  { name: "Health Records", icon: FileText, href: "/dashboard/records" },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { data: session } = useSession();
  const user = session?.user;

  // Determine active nav item based on current pathname
  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#f5faf8] dark:bg-slate-950/50">
      {/* ─── Sidebar ─── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-slate-900 border-r border-[#dee4e1] dark:border-slate-800/60 p-4 transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex flex-col mb-8 px-2">
            <Link href="/" className="flex-shrink-0">
              <Image
                alt="Logo"
                src="/Logo.jpg"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-[#00685f]/5 text-[#00685f] dark:bg-[#00685f]/20 dark:text-[#6bd8cb] border-r-2 border-[#00685f]"
                  : "text-[#3d4947] hover:bg-[#dee4e1]/50 hover:text-[#171d1c] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Book Appointment button */}
        <div className="mt-6 px-2">
          <button className="w-full bg-[#00685f] text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#005049] transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            Book Appointment
          </button>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1 border-t border-[#dee4e1] dark:border-slate-800/60 pt-4">
          <Link
            href="/"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#3d4947] dark:text-slate-300 transition-colors hover:bg-[#dee4e1]/50 dark:hover:bg-slate-800"
          >
            <House className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/support"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#3d4947] dark:text-slate-300 transition-colors hover:bg-[#dee4e1]/50 dark:hover:bg-slate-800"
          >
            <HelpCircle className="h-4 w-4" />
            Support
          </Link>
          <div className="flex items-center gap-3 pt-2 px-1">
            <Avatar className="h-10 w-10 ring-2 ring-[#fea619]/20">
              <AvatarImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center&auto=format"
                alt="User"
              />
              <AvatarFallback className="bg-[#fea619]/20 text-[#855300] dark:bg-[#fea619]/10 dark:text-[#ffb95f] text-sm font-medium">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-[#171d1c] dark:text-slate-100">
                {user?.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#6d7a77] dark:text-slate-500 truncate">
                  Member
                </span>
              </div>
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
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#dee4e1] dark:border-slate-800/60 px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold text-[#00685f] dark:text-[#6bd8cb] hidden md:block">
              Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-[#6d7a77] dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search records..."
                className="w-64 bg-[#f0f5f2] dark:bg-slate-800 border border-[#dee4e1] dark:border-slate-700 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 dark:focus:ring-[#6bd8cb]/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#3d4947] dark:text-slate-400 hover:text-[#00685f] dark:hover:text-[#6bd8cb] transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#3d4947] dark:text-slate-400 hover:text-[#00685f] dark:hover:text-[#6bd8cb] transition-colors md:hidden"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-[#3d4947] dark:text-slate-400 hover:text-[#00685f] dark:hover:text-[#6bd8cb] transition-colors"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
