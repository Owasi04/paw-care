import Image from "next/image";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const vets = [
  {
    name: "Dr. Sarah Miller",
    role: "Senior Veterinarian",
    desc: "Specializing in internal medicine and senior pet care.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUU2F8WoQco9hGt6IW8MHeqmwm25yKQxxnyfqSkHTwsf04DVQDR25ZmTmpcL4edJF2Dwk9OMR5R7eS_GUdZadH2HVJxsJOhZJMQfz1r9TRTlOxK9ECqujcIDJ7l3_q2ZvQ7Px7Db2FUensK1VXFDMYxLeqgOtyE_aaZ3G-BDsl3FZ8HSy0T2pbWpTX3YMEjKNqffrG8Tc9IaDe_PSd-cDDekbTziR9S6QE2FlN1EBjJrnOYBHwUy32rTuBtdP6WR1mDgI_zRZCrpg",
  },
  {
    name: "Dr. James Wilson",
    role: "Veterinary Surgeon",
    desc: "Expert in soft tissue surgery and orthopedic procedures.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7YOHlOG00C1JkBgafYX58wiy_M95l_xW4RKVkF8gRg50KWYglauKH1XNMfgOGUzNcCPnUYX7kjSFXJWKfDNyN08KJYAfS4QzQE__mpEc6AJwuzdA_uGC4pSPkJX3P8PPsBZ7Bt0Qm26FcQgoH6CCLuKEPW6fzW3GIzUnK7p3ht_shiGoWY9y4xAOPWnElPVKCWwpQ3094ACLstt-gNfw3Bu22qGpiG-Owld2yPxZGj2SgsDBUH1WrNvG2z5Qge4ONm7OleEZP5HU",
  },
  {
    name: "Dr. Elena Petrova",
    role: "Dermatology Specialist",
    desc: "Focused on allergy management and skin health treatments.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHMw72MUrbbexF-COS-AhtrWZ4KdJ02nH-_nAg77_dUfl6wgAlgQLZTWm9HzTWEiocrhV6lpb8FGJsWqoI9Gfxmuqr3AZwl8H1-TxOkwF6H3FoJ3FxVOmeOFvnOs_kekUI9Xij8L1rgCAhnCKbIcr1nIE6pK9seoJBfMjCY8I52w9O1w3pS94hxNHYsNFuQVlmrhcaitr_1zUS8akjt77Nb6nbrtIHkwVa6goeP6tFuNRLTuKA6SqF9BNttylgDwacfr_AfOeodI",
  },
];

const VetCard = ({ name, role, desc, img }) => (
  <Card className="bg-white dark:bg-surface-container-low/80 rounded-[24px] overflow-hidden group shadow-md dark:shadow-lg transition-colors border-0 p-0">
    <div className="h-80 overflow-hidden">
      <Image
        width={400}
        height={400}
        alt={name}
        src={img}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <CardContent className="p-6">
      <h4 className=" text-lg font-bold text-slate-700">
        {name}
      </h4>
      <p className="text-slate-600 mb-2">
        {role}
      </p>
      <p className="text-slate-500 text-sm">
        {desc}
      </p>
    </CardContent>
  </Card>
);

const VetTeam = () => {
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
          {vets.map((vet) => (
            <VetCard key={vet.name} {...vet} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VetTeam;
