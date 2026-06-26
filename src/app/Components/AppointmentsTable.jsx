"use client";
import { useState } from "react";
import {
  XCircle,
  PawPrint,
  AlertCircle,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { Trash2Icon, TrashIcon } from "@animateicons/react/lucide";
import { useQuery } from "@tanstack/react-query";

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = ["All", "Pending", "Completed", "Cancelled"];

const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
    dot: true,
  },
  Completed: {
    label: "Completed",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  },
  Cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900",
  },
};

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PetAvatar({ petType, petName }) {
  const initials = petName
    ? petName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center flex-shrink-0 ring-2 ring-surface-variant dark:ring-surface-variant/70">
      <span className="text-on-primary-fixed text-xs font-semibold">
        {initials}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[capitalize(status)];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${config.badgeClass}`}
    >
      {config.dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
      )}
      {config.label}
    </span>
  );
}

function AppointmentRow({ appointment, onCancel }) {
  const {
    petName = "Unknown",
    petType = "",
    petBreed = "",
    appointmentDate = "",
    appointmentTime = "",
    serviceName = "—",
    status = "",
    userName = "",
  } = appointment;

  // Format date for display
  const displayDate = appointmentDate
    ? new Date(
        appointmentDate + "T" + (appointmentTime || "00:00"),
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  // Format time for display
  const displayTime = appointmentTime
    ? new Date(`2000-01-01T${appointmentTime}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <tr className="hover:bg-surface-bright dark:hover:bg-zinc-800 transition-colors">
      {/* Pet */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <PetAvatar petType={petType} petName={petName} />
          <div>
            <p className="font-label-md text-on-surface leading-tight">
              {petName}
            </p>
            <p className="text-label-sm text-on-surface-variant leading-tight">
              {petType}
              {petBreed ? ` · ${petBreed}` : ""}
            </p>
          </div>
        </div>
      </td>

      {/* Owner */}
      <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
        {userName}
      </td>

      {/* Service */}
      <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
        {serviceName || "—"}
      </td>

      {/* Date & Time */}
      <td className="px-6 py-4">
        <p className="font-label-md text-on-surface">{displayDate}</p>
        {displayTime && (
          <p className="text-label-sm text-on-surface-variant">{displayTime}</p>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-1">
          {(status === "pending" || status === "Pending") && (
            <button
              onClick={() => onCancel(appointment?._id)}
              title="Cancel appointment"
              className="flex items-center cursor-pointer border gap-1 p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error dark:hover:bg-rose-950 dark:hover:text-rose-400 transition-all active:scale-95 border-surface-variant dark:border-zinc-700"
            >
              <span>Cancel</span>
              <TrashIcon size={20} className="text-current" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function SkeletonRows() {
  return Array.from({ length: 3 }).map((_, i) => (
    <tr key={i} className="border-b border-surface-variant dark:border-zinc-800">
      {Array.from({ length: 6 }).map((_, j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-4 bg-surface-container-low dark:bg-zinc-800 rounded-full animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  ));
}

// ─── Main Exported Component ────────────────────────────────────────────────

export default function AppointmentsTable({
  isLoading = false,
  isError = false,
  onCancel = () => {},
}) {
  const [activeTab, setActiveTab] = useState("All");

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments", activeTab],
    queryFn: async () => {
      const url =
        activeTab === "All"
          ? "/api/appointments"
          : `/api/appointments?status=${activeTab.toLowerCase()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filtered = appointments;

  function getCount(tab) {
    if (tab === "All") return appointments.length;
    return appointments.filter((a) => a.status === tab).length;
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit mb-6 border border-surface-variant dark:border-zinc-800 bg-surface-container-low dark:bg-zinc-900">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const count = getCount(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                isActive
                  ? "bg-rose-600 text-white shadow-sm border border-rose-600"
                  : "text-on-surface-variant hover:bg-surface-container dark:hover:bg-zinc-800"
              }`}
            >
              {tab}
              {count > 0 && (
                <span
                  className={`text-xs font-semibold rounded-full px-1.5 py-0.5 leading-none ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface-container dark:bg-zinc-800 text-on-surface-variant"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <AlertCircle size={48} className="text-error mb-4" />
            <p className="font-label-md text-on-surface mb-1">
              Couldn't load appointments
            </p>
            <p className="text-label-sm text-on-surface-variant">
              Please try refreshing the page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-zinc-950 border-b border-surface-variant dark:border-zinc-800">
                  {[
                    "Pet",
                    "Owner",
                    "Service",
                    "Date & Time",
                    "Status",
                    "Action",
                  ].map((col, i) => (
                    <th
                      key={i}
                      className={`px-6 py-3.5 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant ${
                        i === 5 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant dark:divide-zinc-800">
                {isLoading ? (
                  <SkeletonRows />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}></td>
                  </tr>
                ) : (
                  filtered.map((appt) => (
                    <AppointmentRow
                      key={appt._id}
                      appointment={appt}
                      onCancel={onCancel}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}