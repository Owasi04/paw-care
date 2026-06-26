"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { PlusCircle } from "lucide-react";
import AppointmentsTable from "@/app/Components/AppointmentsTable";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@base-ui/react";

const MyAppointments = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const {
    data: userAppointments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userAppointments", userEmail],
    queryFn: async () => {
      const res = await fetch(`/api/appointments?userMail=${userEmail}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
    enabled: !!userEmail,
  });

  const cancelAppointment = async (id) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to cancel");
  };

  const handleCancel = (id) => {
    if (!id) {
      console.error("ID mismatch");
      return;
    }

    toast.custom(
      (t) => (
        <div className="bg-white rounded-xl p-3 shadow-lg w-96 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="text-gray-800 mb-5">
            <h1 className="text-lg font-semibold tracking-tight">
              Cancel{" "}
              <span className="text-rose-600 font-bold">Appointment?</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-start">
            <Button
              className="cursor-pointer rounded-xl px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              No, keep it
            </Button>
            <Button
              className="cursor-pointer rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors shadow-sm"
              onClick={() => {
                toast.dismiss(t.id);
                cancelAppointment(id);
                toast.success("Your appointment has been cancelled.");
              }}
            >
              Yes, cancel
            </Button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        duration: 2000,
        style: { width: "100px" },
      },
    );
  };

  return (
    <main className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            My Appointments
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md">
            Keep track of your pet's health journeys and upcoming visits.
          </p>
        </div>

        <button className="bg-teal-800 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-label-md text-label-md hover:shadow-md transition-all active:scale-95 flex-shrink-0">
          {" "}
          <Link href={`/services`} className="inline-flex items-center gap-2">
            <PlusCircle size={20} className="text-current" />
            Book Appointment
          </Link>
        </button>
      </header>

      <AppointmentsTable
        appointments={userAppointments ?? []}
        isLoading={isLoading}
        isError={isError}
        onCancel={handleCancel}
      />
    </main>
  );
};

export default MyAppointments;
