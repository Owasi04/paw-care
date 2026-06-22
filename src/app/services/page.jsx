"use client";
export const dynamic = "force-dynamic";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import ServiceCard from "../Components/services/ServiceCard";

const ServicesPage = () => {
  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to load services");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Failed to load services
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service?._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
