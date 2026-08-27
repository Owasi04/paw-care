"use client";

import React, { useState } from "react";
import {
  PawPrint,
  Calendar,
  Plus,
  Download,
  Clock,
  ChevronRight,
  CalendarDays,
  Stethoscope,
  Users,
  ClipboardList,
  Activity,
  LayoutGrid,
  Unlink,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { getLocalDateString } from "@/app/lib/dateUtils";
import { getCategoryIcon } from "@/app/lib/serviceUtils";

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

// ─── Reusable UI Components ──────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, colorClasses }) => (
  <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
    <CardContent className="flex items-center gap-4 p-5">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[#6d7a77] dark:text-slate-500">
          {label}
        </p>
        <p className="text-3xl font-bold text-[#171d1c] dark:text-slate-50">
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

// `Button` wraps Base UI, whose escape hatch is `render` — there is no
// `asChild`. Styling the Link with `buttonVariants` avoids nesting an <a>
// inside a <button>, which is invalid HTML and breaks keyboard activation.
const QuickActionLink = ({ href, icon: Icon, label }) => (
  <Link
    href={href}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "group h-14 w-full justify-between rounded-xl border border-[#dee4e1] bg-white px-5 shadow-sm transition-all hover:border-[#00685f] hover:bg-[#00685f]/5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#6bd8cb] dark:hover:bg-[#00685f]/10",
    )}
  >
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-[#00685f] dark:text-[#6bd8cb]" />
      <span className="text-base font-medium text-[#171d1c] dark:text-slate-100">
        {label}
      </span>
      <ChevronRight className="h-5 w-5 text-[#6d7a77] transition-transform group-hover:translate-x-1 dark:text-slate-500" />
    </div>
  </Link>
);

// ─── Category filter chip (vet dashboard) ────────────────────────
const CategoryChip = ({ icon: Icon, label, count, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-[#00685f] bg-[#00685f] text-white dark:border-[#6bd8cb]"
        : "border-[#dee4e1] bg-white text-[#3d4947] hover:border-[#00685f] hover:bg-[#00685f]/5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#6bd8cb]",
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
    <span
      className={cn(
        "rounded-full px-1.5 text-xs font-semibold",
        active ? "bg-white/25" : "bg-[#eaefed] dark:bg-slate-700",
      )}
    >
      {count}
    </span>
  </button>
);

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
      <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-sm text-muted-foreground">{title}</p>
    {message && <p className="text-xs text-muted-foreground mt-1">{message}</p>}
  </div>
);

// ─── Owner Dashboard ─────────────────────────────────────────────
function OwnerDashboard({ user }) {
  const { data: ownerPets } = useQuery({
    queryKey: ["ownerPets", user?.name],
    queryFn: async () => {
      const res = await fetch(`/api/pets?ownerName=${encodeURIComponent(user?.name || "")}`);
      if (!res.ok) throw new Error("Failed to fetch pets");
      return res.json();
    },
    enabled: Boolean(user?.name),
  });

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["ownerAppointments", user?.name],
    queryFn: async () => {
      const res = await fetch(`/api/appointments?status=pending&status=confirmed&status=completed`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
    enabled: Boolean(user?.name),
  });

  const upcomingAppointments = React.useMemo(() => {
    const now = new Date();
    return appointments
      .filter((apt) => apt.status !== "cancelled" && (getAppointmentDateTime(apt) >= now || apt.status === "pending"))
      .sort((a, b) => getAppointmentDateTime(a) - getAppointmentDateTime(b));
  }, [appointments]);

  const recentActivity = React.useMemo(() => appointments.slice(0, 3), [appointments]);

  return (
    <div className="p-4 space-y-8 max-w-350 mx-auto">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#171d1c] dark:text-slate-50">Welcome back!</h1>
          <p className="text-lg text-[#3d4947] dark:text-slate-400 mt-0.5">Here's what's happening with your pets today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#00685f] cursor-pointer text-[#00685f] hover:bg-[#00685f]/5 dark:border-[#6bd8cb] dark:text-[#6bd8cb] dark:hover:bg-[#6bd8cb]/10" aschild="true">
            <Link href="/pets" className="flex flex-row gap-2 items-center">
              <Plus className="h-4 w-4 mr-1.5" /> Add New Pet
            </Link>
          </Button>
          <Button className="bg-[#00685f] cursor-pointer hover:bg-[#005049] text-white dark:bg-[#00685f] dark:hover:bg-[#005049]" aschild="true">
            <Link href="/services" className="flex flex-row gap-2 items-center">
              <Calendar className="h-4 w-4 mr-1.5" /> Book Appointment
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={PawPrint} label="Total Pets" value={ownerPets?.length ?? 0} colorClasses="bg-[#00685f]/10 dark:bg-[#00685f]/20 text-[#00685f] dark:text-[#6bd8cb]" />
        <StatCard icon={CalendarDays} label="Upcoming Appointments" value={upcomingAppointments.length} colorClasses="bg-[#fea619]/10 dark:bg-[#fea619]/20 text-[#855300] dark:text-[#ffb95f]" />
        <StatCard icon={Stethoscope} label="Active Treatments" value={0} colorClasses="bg-[#924628]/10 dark:bg-[#924628]/20 text-[#924628] dark:text-[#ffb59a]" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50">My Pets</h2>
              <Button variant="ghost" size="sm" className="text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049]" aschild="true">
                <Link href="/dashboard/my-pets" className="flex items-center gap-1.5">
                  View All <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              </Button>
            </div>
            {ownerPets?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ownerPets.map((pet) => <PetCard key={pet?._id} pet={pet} />)}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <PawPrint className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">No pets added yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Add your first pet to get started.</p>
                  <Button size="sm" className="mt-4 gap-1 bg-[#00685f] hover:bg-[#005049]" aschild="true">
                    <Link href="/pets"><Plus className="h-4 w-4" /> Add Pet</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50 mb-4">Upcoming Appointments</h2>
            <Card>
              <CardContent className="p-0 divide-y divide-[#dee4e1] dark:divide-slate-800">
                {isLoadingAppointments ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">Loading appointments...</div>
                ) : upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((apt) => (
                    <div key={apt._id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb]">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#171d1c] dark:text-slate-50">{apt.serviceName} — {apt.petName}</p>
                          <p className="text-xs text-muted-foreground">{formatAppointmentDate(apt.appointmentDate)} at {formatAppointmentTime(apt.appointmentTime)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(apt.status).className}`}>
                        {getStatusStyle(apt.status).label}
                      </span>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Calendar} title="No upcoming appointments" />
                )}
              </CardContent>
              <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-4 py-3">
                <Link href="/dashboard/my-appointments" className="w-full flex justify-center">
                  <Button aschild="true" variant="ghost" size="sm" className="text-[#00685f] dark:text-[#6bd8cb] cursor-pointer">
                    <span className="text-[16px]">View all appointments</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm bg-[#eaefed]/50 dark:bg-slate-900/50">
            <CardHeader className="pb-3"><CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-2">
              <QuickActionLink href="/pets" icon={Plus} label="Add New Pet" />
              <QuickActionLink href="/dashboard/health-records" icon={Download} label="Download Health Records" />
            </CardContent>
          </Card>

          <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading activity...</div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((apt) => (
                    <div key={apt._id} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#00685f]/10 dark:bg-[#00685f]/20 flex items-center justify-center text-[#00685f] dark:text-[#6bd8cb] shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#171d1c] dark:text-slate-100">
                          Booked <span className="font-medium">{apt.serviceName}</span> for {apt.petName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgoFromId(apt._id)}</p>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getStatusStyle(apt.status).className}`}>
                        {getStatusStyle(apt.status).label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Clock} title="No recent activity" />
              )}
            </CardContent>
            <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-5 py-3.5">
              <Button aschild="true" variant="ghost" size="sm" className="w-full text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049]">
                <Link className="flex flex-row gap-2" href="/dashboard/my-appointments">
                  See full activity history <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Mobile FAB */}
      <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#00685f] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50">
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}

// ─── Vet Dashboard ───────────────────────────────────────────────
const ALL_CATEGORIES = "__all__";

function VetDashboard({ user }) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

  // Which vet profile sits behind this login, and which service categories that
  // vet offers. Fetched first: without a vetID there is no schedule to show.
  const { data: vetMe, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["vetMe"],
    queryFn: async () => {
      const res = await fetch("/api/vet/me");
      if (!res.ok) throw new Error("Failed to load vet profile");
      return res.json();
    },
    enabled: user?.role === "vet",
  });

  const isLinked = vetMe?.linked === true;

  // The API already scopes this to the signed-in vet, so everything below is a
  // view over that one response — no per-category round trips.
  const { data: allAppointments = [], isLoading: isLoadingVetAppointments } =
    useQuery({
      queryKey: ["vetAppointments", vetMe?.vetID],
      queryFn: async () => {
        const res = await fetch(
          `/api/appointments?status=pending&status=confirmed&status=completed`,
        );
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      },
      enabled: isLinked,
    });

  // "Today" must be the viewer's local calendar date: appointmentDate is a bare
  // "YYYY-MM-DD" written by the booking form with no timezone attached, so a
  // UTC-based comparison shows the wrong day outside UTC.
  const todaysAppointments = React.useMemo(() => {
    const today = getLocalDateString();
    return allAppointments
      .filter(
        (apt) => apt.appointmentDate === today && apt.status !== "cancelled",
      )
      .sort((a, b) => getAppointmentDateTime(a) - getAppointmentDateTime(b));
  }, [allAppointments]);

  // One chip per category this vet offers — kept even at zero so the filter row
  // doesn't shift day to day — plus any category that shows up in today's list.
  const categoryCounts = React.useMemo(() => {
    const counts = new Map((vetMe?.serviceCategories ?? []).map((c) => [c, 0]));
    for (const apt of todaysAppointments) {
      const category = apt.serviceCategory ?? "Other";
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [vetMe?.serviceCategories, todaysAppointments]);

  const visibleAppointments = React.useMemo(
    () =>
      activeCategory === ALL_CATEGORIES
        ? todaysAppointments
        : todaysAppointments.filter(
            (apt) => (apt.serviceCategory ?? "Other") === activeCategory,
          ),
    [activeCategory, todaysAppointments],
  );

  // Distinct animals, not appointment rows — the same pet books repeatedly.
  const totalPatients = React.useMemo(
    () =>
      new Set(allAppointments.map((apt) => `${apt.userMail}::${apt.petName}`))
        .size,
    [allAppointments],
  );

  const pendingAppointments = React.useMemo(
    () => allAppointments.filter((apt) => apt.status === "pending"),
    [allAppointments],
  );
  const vetRecentActivity = React.useMemo(
    () => allAppointments.slice(0, 4),
    [allAppointments],
  );

  if (isLoadingProfile) {
    return (
      <div className="p-4 max-w-350 mx-auto">
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  // A vet account with no profile behind it would otherwise render an empty
  // schedule that looks like "no appointments today" — say what's actually wrong.
  if (!isLinked) {
    return (
      <div className="p-4 max-w-350 mx-auto">
        <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fea619]/10 text-[#855300] dark:bg-[#fea619]/20 dark:text-[#ffb95f]">
              <Unlink className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">
              Your vet profile isn’t linked yet
            </CardTitle>
            <CardDescription className="mt-1">
              This account is marked as a vet, but it isn’t connected to a
              profile in the vet directory — so we can’t tell whose schedule to
              show. Ask an administrator to link{" "}
              <span className="font-medium">{user?.email}</span> to a vet
              profile.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const profile = vetMe.profile;
  const displayName = profile?.display_name || user?.name || "Vet";
  const vetType = profile?.type
    ? profile.type.charAt(0).toUpperCase() + profile.type.slice(1)
    : null;

  return (
    <div className="p-4 space-y-8 max-w-350 mx-auto">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight text-[#171d1c] dark:text-slate-50">
              Welcome back, {displayName}!
            </h1>
            {vetType && (
              <span className="rounded-full bg-[#00685f]/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#00685f] dark:bg-[#00685f]/20 dark:text-[#6bd8cb]">
                {vetType}
              </span>
            )}
          </div>
          <p className="text-lg text-[#3d4947] dark:text-slate-400 mt-0.5">
            You have{" "}
            <span className="font-semibold text-[#171d1c] dark:text-slate-100">
              {todaysAppointments.length}
            </span>{" "}
            {todaysAppointments.length === 1 ? "appointment" : "appointments"}{" "}
            today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/my-appointments"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-[#00685f] text-[#00685f] hover:bg-[#00685f]/5 dark:border-[#6bd8cb] dark:text-[#6bd8cb] dark:hover:bg-[#6bd8cb]/10",
            )}
          >
            <CalendarDays className="h-4 w-4 mr-1.5" /> View Schedule
          </Link>
          <Link
            href="/dashboard/my-pets"
            className={cn(
              buttonVariants(),
              "bg-[#00685f] text-white hover:bg-[#005049] dark:bg-[#00685f] dark:hover:bg-[#005049]",
            )}
          >
            <Users className="h-4 w-4 mr-1.5" /> Patient Records
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={CalendarDays}
          label="Today's Appointments"
          value={todaysAppointments.length}
          colorClasses="bg-[#fea619]/10 dark:bg-[#fea619]/20 text-[#855300] dark:text-[#ffb95f]"
        />
        <StatCard
          icon={Users}
          label="Total Patients"
          value={totalPatients}
          colorClasses="bg-[#00685f]/10 dark:bg-[#00685f]/20 text-[#00685f] dark:text-[#6bd8cb]"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Cases"
          value={pendingAppointments.length}
          colorClasses="bg-[#924628]/10 dark:bg-[#924628]/20 text-[#924628] dark:text-[#ffb59a]"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-[#171d1c] dark:text-slate-50">
                Today's Schedule
              </h2>
              <Link
                href="/dashboard/my-appointments"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049]",
                )}
              >
                View All <ChevronRight className="h-4 w-4 ml-0.5" />
              </Link>
            </div>

            {/* Category filter — a groomer taps "Grooming" to see only that. */}
            {categoryCounts.length > 1 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <CategoryChip
                  icon={LayoutGrid}
                  label="All"
                  count={todaysAppointments.length}
                  active={activeCategory === ALL_CATEGORIES}
                  onClick={() => setActiveCategory(ALL_CATEGORIES)}
                />
                {categoryCounts.map(([category, count]) => (
                  <CategoryChip
                    key={category}
                    icon={getCategoryIcon(category)}
                    label={category}
                    count={count}
                    active={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  />
                ))}
              </div>
            )}

            <Card>
              <CardContent className="p-0 divide-y divide-[#dee4e1] dark:divide-slate-800">
                {isLoadingVetAppointments ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Loading schedule...
                  </div>
                ) : visibleAppointments.length > 0 ? (
                  visibleAppointments.map((apt) => (
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
                            {apt.petType}
                            {apt.petBreed ? ` (${apt.petBreed})` : ""} •{" "}
                            {apt.userName} •{" "}
                            {formatAppointmentTime(apt.appointmentTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {apt.serviceCategory && (
                          <span className="hidden sm:inline rounded-full bg-[#eaefed] px-2 py-0.5 text-[11px] font-medium text-[#3d4947] dark:bg-slate-800 dark:text-slate-400">
                            {apt.serviceCategory}
                          </span>
                        )}
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(apt.status).className}`}
                        >
                          {getStatusStyle(apt.status).label}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title={
                      activeCategory === ALL_CATEGORIES
                        ? "No appointments scheduled for today"
                        : `No ${activeCategory} appointments today`
                    }
                    message={
                      activeCategory === ALL_CATEGORIES
                        ? undefined
                        : "Choose “All” to see the rest of today's schedule."
                    }
                  />
                )}
              </CardContent>
              <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-4 py-3">
                <Link
                  href="/dashboard/my-appointments"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "mx-auto text-[16px] text-[#00685f] dark:text-[#6bd8cb]",
                  )}
                >
                  View full schedule
                </Link>
              </CardFooter>
            </Card>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-[#dee4e1] dark:border-slate-800 shadow-sm bg-[#eaefed]/50 dark:bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-[#171d1c] dark:text-slate-50">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <QuickActionLink
                href="/dashboard/my-pets"
                icon={Users}
                label="View All Patients"
              />
              <QuickActionLink
                href="/dashboard/my-appointments"
                icon={CalendarDays}
                label="View Full Schedule"
              />
            </CardContent>
          </Card>

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
                          <span className="font-medium">{apt.serviceName}</span>{" "}
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
                <EmptyState icon={Clock} title="No recent activity" />
              )}
            </CardContent>
            <CardFooter className="border-t border-[#dee4e1] dark:border-slate-800 px-5 py-3.5">
              <Link
                href="/dashboard/my-appointments"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full text-[#00685f] dark:text-[#6bd8cb] hover:text-[#005049]",
                )}
              >
                See full activity history{" "}
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────
function AdminDashboard() {
  return (
    <div className="p-4 space-y-8 max-w-350 mx-auto">
      Hello from Admin dashboard page
    </div>
  );
}

// ─── Main Page Entry ─────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null; // Or a loading spinner

  if (user.role === "user") return <OwnerDashboard user={user} />;
  if (user.role === "vet") return <VetDashboard user={user} />;
  if (user.role === "admin") return <AdminDashboard />;

  return null;
}