"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { PlusCircle } from "lucide-react";
import AppointmentsTable from "@/app/Components/AppointmentsTable";
import Link from "next/link";

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

  // console.log(userAppointments);

  function handleCancel(id) {
    console.log("Cancel:", id);
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
