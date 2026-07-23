"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const VETInfo = () => {
  const {
    data: vets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vets"],
    queryFn: async () => {
      const res = await fetch(`/api/vet`);
      if (!res.ok) throw new Error("Failed to fetch veterinarians");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400 bg-white dark:bg-gray-950">
        Error loading veterinarians. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Veterinary Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compassionate professionals dedicated to the health and happiness of
            your pets
          </p>
        </div>

        {/* Vets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {vets.map((vet) => (
            <div
              key={vet._id || vet.display_name}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/30 overflow-hidden hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-gray-700/50"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                <Image
                  src={vet.images.primary}
                  alt={vet.display_name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  {vet.licensing?.status || vet.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {vet.display_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {vet.credentials.map((cred, i) => (
                        <span
                          key={i}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-md"
                        >
                          {cred}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {vet.specializations.slice(0, 3).map((spec, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                  {vet.specializations.length > 3 && (
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                      +{vet.specializations.length - 3}
                    </span>
                  )}
                </div>

                {/* Experience & Rating */}
                <div className="flex justify-between items-center mb-5 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-2xl text-amber-600 dark:text-amber-400">
                      {vet.experience_years}
                    </span>
                    <span>years exp.</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-500">
                      {"★".repeat(Math.floor(vet.rating.average))}
                      {vet.rating.average % 1 >= 0.5 && "½"}
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {vet.rating.average}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      ({vet.rating.count})
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 dark:text-gray-300 line-clamp-4 mb-6 text-[15px] leading-relaxed flex-1">
                  {vet.bio}
                </p>

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors font-medium py-3.5 rounded-xl text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {vets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-xl">No veterinarians found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VETInfo;