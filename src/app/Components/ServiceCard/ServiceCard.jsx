"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  X,
  Clock,
  PawPrint,
  ArrowUpRight,
  Star,
  ChevronRight,
  Dog,
  Cat,
  Bird,
  Rabbit,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Constants ────────────────────────────────────────────────────────────────
const PET_TYPE_ICONS = {
  Dogs: Dog,
  Cats: Cat,
  Birds: Bird,
  Rabbits: Rabbit,
  Reptiles: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2 1 3s-1 2-1 4c0 1.5 3 2 3 2s3-.5 3-2c0-2-1-3-1-4s1-1.5 1-3a3 3 0 0 0-3-3z" />
      <path d="M8 14c-1.5 1-3 2.5-3 5 0 1.5 2 2 2 2h10s2-.5 2-2c0-2.5-1.5-4-3-5" />
    </svg>
  ),
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80";

// ─── Sub‑components ───────────────────────────────────────────────────────────

const RatingStars = ({ rating = 4.5, count = 0 }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-300 dark:text-slate-600"
          }
        />
      ))}
    </div>
    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
      {rating}
      {count > 0 ? ` (${count})` : ""}
    </span>
  </div>
);

const PetTypeBadges = ({ types }) => {
  if (!types || types.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {types.map((type) => {
        const Icon = PET_TYPE_ICONS[type] || PawPrint;
        return (
          <span
            key={type}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md
                       bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                       border border-slate-200/60 dark:border-slate-700/40"
          >
            <Icon size={10} />
            {type}
          </span>
        );
      })}
    </div>
  );
};

const ServiceImage = ({ src, alt, className = "" }) => {
  const [imgError, setImgError] = useState(false);
  const imageSrc = !imgError && src ? src : FALLBACK_IMAGE;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 112px, 176px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
};

// ─── Modal Component ──────────────────────────────────────────────────────────
const ServiceDetailModal = ({ service, onClose }) => {
  const { data: session } = useSession();
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus trap & scroll lock
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          first?.focus();
          e.preventDefault();
        } else if (e.shiftKey && document.activeElement === first) {
          last?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus the modal container so tabbing starts inside
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900
                   rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90
                     backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white
                     dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Close modal"
        >
          <X size={18} className="text-slate-700 dark:text-slate-200" />
        </button>

        {/* Image & header */}
        <div className="relative w-full h-56 sm:h-72">
          <div className="w-full h-full rounded-t-3xl overflow-hidden">
            <ServiceImage
              src={service.image}
              alt={service.name}
              className="w-full h-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />
          <div className="absolute bottom-4 left-5 right-5 flex items-start justify-between gap-4">
            <div>
              <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white uppercase tracking-wider mb-2">
                {service.category}
              </span>
              <h2 className="text-2xl font-bold text-white">{service.name}</h2>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">${service.price}</p>
              <p className="text-xs text-white/80">{service.duration}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PetTypeBadges types={service.petTypes} />
            <RatingStars rating={4.8} count={24} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              About this service
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {service.description}
            </p>
          </div>

          {service.includes && service.includes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                What’s included
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {service.includes.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50
                               border border-slate-100 dark:border-slate-700/40"
                  >
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0 mt-0.5">
                      <PawPrint
                        size={10}
                        className="text-teal-600 dark:text-teal-400"
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.vet && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
                  {service.vet.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {service.vet.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {service.vet.credentials}
                </p>
              </div>
            </div>
          )}

          <Link
            href={session?.user ? "/dashboard/my-appointments" : "/auth/login"}
            className="block"
          >
            <Button className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base">
              {session?.user ? "Book Appointment" : "Sign In to Book"}
              <ArrowUpRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Main Service Card (Horizontal) ───────────────────────────────────────────
const ServiceCard = ({ service }) => {
  const [showDetail, setShowDetail] = useState(false);

  const openDetail = useCallback(() => setShowDetail(true), []);
  const closeDetail = useCallback(() => setShowDetail(false), []);

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openDetail();
        }}
        onClick={openDetail}
        className="group relative flex flex-row overflow-hidden border border-slate-200/80 dark:border-slate-700/60
                   bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg dark:shadow-slate-950/30
                   transition-all duration-300 rounded-2xl cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
      >
        {/* Left: Image panel */}
        <div className="relative w-28 sm:w-44 h-auto min-h-[130px] overflow-hidden shrink-0">
          <ServiceImage
            src={service.image}
            alt={service.name}
            className="w-full h-full rounded-l-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-l-2xl" />
          <span className="absolute top-2 left-2 inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-black/40 text-white uppercase tracking-wider backdrop-blur-sm">
            {service.category}
          </span>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-between flex-1 p-3 sm:p-4 gap-2 overflow-hidden">
          <div>
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-2">
              <h3
                className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1
                             group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
              >
                {service.name}
              </h3>
              <span className="text-sm sm:text-base font-black text-teal-600 dark:text-teal-400 shrink-0">
                ${service.price}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 mt-1 mb-2">
              <Clock size={12} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {service.duration}
              </span>
            </div>

            {/* Description snippet */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {service.description}
            </p>
          </div>

          {/* Footer: badges & details link */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <PetTypeBadges types={service.petTypes} />

            <button
              onClick={(e) => {
                e.stopPropagation();
                openDetail();
              }}
              className="flex items-center gap-0.5 text-[11px] font-bold text-slate-500 hover:text-teal-600
                         dark:text-slate-400 dark:hover:text-teal-400 transition-colors group/btn py-1 px-2 -mr-2 rounded-md
                         hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label={`View details of ${service.name}`}
            >
              Details
              <ChevronRight
                size={14}
                className="transition-transform group-hover/btn:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetail && (
        <ServiceDetailModal service={service} onClose={closeDetail} />
      )}
    </>
  );
};

export default ServiceCard;
