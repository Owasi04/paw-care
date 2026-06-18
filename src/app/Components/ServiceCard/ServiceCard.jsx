"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Clock,
  Heart,
  CircleCheck,
  PawPrint,
  Dog,
  Cat,
  Scissors,
  Stethoscope,
  GraduationCap,
  Footprints,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ─── Constants & Helpers ─────────────────────────────────────────────────────

const CATEGORY_ICONS = {
  Grooming: Scissors,
  Veterinary: Stethoscope,
  "Health Checkup": Stethoscope,
  Training: GraduationCap,
  Walking: Footprints,
};

const PET_TYPE_ICONS = {
  Dogs: Dog,
  Dog: Dog,
  Cats: Cat,
  Cat: Cat,
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80";

function getInitials(name = "") {
  return name
    .replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// ─── ServiceImage Component ──────────────────────────────────────────────────

const ServiceImage = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);
  const imageSrc = !imgError && src ? src : FALLBACK_IMAGE;

  return (
    <div className="relative h-52 w-full overflow-hidden bg-muted flex-shrink-0">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
};

// ─── Main ServiceCard ────────────────────────────────────────────────────────

export default function ServiceCard({ service, onBook, className }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  const CategoryIcon = CATEGORY_ICONS[service.category] ?? PawPrint;

  const handleBook = () => {
    if (onBook) {
      onBook(service);
    } else if (!session?.user) {
      window.location.href = "/auth/login";
    } else {
      window.location.href = `/appointment?service=${encodeURIComponent(service.name)}`;
    }
  };

  return (
    <Card
      className={cn(
        "group w-full max-w-sm overflow-hidden transition-all hover:shadow-xl border border-slate-200/80 dark:border-slate-700/60 rounded-2xl flex flex-col h-full",
        className,
      )}
    >
      {/* Image - Full top, no gap */}
      <div className="relative flex-shrink-0">
        <ServiceImage src={service.image} alt={service.name} />

        {/* Category Badge */}
        <Badge className="absolute left-3 top-3 gap-1 bg-background/90 text-foreground backdrop-blur hover:bg-background/90 z-10">
          <CategoryIcon className="h-3.5 w-3.5" />
          {service.category}
        </Badge>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite((prev) => !prev);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 z-10"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-foreground",
            )}
          />
        </button>
      </div>

      {/* Content - Grows to fill remaining space */}
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-lg leading-tight text-slate-800 dark:text-slate-100">
                {service.name}
              </CardTitle>
              <div className="shrink-0 text-right">
                <p className="text-xl font-bold leading-none text-teal-600 dark:text-teal-400">
                  ${service.price}
                </p>
                <p className="text-xs text-muted-foreground">per session</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {service.duration}
              </span>
              {service.petTypes?.map((type) => {
                const Icon = PET_TYPE_ICONS[type] ?? PawPrint;
                return (
                  <span key={type} className="flex items-center gap-1">
                    <Icon className="h-3.5 w-3.5" />
                    {type}
                  </span>
                );
              })}
            </div>

            <CardDescription className="line-clamp-2 text-slate-500 dark:text-slate-400">
              {service.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            What&apos;s included
          </p>
          <ul className="space-y-1.5">
            {service.includes?.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="mt-auto border-t pt-4">
          <div className="flex items-center justify-between w-full gap-3">
            {service.vet && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400">
                    {getInitials(service.vet.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium leading-tight text-slate-800 dark:text-slate-100">
                    {service.vet.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {service.vet.credentials}
                  </p>
                </div>
              </div>
            )}

            <Button
              size="sm"
              onClick={handleBook}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 whitespace-nowrap"
            >
              Book Now
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
