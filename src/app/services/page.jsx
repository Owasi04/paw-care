"use client";
import React, { useState, useEffect } from "react";
import { Search, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/app/Components/ServiceCard/ServiceCard";

// ─── Badge component ──────────────────────────────────────────────────────────

const Badge = ({ children }) => (
  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/30">
    {children}
  </span>
);

// ─── Search / Filter (Streamlined paddings) ───────────────────────────────────

const ServiceFilters = ({
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  categories,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-xs"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          key="All"
          onClick={() => setActiveCategory("All")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeCategory === "All"
              ? "bg-teal-600 dark:bg-teal-500 text-white shadow"
              : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-teal-600 dark:bg-teal-500 text-white shadow"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── CTA Section (Reduced Padding & Height) ───────────────────────────────────

const CTA = () => (
  <section className="rounded-[2.5rem] px-6 py-10 md:py-12 text-center bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-950/60 dark:to-teal-900/40 text-white dark:text-slate-100 border border-transparent dark:border-teal-900/30 shadow-xl shadow-teal-900/5 transition-colors">
    <div className="max-w-2xl mx-auto space-y-4">
      <Badge>Not sure what you need?</Badge>
      <h2 className="text-2xl md:text-3xl font-bold leading-tight">
        Let us help you find the right care
      </h2>
      <p className="text-teal-50/80 dark:text-teal-300/80 text-sm max-w-lg mx-auto">
        Call us or book a free 10-minute consultation with our team.
      </p>
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <Link href="/contact">
          <Button className="bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold px-6 py-5 rounded-full shadow hover:shadow-md transition-all cursor-pointer text-sm">
            Contact Us
          </Button>
        </Link>
        <Link href="/about">
          <Button
            variant="outline"
            className="border-white/40 dark:border-teal-500/40 text-white dark:text-teal-400 hover:bg-white/10 dark:hover:bg-teal-950/20 font-bold px-6 py-5 rounded-full transition-all text-sm"
          >
            Learn About Us
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

// ─── Main Services Page ───────────────────────────────────────────────────────

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch services from API
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Extract unique categories from data
  const categories = [
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  // Filtering logic
  const filtered = services.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase()) ||
      service.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <div className="mx-auto px-6 py-8 md:py-12 space-y-12">
        {/* ── Hero (Compact Padding) ── */}
        <section className="bg-teal-50/40 dark:bg-teal-950/10 rounded-[2rem] px-6 py-10 md:py-14 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <Badge>Our Services</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-50 leading-tight transition-colors">
              Compassionate care for{" "}
              <span className="text-teal-600 dark:text-teal-400">
                every stage
              </span>{" "}
              of life
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto transition-colors">
              From routine checkups to advanced surgery — our team provides the
              full spectrum of veterinary services in a calm, pet-friendly
              environment.
            </p>
          </div>
        </section>

        {/* ── Filters ── */}
        {!loading && !error && (
          <ServiceFilters
            search={search}
            setSearch={setSearch}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
          />
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2
              size={28}
              className="animate-spin text-teal-600 dark:text-teal-400"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Loading services...
            </p>
          </div>
        )}

        {/* ── Error State ── */}
        {error && (
          <div className="text-center py-16 px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <AlertTriangle
                size={24}
                className="text-red-500 dark:text-red-400"
              />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              Could not load services
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              {error}. Please make sure services have been added to the
              database.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold px-5 py-2 rounded-full shadow hover:shadow-md transition-all cursor-pointer text-xs"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ── Services Grid (Adjusted for wider, horizontal cards) ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {filtered.map((service) => (
              <ServiceCard key={service._id || service.id} service={service} />
            ))}
          </div>
        )}

        {/* ── Empty Result ── */}
        {!loading && !error && filtered.length === 0 && services.length > 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 dark:text-slate-500 text-base font-medium">
              No services match your search. Try a different keyword.
            </p>
          </div>
        )}

        {/* ── Empty Database ── */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 dark:text-slate-500 text-base font-medium">
              No services available yet. Check back soon!
            </p>
          </div>
        )}

        {/* ── CTA ── */}
        <CTA />
      </div>
    </div>
  );
}
