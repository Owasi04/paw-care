"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ServiceCard from "../services/ServiceCard";

const OurServices = () => {
  const { data: OurServices = [] } = useQuery({
    queryKey: ["OurServices"],
    queryFn: async () => {
      const limit = 4;
      const res = await fetch(`/api/services?limit=${limit}`);
      return res.json();
    },
  });

  return (
    <div className="bg-[#e2bbac] p-4 rounded-2xl">
      {/* header */}
      <div className="my-5">
        <h1 className="text-6xl font-semibold">Our service</h1>
        <p className="text-xl font-medium">
          Here you can choose awasome services from ours for your happy pet's
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
        {OurServices.map((service) => (
          <ServiceCard key={service?._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default OurServices;
