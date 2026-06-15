import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div>
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 bg-[#f5faf8] rounded-2xl p-5">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* content */}
          <div className="w-full md:w-[55%] space-y-stack-lg">
            <h1
              className={` font-display-lg text-4xl md:text-display-lg leading-tight dark:text-neutral-900`}
            >
              Expert care for your{" "}
              <span className="color-primart">beloved pets.</span>
            </h1>
            <p className="font-body-lg max-w-xl dark:text-neutral-900">
              Book grooming, vet check-ups, dental cleaning, and more — all in
              one place. We treat your furry friends like family.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="bg-[#0D9488] text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 hover:bg-[#0f776e] transition-transform cursor-pointer"
              >
                Book an Appointment
              </Button>
              <Button
                size="lg"
                className="bg-[#F59E0B] text-white border-2 border-primary rounded-lg font-bold hover:scale-105 hover:bg-[#ff7b00] transition-colors cursor-pointer"
              >
                Explore Services
              </Button>
            </div>
          </div>
          {/* Image */}
          <div className="w-full md:w-[45%]">
            <div className="flex items-center justify-center mx-auto max-w-125">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk_loNLtOdVWF8U9aAAPmoSrYP5ntsf0iqvUpcWlpLPeRERVzMSL0vxzITRCWVVq9xVwELCUJYSQB_FQaNOapIzEMj3LeN23QJRsO4K8NPCCOV-P1TTpkTCvZtPFO-dvsoH_5M-1PLLJMciwrL7F5RXqQam8DF5UoYeyrntiPf6P_TeGbWOA8VNlEyhkcz0G_glqRY2-oJYRdMqywcwSqLTB6Ya_c4N-hF0YgSfzAe-YNvvLX_b9pLdoR2--iuepuqkq1R9Wzactg"
                alt="A professional female veterinarian wearing a teal scrub top and a stethoscope smiling warmly while examining a calm golden retriever in a bright, modern veterinary clinic"
                width={500}
                height={625}
                className="w-full aspect-[4/5] object-cover rounded-[32px] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
