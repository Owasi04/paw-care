"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowRightCircle } from "lucide-react";
import { Button } from "@base-ui/react";
import Link from "next/link";

const Badge = ({ children }) => (
  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/30">
    {children}
  </span>
);

const TeamCard = ({ name, role, desc, image }) => {
  const validSrc = image && image.trim() !== "" ? image : "/petsBG.jpg";

  return (
    <Card className="overflow-hidden border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm group hover:shadow-xl dark:hover:border-slate-700/60 transition-all duration-300 h-full flex flex-col">
      <div className="relative w-full h-72 flex-shrink-0">
        <Image
          src={validSrc}
          alt={name || "Veterinarian"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="font-bold text-lg leading-none">{name}</p>
          <p className="text-teal-400 dark:text-teal-300 text-sm font-medium mt-1">
            {role}
          </p>
        </div>
      </div>
      <CardContent className="p-5 flex-grow">
        <CardDescription className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {desc}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const Team = () => {
  const { data: vets = [] } = useQuery({
    queryKey: ["vets"],
    queryFn: async () => {
      const limit = 3;
      const res = await fetch(`/api/vet?limit=${limit}`);
      return res.json();
    },
  });

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-xl">
          <Badge>Expert Team</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
            Meet our specialized vet team
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors">
            A diverse group of professionals united by a genuine love for
            animals.
          </p>
        </div>
        <Button className=" px-6 py-3 rounded-xl border-2 border-teal-600 text-teal-600 hover:bg-teal-50/50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/20 transition-all cursor-pointer whitespace-nowrap self-start">
          <Link href={`/vets`} className="flex items-center gap-2">
            <span className="font-bold">View all specialists </span>{" "}
            <ArrowRightCircle className="duration-150 transition" />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {vets.map((v) => (
          <TeamCard
            key={v._id || v.display_name}
            name={v.display_name}
            role={
              Array.isArray(v.credentials)
                ? v.credentials.join(", ")
                : v.credentials
            }
            desc={v.bio}
            image={v.images?.primary || v.images?.alternatives?.[0]}
          />
        ))}
      </div>
    </section>
  );
};

export default Team;
