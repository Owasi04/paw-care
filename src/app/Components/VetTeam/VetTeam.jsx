"use client";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Star } from "lucide-react";

const VetCard = ({ vet }) => {
  if (!vet) return null;

  const {
    display_name,
    credentials = [],
    status,
    rating = {},
    experience_years,
    specializations = [],
    bio,
    images,
  } = vet;

  const primaryImage =
    images?.primary || images?.alternatives?.[0] || "/petsBG.jpg";

  return (
    <Card className="group max-w-lg overflow-hidden rounded-3xl border-0 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={primaryImage}
          alt={display_name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status */}
        <Badge
          className={`absolute top-4 right-4 capitalize ${
            status === "active"
              ? "bg-emerald-600 hover:bg-emerald-600"
              : "bg-red-600 hover:bg-red-600"
          }`}
        >
          {status}
        </Badge>
      </div>

      <CardContent className="space-y-4 p-6">
        {/* Name */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {display_name}
          </h3>

          <p className="text-sm text-primary font-medium">
            {credentials.join(", ")}
          </p>
        </div>

        {/* Rating & Experience */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating.average ?? "N/A"}</span>
            <span>({rating.count ?? 0})</span>
          </div>

          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{experience_years ?? 0} Years</span>
          </div>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2">
          {specializations.map((specialization) => (
            <Badge
              key={specialization}
              variant="secondary"
              className="rounded-full"
            >
              {specialization}
            </Badge>
          ))}
        </div>

        {/* Bio */}
        <p className="line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {bio}
        </p>
      </CardContent>
    </Card>
  );
};

const VetTeam = () => {
  const { data: vetsCollection = [] } = useQuery({
    queryKey: ["vetsColection"],
    queryFn: async () => {
      const limit = 3
      const res = await fetch(`/api/vet?limit=${limit}`);
      return res.json();
    },
  });
  return (
    <section className=" py-24 transition-colors">
      <div className=" mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="text-left text-on-primary dark:text-on-primary/90 max-w-xl">
            <h2 className="font-medium text-3xl mb-4">
              Meet the world-class team behind PawCare
            </h2>
            <p className="opacity-90 dark:opacity-80">
              Our experts combine decades of veterinary experience with a
              genuine love for animals.
            </p>
          </div>
          <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary-container/20 dark:hover:bg-primary-container/30 transition-colors cursor-pointer">
            View All Team
          </button>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {vetsCollection.map((vet) => (
            <VetCard key={vet._id || vet.display_name} vet={vet} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VetTeam;
