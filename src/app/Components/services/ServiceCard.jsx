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

// ─── Icon helpers ─────────────────────────────────────────────────────────

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
      window.location.href = `/appointment?service=${encodeURIComponent(serviceId)}`;
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

  // ── Default: properly structured with shadcn card tags ──
  return (
    <Card
      className={cn(
        "relative gap-0 py-0 rounded-2xl group hover:shadow-2xl duration-300 flex flex-col h-full",
        className,
      )}
    >
      {/* ── Image section ── */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link href={`/services/${serviceId}`}>
          <div className="w-full h-72">
            <Image
              src={service.image ?? FALLBACK_SERVICE_IMAGE}
              alt={service.name}
              width={440}
              height={300}
              className="w-full h-full object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-125 transition duration-300 delay-75"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_SERVICE_IMAGE;
              }}
            />
          </div>
        </Link>

        {/* Hover arrow – now relative to image container */}
        <div className="absolute top-3 right-3 hidden p-3 bg-white rounded-full group-hover:block z-10">
          <Link href={`/services/${serviceId}`}>
            <ArrowRight className="h-4 w-4 text-card-foreground" />
          </Link>
        </div>

        {/* Category badge */}
        <Badge className="absolute left-3 top-3 gap-1 bg-background/90 text-foreground backdrop-blur hover:bg-background/90 z-10">
          <CategoryIconDisplay
            category={service.category}
            className="h-3.5 w-3.5"
          />
          {service.category}
        </Badge>

        {/* Favourite button – now at the bottom-right of the image */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite((prev) => !prev);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 z-10"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-foreground",
            )}
          />
        </button>
      </div>

      {/* ── CardContent (main details) ── */}
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex justify-between gap-5 mb-6">
          <div>
            <Link href={`/services/${serviceId}`}>
              <h3 className="text-xl font-medium duration-300 group-hover:text-primary">
                {service.name}
              </h3>
            </Link>
          </div>
          <Badge className="px-5 py-4 text-base font-normal rounded-full bg-teal-500/10 text-teal-500 shrink-0 self-start">
            ${service.price}
          </Badge>
        </div>

        <div className="flex">
          <div className="flex flex-col gap-2 max-sm:pr-4 pr-8 border-e border-border">
            <CategoryIconDisplay
              category={service.category}
              className="w-5 h-5"
            />
            <p className="text-sm sm:text-base">{service.category}</p>
          </div>

          <div className="flex flex-col gap-2 max-sm:px-4 px-8 border-e border-border">
            <Clock className="w-5 h-5" />
            <p className="text-sm sm:text-base">{service.duration}</p>
          </div>

          <div className="flex flex-col gap-2 max-sm:pl-4 pl-8">
            <PetTypeIconDisplay
              type={service.petTypes?.[0]}
              className="w-5 h-5"
            />
            <p className="text-sm sm:text-base">
              {service.petTypes?.join(", ") ?? "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 my-2 mt-auto">
        <Button
          onClick={handleBook}
          className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
