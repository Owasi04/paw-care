import React from "react";
import {
  PawPrint,
  Heart,
  ShieldCheck,
  Atom,
  Accessibility,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ArrowUpRight,
  Users,
  Award,
  CalendarCheck,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── Reusable tiny components ────────────────────────────────────────────────

const Badge = ({ children }) => (
  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/30">
    {children}
  </span>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <Card className="border border-slate-100 dark:border-slate-800/40 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md dark:hover:border-slate-700/60 transition-all">
    <CardContent className="pt-6 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 transition-colors">
        {value}
      </span>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
        {label}
      </span>
    </CardContent>
  </Card>
);

const TeamCard = ({ name, role, desc, image }) => {
  const validSrc =
    image && image.trim() !== ""
      ? image
      : "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=500";

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

const ValueCard = ({ icon: Icon, title, desc }) => (
  <Card className="border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm hover:ring-2 ring-teal-500/10 dark:ring-teal-400/10 transition-all">
    <CardHeader className="flex flex-row items-center gap-4 pb-2">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
        <Icon size={20} />
      </div>
      <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-slate-500 dark:text-slate-400 leading-relaxed">
        {desc}
      </CardDescription>
    </CardContent>
  </Card>
);

// ─── Page sections ────────────────────────────────────────────────────────────

const Hero = () => (
  <section className="bg-teal-50/40 dark:bg-teal-950/10 rounded-[2.5rem] px-8 py-16 md:py-24 text-center relative overflow-hidden">
    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
      <Badge>About PawCare</Badge>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-50 leading-[1.1] transition-colors">
        We treat your pets like <span className="text-teal-600 dark:text-teal-400">family.</span>
      </h1>
      <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto transition-colors">
        Founded in 2012, PawCare has grown from a neighbourhood clinic into a
        full-service veterinary centre trusted by thousands of families.
      </p>
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group">
          Book an Appointment
          <ArrowUpRight
            size={18}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
        <button className="font-bold px-8 py-4 rounded-full border-2 border-teal-600 text-teal-600 hover:bg-teal-50/50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/20 transition-all cursor-pointer">
          Meet the Team
        </button>
      </div>
    </div>
  </section>
);

const Team = () => {
  const vets = [
    {
      name: "Dr. Sarah Miller",
      role: "Senior Veterinarian",
      desc: "Specialising in internal medicine and senior pet care with 12 years of practice.",
      image:
        "https://images.unsplash.com/photo-1644675272883-0c4d582528d8?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Dr. James Wilson",
      role: "Veterinary Surgeon",
      desc: "Expert in soft-tissue surgery and orthopaedic procedures for dogs and cats.",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Dr. Elena Petrova",
      role: "Dermatology Specialist",
      desc: "Focused on allergy management, skin health, and immunology treatments.",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
    },
  ];

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
        <button className="font-bold px-6 py-3 rounded-xl border-2 border-teal-600 text-teal-600 hover:bg-teal-50/50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/20 transition-all cursor-pointer whitespace-nowrap self-start">
          View all 18 specialists →
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {vets.map((v) => (
          <TeamCard key={v.name} {...v} />
        ))}
      </div>
    </section>
  );
};

const Values = () => (
  <section className="bg-slate-100/50 dark:bg-slate-900/30 rounded-[2.5rem] p-8 md:p-12 transition-colors">
    <div className="text-center mb-12 space-y-3">
      <Badge>What we stand for</Badge>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
        Our core values
      </h2>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ValueCard
        icon={ShieldCheck}
        title="Certified expertise"
        desc="Board-certified specialists covering every discipline from surgery to dermatology."
      />
      <ValueCard
        icon={Heart}
        title="Gentle handling"
        desc="Fear-free techniques that keep anxious animals calm and comfortable."
      />
      <ValueCard
        icon={Atom}
        title="Modern equipment"
        desc="State-of-the-art diagnostic tools so we spot problems early."
      />
      <ValueCard
        icon={Accessibility}
        title="Flexible access"
        desc="Extended hours, same-day bookings, and emergency walk-ins welcome."
      />
    </div>
  </section>
);

// ─── Contact/Footer ───────────────────────────────────────────────────────────

const Contact = () => (
  <section>
    <div className="grid sm:grid-cols-3 gap-6">
      {[
        { icon: MapPin, label: "Visit Us", value: "123 Pet Lane, Health City" },
        { icon: Phone, label: "Call Us", value: "+1 (800) PAW-CARE" },
        { icon: Mail, label: "Email Us", value: "hello@pawcare.vet" },
      ].map(({ icon: Icon, label, value }) => (
        <Card key={label} className="border border-slate-100 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-sm text-center py-4 transition-all">
          <CardContent className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className="text-slate-800 dark:text-slate-200 font-semibold transition-colors">
                {value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        {/* Hero Section */}
        <Hero />

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} value="12,000+" label="Happy Patients" />
          <StatCard icon={Award} value="14 yrs" label="Experience" />
          <StatCard icon={CalendarCheck} value="98%" label="Satisfaction" />
          <StatCard icon={Stethoscope} value="18" label="Specialist Vets" />
        </div>

        {/* Mission Section */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <Badge>Our Mission</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight transition-colors">
              Care that goes beyond the clinic walls
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed transition-colors">
              We believe preventive care is the foundation of a long, healthy
              life. Our team combines cutting-edge diagnostics with warm,
              personalised attention.
            </p>
            <div className="space-y-3">
              {[
                "Fear-free handling for anxious pets",
                "Transparent pricing with no surprises",
                "24/7 Emergency support for regulars",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center flex-shrink-0">
                    <PawPrint size={12} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-2xl bg-amber-500 dark:bg-amber-400" />
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl h-[350px] md:h-[400px] lg:h-[450px]">
              <Image
                fill
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800"
                alt="Pet care"
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <Values />

        {/* Team Section */}
        <Team />

        {/* Testimonial Section */}
        <section className="rounded-[3rem] px-6 md:px-8 py-12 md:py-16 text-center shadow-2xl bg-teal-600 dark:bg-teal-950/40 border border-transparent dark:border-teal-900/30 text-white dark:text-slate-100 shadow-teal-900/10 transition-colors">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill="currentColor"
                  className="text-amber-400 dark:text-amber-500"
                />
              ))}
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-medium italic leading-relaxed">
              "PawCare saved our cat's life. The team was calm, quick, and
              incredibly kind — even at 2 am. We won't go anywhere else."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 dark:border-teal-800/60 flex-shrink-0">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                  className="object-cover"
                  alt="Riya Ahmed"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-white dark:text-slate-100">
                  Riya Ahmed
                </p>
                <p className="text-teal-100/80 dark:text-teal-400">
                  Golden Retriever owner
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <Contact />
      </div>
    </div>
  );
}