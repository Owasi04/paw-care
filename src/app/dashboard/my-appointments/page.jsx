"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  PawPrint,
  Stethoscope,
  Syringe,
  Bone,
  Heart,
  ShowerHead,
  Scissors,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Icon resolver for service types ──────────────────────────────────────────

const serviceIconMap = {
  "General Checkup": Stethoscope,
  Vaccinations: Syringe,
  "Dental Care": Bone,
  Surgery: Heart,
  Grooming: ShowerHead,
  Microchipping: Scissors,
  "Lab & Diagnostics": ShieldCheck,
  "Emergency Care": AlertCircle,
};

const getServiceIcon = (title) => {
  const Icon = serviceIconMap[title] || PawPrint;
  return <Icon size={20} strokeWidth={1.5} />;
};

// ─── Badge component ──────────────────────────────────────────────────────────

const Badge = ({ children }) => (
  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/30">
    {children}
  </span>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed:
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
    pending:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
    cancelled:
      "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40",
    completed:
      "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60",
  };
  const icons = {
    confirmed: <CheckCircle2 size={14} />,
    pending: <HelpCircle size={14} />,
    cancelled: <XCircle size={14} />,
    completed: <CheckCircle2 size={14} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border capitalize ${
        styles[status] || styles.pending
      }`}
    >
      {icons[status] || icons.pending}
      {status}
    </span>
  );
};

// ─── Mock appointments data ────────────────────────────────────────────────────

const mockAppointments = [
  {
    id: "APT-001",
    service: "General Checkup",
    petName: "Max",
    petType: "Dog",
    date: "2026-06-20",
    time: "10:30 AM",
    vet: "Dr. Sarah Miller",
    status: "confirmed",
    notes: "Annual wellness exam — bring vaccination records.",
  },
  {
    id: "APT-002",
    service: "Vaccinations",
    petName: "Luna",
    petType: "Cat",
    date: "2026-06-22",
    time: "2:00 PM",
    vet: "Dr. James Wilson",
    status: "pending",
    notes: "Booster shots due.",
  },
  {
    id: "APT-003",
    service: "Grooming",
    petName: "Charlie",
    petType: "Dog",
    date: "2026-06-18",
    time: "9:00 AM",
    vet: "Grooming Team",
    status: "completed",
    notes: "Full groom + de-shedding treatment.",
  },
  {
    id: "APT-004",
    service: "Dental Care",
    petName: "Bella",
    petType: "Cat",
    date: "2026-06-25",
    time: "11:00 AM",
    vet: "Dr. Elena Petrova",
    status: "cancelled",
    notes: "Rescheduled to July 2.",
  },
  {
    id: "APT-005",
    service: "Surgery",
    petName: "Rocky",
    petType: "Dog",
    date: "2026-07-01",
    time: "8:00 AM",
    vet: "Dr. James Wilson",
    status: "pending",
    notes: "Neuter surgery — fasting required from midnight.",
  },
  {
    id: "APT-006",
    service: "General Checkup",
    petName: "Daisy",
    petType: "Dog",
    date: "2026-06-28",
    time: "3:30 PM",
    vet: "Dr. Sarah Miller",
    status: "confirmed",
    notes: "Follow-up on allergy treatment.",
  },
];

// ─── Appointment Card ─────────────────────────────────────────────────────────

const AppointmentCard = ({ appointment }) => {
  const Icon = getServiceIcon(appointment.service);

  return (
    <Card className="border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg dark:hover:border-slate-700/60 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 shrink-0">
              {Icon}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 transition-colors">
                {appointment.service}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {appointment.id} • {appointment.petName} ({appointment.petType})
              </CardDescription>
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock size={14} className="text-slate-400 dark:text-slate-500" />
            <span>{appointment.time}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <PawPrint size={14} className="text-slate-400 dark:text-slate-500" />
          <span>{appointment.vet}</span>
        </div>
        {appointment.notes && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-3">
            {appointment.notes}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex gap-2 flex-wrap">
        {appointment.status === "pending" && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg text-xs border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg text-xs border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Cancel
            </Button>
          </>
        )}
        {appointment.status === "confirmed" && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg text-xs"
          >
            Reschedule
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FilterTabs = ({ active, onChange }) => {
  const tabs = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            active === tab.key
              ? "bg-teal-600 dark:bg-teal-500 text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ filter }) => (
  <div className="text-center py-20 px-6">
    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
      <Calendar size={28} className="text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
      {filter === "all"
        ? "No appointments yet"
        : `No ${filter} appointments`}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
      {filter === "all"
        ? "Book your first appointment and we'll show it here."
        : `You don't have any ${filter} appointments at the moment.`}
    </p>
    <Link href="/services">
      <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">
        <Plus size={18} className="mr-2" />
        Book an Appointment
      </Button>
    </Link>
  </div>
);

// ─── Appointment Stats ────────────────────────────────────────────────────────

const StatsRow = ({ appointments }) => {
  const upcoming = appointments.filter(
    (a) => a.status === "confirmed" || a.status === "pending"
  ).length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: "Active", value: upcoming, color: "text-teal-600 dark:text-teal-400" },
        { label: "Completed", value: completed, color: "text-emerald-600 dark:text-emerald-400" },
        { label: "Cancelled", value: cancelled, color: "text-red-500 dark:text-red-400" },
      ].map((stat) => (
        <Card key={stat.label} className="border border-slate-100 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-sm text-center py-4">
          <CardContent className="p-0">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ─── Main My Appointments Page ─────────────────────────────────────────────────

export default function MyAppointmentsPage() {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Protect route — redirect to login if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-teal-600 dark:text-teal-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  // Filter logic
  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesFilter =
      filter === "all" || apt.status === filter;
    const matchesSearch =
      apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.vet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort by date (closest first)
  const sorted = [...filteredAppointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge>Dashboard</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 transition-colors">
              My Appointments
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Manage your pet care schedule — all in one place.
            </p>
          </div>
          <Link href="/services">
            <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer whitespace-nowrap">
              <Plus size={18} className="mr-2" />
              New Appointment
            </Button>
          </Link>
        </div>

        {/* ── Stats ── */}
        <StatsRow appointments={mockAppointments} />

        {/* ── Search & Filters ── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-sm"
            />
          </div>
          <FilterTabs active={filter} onChange={setFilter} />
        </div>

        {/* ── Appointments List ── */}
        {sorted.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {sorted.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        ) : (
          <EmptyState filter={filter} />
        )}

        {/* ── Info footer ── */}
        <div className="text-center py-6 border-t border-slate-100 dark:border-slate-800/40">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Need to change or cancel an appointment? Call us at{" "}
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              +1 (800) PAW-CARE
            </span>{" "}
            or reach out via{" "}
            <Link
              href="/contact"
              className="text-teal-600 dark:text-teal-400 underline underline-offset-2 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              Contact
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}