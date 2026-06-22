"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Clock, Heart, ArrowRight, PawPrint } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_ICONS,
  PET_TYPE_ICONS,
  FALLBACK_SERVICE_IMAGE,
} from "@/app/lib/serviceUtils";

// ─── Icon helpers (declared outside render to avoid React lint errors) ──

function CategoryIconDisplay({ category, className }) {
  const Icon = CATEGORY_ICONS[category] ?? PawPrint;
  return <Icon className={className} />;
}

function PetTypeIconDisplay({ type, className }) {
  const Icon = PET_TYPE_ICONS[type] ?? PawPrint;
  return <Icon className={className} />;
}

// ─── ServiceImage ─────────────────────────────────────────────────────────

function ServiceImage({ src, alt, compact }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = !imgError && src ? src : FALLBACK_SERVICE_IMAGE;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted flex-shrink-0",
        compact ? "h-36" : "h-48",
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={
          compact
            ? "(max-width: 768px) 100vw, 300px"
            : "(max-width: 768px) 100vw, 400px"
        }
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
}

// ─── ServiceCard ──────────────────────────────────────────────────────────

export default function ServiceCard({
  service,
  onBook,
  className,
  variant = "default", // "default" | "compact"
}) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  const serviceId = service?.id ?? service?._id;

  const handleBook = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (onBook) {
      onBook(service);
    } else if (!session?.user) {
      window.location.href = "/auth/login";
    } else {
      window.location.href = `/appointment?service=${encodeURIComponent(service.name)}`;
    }
  };

  // ── Compact: used for "Related Services" grids ──
  if (variant === "compact") {
    return (
      <Link href={`/services/${serviceId}`} className="block h-full">
        <Card
          className={cn(
            "group h-full overflow-hidden border border-slate-200/80 dark:border-slate-700/60 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5",
            className,
          )}
        >
          <ServiceImage src={service.image} alt={service.name} compact />
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
              {service.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {service.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                ${service.price}
              </span>
              {service.duration && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-normal"
                >
                  <Clock className="h-3 w-3" />
                  {service.duration}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // ── Default: main services grid ──
  return (
    <Card
      className={cn(
        "group w-full max-w-sm overflow-hidden transition-all hover:shadow-xl border border-slate-200/80 dark:border-slate-700/60 rounded-2xl flex flex-col h-full",
        className,
      )}
    >
      <div className="relative flex-shrink-0">
        <ServiceImage src={service.image} alt={service.name} />

        <Badge className="absolute left-3 top-3 gap-1 bg-background/90 text-foreground backdrop-blur hover:bg-background/90 z-10">
          <CategoryIconDisplay
            category={service.category}
            className="h-3.5 w-3.5"
          />
          {service.category}
        </Badge>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
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

      <CardContent className="flex flex-1 flex-col gap-2 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-tight font-semibold text-slate-800 dark:text-slate-100">
            {service.name}
          </h3>
          <div className="shrink-0 text-right">
            <p className="text-xl font-bold leading-none text-teal-600 dark:text-teal-400">
              ${service.price}
            </p>
            <p className="text-xs text-muted-foreground">per session</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration}
          </span>
          {service.petTypes?.map((type) => (
            <span key={type} className="flex items-center gap-1">
              <PetTypeIconDisplay type={type} className="h-3.5 w-3.5" />
              {type}
            </span>
          ))}
        </div>

        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {service.description}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex items-center gap-2 border-t pt-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/40"
        >
          <Link href={`/services/${serviceId}`}>
            View Details
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          size="sm"
          onClick={handleBook}
          className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
