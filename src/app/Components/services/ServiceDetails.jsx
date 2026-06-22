"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Tag,
  CalendarDays,
  CircleCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  getCategoryIcon,
  getInitials,
  FALLBACK_SERVICE_IMAGE,
} from "@/app/lib/serviceUtils";
import ServiceCard from "./ServiceCard";

// Expected GET /api/services/[id] response shape:
// {
//   _id, name, category, price, duration, petTypes: [],
//   image, description, includes: [], preparationNotes,
//   availability, badge,            // optional ribbon e.g. "Best Value"
//   vet: { name, credentials, photo },
//   relatedServices: [ { ...same shape, lighter } ]
// }

function useService(id) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await fetch(`/api/services/${id}`);
      if (!res.ok) throw new Error("Failed to load this service");
      return res.json();
    },
    enabled: !!id,
  });
}

export default function ServiceDetails({ id }) {
  console.log(" id of serviceDetials component ");
  const { data: session } = useSession();
  const { data: service, isLoading, isError, error, refetch } = useService(id);

  const handleBook = () => {
    if (!session?.user) {
      window.location.href = "/auth/login";
    } else {
      window.location.href = `/appointment?service=${encodeURIComponent(service.name)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 lg:py-12">
        <div className="mb-6 h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-72 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-64 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          We couldn&apos;t load this service.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error?.message ||
            "It may have been removed, or the link is incorrect."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const descriptionParagraphs = (service.description || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Services
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Main content ── */}
        <div className="lg:col-span-2">
          <Badge className="gap-1 bg-teal-50 text-teal-700 hover:bg-teal-50 dark:bg-teal-950/50 dark:text-teal-400">
            {React.createElement(getCategoryIcon(service.category), { className: "h-3.5 w-3.5" })}
            {service.category}
          </Badge>

          <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
            {service.name}
          </h1>

          <div className="relative mt-5 h-64 w-full overflow-hidden rounded-2xl bg-muted sm:h-80 lg:h-96">
            <Image
              src={service.image || FALLBACK_SERVICE_IMAGE}
              alt={service.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
          </div>

          {descriptionParagraphs.length > 0 && (
            <div className="mt-6 space-y-4 leading-relaxed text-slate-600 dark:text-slate-300">
              {descriptionParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {service.includes?.length > 0 && (
            <div className="mt-8 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/40">
              <h2 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">
                What&apos;s Included
              </h2>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.preparationNotes && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">
                Preparation Notes
              </h2>
              <div className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500 dark:bg-amber-950/20 dark:text-amber-200">
                {service.preparationNotes}
              </div>
            </div>
          )}

          {service.relatedServices?.length > 0 && (
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  Related Services
                </h2>
                <Link
                  href="/services"
                  className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  View All Services <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {service.relatedServices.map((rs) => (
                  <ServiceCard
                    key={rs._id ?? rs.id}
                    service={rs}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="gap-2 rounded-full border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/40"
            >
              <Link href="/services">
                <ArrowLeft className="h-4 w-4" /> Back to Services
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="rounded-2xl border-slate-200/80 dark:border-slate-700/60">
              <CardContent className="p-5">
                {service.badge && (
                  <div className="mb-3 flex justify-end">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400">
                      {service.badge}
                    </Badge>
                  </div>
                )}

                <Button
                  onClick={handleBook}
                  size="lg"
                  className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  Book This Service
                </Button>

                <div className="mt-5 space-y-4 border-t pt-4">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {service.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        ${service.price} / session
                      </p>
                    </div>
                  </div>
                  {service.availability && (
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Availability
                        </p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {service.availability}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {service.vet && (
              <Card className="rounded-2xl border-slate-200/80 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/40">
                <CardContent className="flex items-center gap-3 p-5">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={service.vet.photo}
                      alt={service.vet.name}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400">
                      {getInitials(service.vet.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Your Groomer
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {service.vet.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.vet.credentials}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
