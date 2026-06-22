"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { PlusCircle } from "lucide-react";
import AppointmentsTable from "@/app/Components/AppointmentsTable";

const MyAppointments = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const {
    data: userAppointments,
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

  function handleView(appointment) {
    // TODO: open detail modal or navigate to /appointments/[id]
    console.log("View:", appointment);
  }

  function handleCancel(id) {
    // TODO: call PATCH /api/appointments/[id] { status: "Cancelled" }
    //       then invalidate the query with queryClient.invalidateQueries(...)
    console.log("Cancel:", id);
  }

  function handleBook() {
    // TODO: navigate to /book or open booking modal
    console.log("Open booking flow");
  }

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

        <button
          onClick={handleBook}
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-label-md hover:bg-primary/90 hover:shadow-md transition-all active:scale-95 flex-shrink-0"
        >
          <PlusCircle size={20} className="text-current" />
          Book Appointment
        </button>
      </header>

      <AppointmentsTable
        appointments={userAppointments ?? []}
        isLoading={isLoading}
        isError={isError}
        onView={handleView}
        onCancel={handleCancel}
        onBook={handleBook}
      />
    </main>
  );
};

export default MyAppointments;