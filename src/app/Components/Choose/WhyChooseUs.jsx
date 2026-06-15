
import { Accessibility, Atom, Heart, ShieldCheck } from "lucide-react";
import React from "react";

const WhyChooseUs = () => {
  return (
    <div>
      <section className="py-24 bg-white rounded-2xl">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 text-primary">
                <ShieldCheck size={80} color="#0D9488" strokeWidth={1.5}/>
              </div>
              <h4 className="font-headline-md dark:text-slate-900 text-lg mb-2">Certified Vets</h4>
              <p className="text-on-surface-variant font-body-md text-sm">
                Board-certified specialists for every pet need.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 text-primary">
               <Heart size={80} color="#0D9488" strokeWidth={1.5}/>
              </div>
              <h4 className="font-headline-md dark:text-slate-900 text-lg mb-2">Gentle Handling</h4>
              <p className="text-on-surface-variant font-body-md text-sm">
                Stress-free techniques for anxious animals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 text-primary">
                <Atom size={80} color="#0D9488" strokeWidth={1.5}/>
              </div>
              <h4 className="font-headline-md dark:text-slate-900 text-lg mb-2">
                Modern Equipment
              </h4>
              <p className="text-on-surface-variant font-body-md text-sm">
                State-of-the-art diagnostic and lab tools.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 text-primary">
                <Accessibility size={80} color="#0D9488" strokeWidth={1.5}/>
              </div>
              <h4 className="font-headline-md dark:text-slate-900 text-lg mb-2">
                Flexible Scheduling
              </h4>
              <p className="text-on-surface-variant font-body-md text-sm">
                Same-day appointments and emergency care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;
