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
  Users,
  ClipboardList,
  Activity,
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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import PetCard from "./components/petCards";
import Link from "next/link";

// ─── Status styling (matches vet-passport palette) ──────────────
const STATUS_STYLES = {
  pending: {
    label: "Pending",
    className:
      "bg-[#fea619]/10 text-[#855300] dark:bg-[#fea619]/20 dark:text-[#ffb95f]",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-[#00685f]/10 text-[#00685f] dark:bg-[#00685f]/20 dark:text-[#6bd8cb]",
  },
  completed: {
    label: "Completed",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-[#924628]/10 text-[#924628] dark:bg-[#924628]/20 dark:text-[#ffb59a]",
  },
};

function getStatusStyle(status) {
  return (
    STATUS_STYLES[status] ?? {
      label: status,
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    }
  );
}

// ─── Date/time helpers ────────────────────────────────────────
function getAppointmentDateTime(apt) {
  return new Date(`${apt.appointmentDate}T${apt.appointmentTime}`);
}

function formatAppointmentDate(dateStr) {
  return new Date(`${dateStr}T00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAppointmentTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function timeAgoFromId(id) {
  const timestamp = parseInt(String(id).substring(0, 8), 16) * 1000;
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ─── Component ──────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  // console.log(user);

  const { data: ownerPets } = useQuery({
    queryKey: ["ownerPets", user?.name],
    queryFn: async () => {
      const res = await fetch(
        `/api/pets?ownerName=${encodeURIComponent(user?.name || "")}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch pets");
      }
      return res.json();
    },
    enabled: Boolean(user?.name),
  });

  const { data: userAppointments = [], isLoading: isLoadingAppointments } =
    useQuery({
      queryKey: ["userAppointments", user?.email],
      queryFn: async () => {
        const res = await fetch(
          `/api/appointments?userMail=${encodeURIComponent(user?.email || "")}&status=pending&status=completed`,
        );
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      },
      enabled: Boolean(user?.email),
    });

  const upcomingAppointments = React.useMemo(() => {
    const now = new Date();
    return userAppointments
      .filter(
        (apt) =>
          apt.status !== "cancelled" &&
          (getAppointmentDateTime(apt) >= now || apt.status === "pending"),
      )
      .sort((a, b) => getAppointmentDateTime(a) - getAppointmentDateTime(b));
  }, [userAppointments]);

  const recentActivity = React.useMemo(
    () => userAppointments.slice(0, 3),
    [userAppointments],
  );

  // ─── Vet dashboard data ───────────────────────────────────
  const { data: allPets = [] } = useQuery({
    queryKey: ["allPets"],
    queryFn: async () => {
      const res = await fetch(`/api/pets`);
      if (!res.ok) throw new Error("Failed to fetch pets");
      return res.json();
    },
    enabled: user?.role === "vet",
  });

  const { data: allAppointments = [], isLoading: isLoadingVetAppointments } =
    useQuery({
      queryKey: ["allAppointments"],
      queryFn: async () => {
        const res = await fetch(
          `/api/appointments?status=pending&status=confirmed&status=completed`,
        );
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      },
      enabled: user?.role === "vet",
    });

  const todaysAppointments = React.useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return allAppointments
      .filter(
        (apt) => apt.appointmentDate === today && apt.status !== "cancelled",
      )
      .sort((a, b) => getAppointmentDateTime(a) - getAppointmentDateTime(b));
  }, [allAppointments]);

  const pendingAppointments = React.useMemo(
    () => allAppointments.filter((apt) => apt.status === "pending"),
    [allAppointments],
  );

  const vetRecentActivity = React.useMemo(
    () => allAppointments.slice(0, 4),
    [allAppointments],
  );

  return (
    <div className="">
      {user?.role === "user" && (
        <div className="p-4 space-y-8 max-w-350 mx-auto">
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
                className="border-[#00685f] cursor-pointer text-[#00685f] hover:bg-[#00685f]/5 dark:border-[#6bd8cb] dark:text-[#6bd8cb] dark:hover:bg-[#6bd8cb]/10"
              >
                <Link
                  href={`/pets`}
                  className="flex flex-row gap-2 items-center"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add New Pet
                </Link>
              </Button>
              <Button className="bg-[#00685f] cursor-pointer hover:bg-[#005049] text-white dark:bg-[#00685f] dark:hover:bg-[#005049]">
                <Link
                  href={`/services`}
                  className="flex flex-row gap-2 items-center"
                >
                  {" "}
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Book Appointment
                </Link>
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
                    {ownerPets?.length ?? 0}
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
                    {upcomingAppointments.length}
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
              {/* My Pets */}
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
                    <Link
                      href={`/dashboard/my-pets`}
                      className="flex items-center gap-1.5"
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                  </Button>
                </div>
                {ownerPets?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ownerPets.map((pet) => (
                      <PetCard key={pet?._id} pet={pet} />
                    ))}
                  </div>
                ) : (
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
                )}
              </section>

              {/* Upcoming Appointments */}
              <section>
                <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50 mb-4">
                  Upcoming Appointments
                </h2>
                <Card>
                  <CardContent className="p-0 divide-y divide-[#dee4e1] dark:divide-slate-800">
                    {isLoadingAppointments ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        Loading appointments...
                      </div>
                    ) : upcomingAppointments.length > 0 ? (
                      upcomingAppointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt._id}
                          className="flex items-center justify-between p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb]">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#171d1c] dark:text-slate-50">
                                {apt.serviceName} — {apt.petName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatAppointmentDate(apt.appointmentDate)} at{" "}
                                {formatAppointmentTime(apt.appointmentTime)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(apt.status).className}`}
                          >
                            {getStatusStyle(apt.status).label}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                          <Calendar className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No upcoming appointments
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-4 py-3">
                    <Link
                      href="/dashboard/my-appointments"
                      className="w-full flex justify-center"
                    >
                      <Button
                        aschild="true"
                        variant="ghost"
                        size="sm"
                        className=" text-[#00685f] dark:text-[#6bd8cb] cursor-pointer "
                      >
                        <span className="text-[16px]">
                          View all appointments
                        </span>
                      </Button>
                    </Link>
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
                <CardContent className="space-y-4 pt-2">
                  {/* Add New Pet */}
                  <Button
                    aschild="true"
                    variant="outline"
                    className="group h-14 w-full justify-between rounded-xl border border-[#dee4e1] bg-white px-5 shadow-sm transition-all hover:border-[#00685f] hover:bg-[#00685f]/5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#6bd8cb] dark:hover:bg-[#00685f]/10"
                  >
                    <Link href="/pets">
                      <div className="flex items-center gap-3">
                        <Plus className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
                        <span className="text-base font-medium text-[#171d1c] dark:text-slate-100">
                          Add New Pet
                        </span>

                        <ChevronRight className="h-5 w-5 text-[#6d7a77] transition-transform group-hover:translate-x-1 dark:text-slate-500" />
                      </div>
                    </Link>
                  </Button>

                  {/* Download Health Records */}
                  <Button
                    aschild="true"
                    variant="outline"
                    className="group h-14 w-full justify-between rounded-xl border border-[#dee4e1] bg-white px-5 shadow-sm transition-all hover:border-[#00685f] hover:bg-[#00685f]/5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#6bd8cb] dark:hover:bg-[#00685f]/10"
                  >
                    <Link href="/dashboard/health-records">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
                        <span className="text-base font-medium text-[#171d1c] dark:text-slate-100">
                          Download Health Records
                        </span>

                        <ChevronRight className="h-5 w-5 text-[#6d7a77] transition-transform group-hover:translate-x-1 dark:text-slate-500" />
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAppointments ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading activity...
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((apt) => (
                        <div key={apt._id} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb] shrink-0">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#171d1c] dark:text-slate-100">
                              Booked{" "}
                              <span className="font-medium">
                                {apt.serviceName}
                              </span>{" "}
                              for {apt.petName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {timeAgoFromId(apt._id)}
                            </p>
                          </div>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getStatusStyle(apt.status).className}`}
                          >
                            {getStatusStyle(apt.status).label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No recent activity
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-5 py-3.5">
                  <Button
                    aschild="true"
                    variant="ghost"
                    size="sm"
                    className="w-full text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049] dark:hover:text-[#6bd8cb]/80"
                  >
                    <Link
                      className="flex flex-row gap-2"
                      href="/dashboard/my-appointments"
                    >
                      See full activity history
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
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
      )}
      {user?.role === "vet" && (
        <div className="p-4 space-y-8 max-w-350 mx-auto">
          {/* ─── Welcome Header ─── */}
          <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#171d1c] dark:text-slate-50">
                Welcome back, Dr. {user?.name?.split(" ")[0] || "Vet"}!
              </h1>
              <p className="text-lg text-[#3d4947] dark:text-slate-400 mt-0.5">
                Here's your clinic overview for today.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-[#00685f] cursor-pointer text-[#00685f] hover:bg-[#00685f]/5 dark:border-[#6bd8cb] dark:text-[#6bd8cb] dark:hover:bg-[#6bd8cb]/10"
              >
                <Link
                  href={`/dashboard/my-appointments`}
                  className="flex flex-row gap-2 items-center"
                >
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  View Schedule
                </Link>
              </Button>
              <Button className="bg-[#00685f] cursor-pointer hover:bg-[#005049] text-white dark:bg-[#00685f] dark:hover:bg-[#005049]">
                <Link
                  href={`/dashboard/my-pets`}
                  className="flex flex-row gap-2 items-center"
                >
                  <Users className="h-4 w-4 mr-1.5" />
                  Patient Records
                </Link>
              </Button>
            </div>
          </section>

          {/* ─── Stats ─── */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb]">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#6d7a77] dark:text-slate-500">
                    Total Patients
                  </p>
                  <p className="text-3xl font-bold text-[#171d1c] dark:text-slate-50">
                    {allPets.length}
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
                    Today's Appointments
                  </p>
                  <p className="text-3xl font-bold text-[#171d1c] dark:text-slate-50">
                    {todaysAppointments.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-full bg-[#924628]/10 dark:bg-[#924628]/20 flex items-center justify-center text-[#924628] dark:text-[#ffb59a]">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#6d7a77] dark:text-slate-500">
                    Pending Cases
                  </p>
                  <p className="text-3xl font-bold text-[#171d1c] dark:text-slate-50">
                    {pendingAppointments.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ─── Main grid ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Today's Schedule */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50">
                    Today's Schedule
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049] dark:hover:text-[#6bd8cb]/80"
                  >
                    <Link
                      href={`/dashboard/my-schedule`}
                      className="flex items-center gap-1.5"
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-0 divide-y divide-[#dee4e1] dark:divide-slate-800">
                    {isLoadingVetAppointments ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        Loading schedule...
                      </div>
                    ) : todaysAppointments.length > 0 ? (
                      todaysAppointments.map((apt) => (
                        <div
                          key={apt._id}
                          className="flex items-center justify-between p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb]">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#171d1c] dark:text-slate-50">
                                {apt.serviceName} — {apt.petName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {apt.petType} ({apt.petBreed}) • {apt.userName}{" "}
                                • {formatAppointmentTime(apt.appointmentTime)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(apt.status).className}`}
                          >
                            {getStatusStyle(apt.status).label}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                          <Calendar className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No appointments scheduled for today
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-4 py-3">
                    <Link
                      href="/dashboard/my-appointments"
                      className="w-full flex justify-center"
                    >
                      <Button
                        aschild="true"
                        variant="ghost"
                        size="sm"
                        className="text-[#00685f] dark:text-[#6bd8cb] cursor-pointer"
                      >
                        <span className="text-[16px]">View full schedule</span>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </section>

              {/* Patient Records */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50">
                    Patient Records
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049] dark:hover:text-[#6bd8cb]/80"
                  >
                    <Link
                      href={`/dashboard/patient-records`}
                      className="flex items-center gap-1.5"
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                  </Button>
                </div>
                {/* {allPets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allPets.slice(0, 4).map((pet) => (
                      <PetCard key={pet?._id} pet={pet} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <PawPrint className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">
                        No patient records found
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Patient records will appear here once pets are
                        registered.
                      </p>
                    </CardContent>
                  </Card>
                )} */}
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
                <CardContent className="space-y-4 pt-2">
                  {/* View All Patients */}
                  <Button
                    aschild="true"
                    variant="outline"
                    className="group h-14 w-full justify-between rounded-xl border border-[#dee4e1] bg-white px-5 shadow-sm transition-all hover:border-[#00685f] hover:bg-[#00685f]/5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#6bd8cb] dark:hover:bg-[#00685f]/10"
                  >
                    <Link href="/dashboard/my-pets">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
                        <span className="text-base font-medium text-[#171d1c] dark:text-slate-100">
                          View All Patients
                        </span>
                        <ChevronRight className="h-5 w-5 text-[#6d7a77] transition-transform group-hover:translate-x-1 dark:text-slate-500" />
                      </div>
                    </Link>
                  </Button>

                  {/* View Full Schedule */}
                  <Button
                    aschild="true"
                    variant="outline"
                    className="group h-14 w-full justify-between rounded-xl border border-[#dee4e1] bg-white px-5 shadow-sm transition-all hover:border-[#00685f] hover:bg-[#00685f]/5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#6bd8cb] dark:hover:bg-[#00685f]/10"
                  >
                    <Link href="/dashboard/my-appointments">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
                        <span className="text-base font-medium text-[#171d1c] dark:text-slate-100">
                          View Full Schedule
                        </span>
                        <ChevronRight className="h-5 w-5 text-[#6d7a77] transition-transform group-hover:translate-x-1 dark:text-slate-500" />
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingVetAppointments ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading activity...
                    </div>
                  ) : vetRecentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {vetRecentActivity.map((apt) => (
                        <div key={apt._id} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb] shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#171d1c] dark:text-slate-100">
                              <span className="font-medium">
                                {apt.serviceName}
                              </span>{" "}
                              for {apt.petName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {apt.userName} • {timeAgoFromId(apt._id)}
                            </p>
                          </div>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getStatusStyle(apt.status).className}`}
                          >
                            {getStatusStyle(apt.status).label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No recent activity
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-5 py-3.5">
                  <Button
                    aschild="true"
                    variant="ghost"
                    size="sm"
                    className="w-full text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049] dark:hover:text-[#6bd8cb]/80"
                  >
                    <Link
                      className="flex flex-row gap-2"
                      href="/dashboard/my-appointments"
                    >
                      See full activity history
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
      {user?.role === "admin" && (
        <div className="p-4 space-y-8 max-w-350 mx-auto">
          Hello form Admin dashboard page
        </div>
      )}
    </div>
  );
}
