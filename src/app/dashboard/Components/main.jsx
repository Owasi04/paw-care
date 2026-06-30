"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Download,
  Menu,
  MessageSquare,
  Package,
  PawPrint,
  Plus,
  User,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const main = ({ session, sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <main className="flex-1 lg:ml-64">
        {/* Mobile header with toggle */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60 px-4 py-3 lg:hidden flex items-center justify-between">
          <Link href={`/`} className="flex items-center gap-2">
            <Image
              alt="Logo"
              src="/Logo.jpg"
              width={100}
              height={100}
              className="dark:brightness-95"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="dark:text-slate-400 dark:hover:text-slate-100"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
          {/* ─── Welcome ─── */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
              Welcome, {session.user?.name || "User"}!
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Hope your pets are well.
            </p>
          </div>

          {/* ─── Stats ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total Pets
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    —
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
                  <PawPrint className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Upcoming Appointments
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    —
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Messages + Quick Actions ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">No messages</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center gap-2">
                <Plus className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add New Pet
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-4 h-4" /> Download Health Records
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Package className="w-4 h-4" /> Order Supplements
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ─── Pet Cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md dark:hover:shadow-black/30 transition-shadow">
              <CardContent className="flex items-start gap-4 p-5">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-linear-to-br from-indigo-400 to-indigo-600 text-white text-xl font-bold">
                    ?
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      Pet Name
                    </h4>
                    <Badge variant="outline">Type</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Book Appointment
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md dark:hover:shadow-black/30 transition-shadow">
              <CardContent className="flex items-start gap-4 p-5">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-linear-to-br from-amber-400 to-amber-600 text-white text-xl font-bold">
                    ?
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      Pet Name
                    </h4>
                    <Badge variant="outline">Type</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    >
                      Book Vaccine
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Recent Activity + Upcoming Appointments ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  No recent activity
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Appointment Title
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Pet name
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Doctor name
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Button size="sm" variant="outline" className="text-xs">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Bottom Quick Actions ─── */}
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                Quick Actions
              </span>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add New Pet
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-4 h-4" /> Download Health Records
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Package className="w-4 h-4" /> Order Supplements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default main;
