"use client";

import React from "react";
import {
  PawPrint,
  Calendar,
  Plus,
  Download,
  Clock,
  ChevronRight,
  CalendarDays,
  Stethoscope,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── Component ──────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ─── Welcome Header ─── */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#171d1c] dark:text-slate-50">
            Welcome back!
          </h1>
          <p className="text-lg text-[#3d4947] dark:text-slate-400 mt-0.5">
            Here's what's happening with your pets today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#00685f] text-[#00685f] hover:bg-[#00685f]/5 dark:border-[#6bd8cb] dark:text-[#6bd8cb] dark:hover:bg-[#6bd8cb]/10"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Pet
          </Button>
          <Button className="bg-[#00685f] hover:bg-[#005049] text-white dark:bg-[#00685f] dark:hover:bg-[#005049]">
            <Calendar className="h-4 w-4 mr-1.5" />
            Book Appointment
          </Button>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb]">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6d7a77] dark:text-slate-500">
                Total Pets
              </p>
              <p className="text-3xl font-bold text-[#171d1c] dark:text-slate-50">
                0
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-full bg-[#fea619]/10 dark:bg-[#fea619]/20 flex items-center justify-center text-[#855300] dark:text-[#ffb95f]">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6d7a77] dark:text-slate-500">
                Upcoming Appointments
              </p>
              <p className="text-3xl font-bold text-[#171d1c] dark:text-slate-50">
                0
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-full bg-[#924628]/10 dark:bg-[#924628]/20 flex items-center justify-center text-[#924628] dark:text-[#ffb59a]">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6d7a77] dark:text-slate-500">
                Active Treatments
              </p>
              <p className="text-3xl font-bold text-[#171d1c] dark:text-slate-50">
                0
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Main grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          {/* My Pets - Empty State */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50">
                My Pets
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049] dark:hover:text-[#6bd8cb]/80"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </Button>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <PawPrint className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">
                  No pets added yet
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first pet to get started.
                </p>
                <Button
                  size="sm"
                  className="mt-4 gap-1 bg-[#00685f] hover:bg-[#005049]"
                >
                  <Plus className="h-4 w-4" /> Add Pet
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Appointments - Empty State */}
          <section>
            <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50 mb-4">
              Upcoming Appointments
            </h2>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No upcoming appointments
                </p>
              </CardContent>
              <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[#00685f] dark:text-[#6bd8cb]"
                >
                  View all appointments
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm bg-[#eaefed]/50 dark:bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <button className="group w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-[#dee4e1] dark:border-slate-700 hover:border-[#00685f] dark:hover:border-[#6bd8cb] hover:bg-[#00685f]/5 dark:hover:bg-[#00685f]/10 transition-all">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
                  <span className="text-sm font-medium text-[#171d1c] dark:text-slate-100">
                    Add New Pet
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-[#6d7a77] dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="group w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-[#dee4e1] dark:border-slate-700 hover:border-[#00685f] dark:hover:border-[#6bd8cb] hover:bg-[#00685f]/5 dark:hover:bg-[#00685f]/10 transition-all">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
                  <span className="text-sm font-medium text-[#171d1c] dark:text-slate-100">
                    Download Health Records
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-[#6d7a77] dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="group w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-[#dee4e1] dark:border-slate-700 hover:border-[#00685f] dark:hover:border-[#6bd8cb] hover:bg-[#00685f]/5 dark:hover:bg-[#00685f]/10 transition-all">
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
                  <span className="text-sm font-medium text-[#171d1c] dark:text-slate-100">
                    Order Supplements
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-[#6d7a77] dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </CardContent>
          </Card>

          {/* Recent Activity - Empty State */}
          <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-5 py-3.5">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049] dark:hover:text-[#6bd8cb]/80"
              >
                See full activity history
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* ─── Mobile FAB ─── */}
      <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#00685f] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50">
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}
