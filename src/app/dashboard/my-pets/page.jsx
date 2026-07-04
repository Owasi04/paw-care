"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import { PawPrint, AlertTriangle } from "lucide-react";
import PetCard from "../components/petCards";

const Mypets = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const {
    data: ownerPets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ownerPets", user?.name],
    queryFn: async () => {
      const res = await fetch(`/api/pets?ownerName=${encodeURIComponent(user?.name || "")}`);
      if (!res.ok) {
        throw new Error("Failed to fetch pets");
      }
      return res.json();
    },
    enabled: Boolean(user?.name),
  });

  const pets = Array.isArray(ownerPets) ? ownerPets : [];

  return (
    <div className="min-h-full bg-[#EEF1EC] px-4 py-6 dark:bg-[#141B17] sm:px-6">
      <header className="mb-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#6E8577] dark:text-[#7FA08D]">
          Pet record
        </p>
        <h1 className="font-serif text-2xl text-[#1C2621] dark:text-[#E7ECE7]">
          My pets
        </h1>
        <p className="mt-1 text-sm text-[#5B6B61] dark:text-[#93A399]">
          Registered under{" "}
          <span className="font-medium text-[#1C2621] dark:text-[#E7ECE7]">
            {user?.name || "your account"}
          </span>
        </p>
      </header>

      {isLoading ? (
        <PetGridSkeleton />
      ) : isError ? (
        <ErrorState message={error?.message} />
      ) : pets.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet?._id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
};

function PetGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          aria-hidden
          className="animate-pulse rounded-xl border border-[#D8DED4] bg-[#FBFAF7] p-4 dark:border-[#2E3A33] dark:bg-[#1E2822]"
        >
          <div className="mb-3 h-28 rounded-lg bg-[#E4E9DF] dark:bg-[#28352E]" />
          <div className="mb-2 h-4 w-3/4 rounded bg-[#E4E9DF] dark:bg-[#28352E]" />
          <div className="h-3 w-1/2 rounded bg-[#E4E9DF] dark:bg-[#28352E]" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E3B8A8] bg-[#FBF1EC] p-4 dark:border-[#6B4433] dark:bg-[#241A15]">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#A15A3A] dark:text-[#D98F6B]" />
      <div>
        <p className="text-sm font-medium text-[#8A4223] dark:text-[#E0A583]">
          Could not load your pets
        </p>
        <p className="mt-1 text-xs text-[#A1745F] dark:text-[#B8907C]">
          {message || "Something went wrong. Refresh the page to try again."}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#C4CCC0] px-6 py-14 text-center dark:border-[#3A4740]">
      <PawPrint className="h-8 w-8 text-[#9FAC98] dark:text-[#516156]" />
      <p className="mt-3 text-sm font-medium text-[#1C2621] dark:text-[#E7ECE7]">
        No pets on record yet
      </p>
      <p className="mt-1 max-w-xs text-xs text-[#5B6B61] dark:text-[#93A399]">
        Pets added to your account will show up here.
      </p>
    </div>
  );
}

export default Mypets;