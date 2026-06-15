import Image from "next/image";
import React from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    pet: "Luna (Tabby)",
    quote:
      "The level of care PawCare provides is unmatched. Dr. Sarah was so patient with my nervous cat, Luna. I wouldn't trust anyone else.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8qCFtiYH6lnSl64fdg8l_NXRbguOCewKwGQ_tR8cKEXibL9kkVpjYGWmlV6hbvSR5bWv-dHT92Hjwt-ZyGfNw-WvAJNo94LtS8U7s4NTCBKv64dxrkvT2une7m4VLgN49yBCQeBuvKv-cjtonyP0DaRuRNM7ZzBQ02WZkgWK9VsRWdEwb_jSxuqB1IKSyudGnpSIXXHuE-zPwUCcpV2jcnIH2eVXnLJ4DDnpEG4TvjAv_UzOWA9Tmt4mDGxKonedHKJLbcQLgxh8",
    alt: "A portrait of a smiling woman with glasses in a warm, domestic setting. She is cuddling a small grey tabby cat. The lighting is soft and natural, emphasizing a sense of home comfort and happiness. The background is slightly blurred, focusing on her friendly expression and her pet.",
  },
  {
    name: "Michael Chen",
    pet: "Bear (Labrador)",
    quote:
      "From grooming to emergency check-ups, they've been incredible. The bento-style app makes booking so easy!",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQO3FZtmmjIeak1KsZILCtpfvLLfNjkTsJsz_6VR5Q4yB5L-QPcPYWEv63AZsniBhKD-GK5nGeGaCEbv7gdCtzYOGDjYBmQa_98dEKaD3FmrZ4V1lm7YbNB6AXn7XNQf8fzqC0XZTzVXXbPnG1UrXj7DfIiEKaKnq5YW0KSarPItBQdoBkRieuSlYAQLAwMS0FzoKz0nNs8dMf_7RA04D1Thw6i_r1bbbSUPn4mvzOgcciOUSfDs_z9TovXoIWsE-ImIV-QLmqA-s",
    alt: "A profile photo of a middle-aged man with a professional yet approachable appearance. He is wearing a simple polo shirt and standing in a modern park setting. Beside him, partially in frame, is a large, happy black Labrador retriever. The style is clean, sharp, and optimistic.",
  },
  {
    name: "Emily Rodriguez",
    pet: "Coco (Pomeranian)",
    quote:
      "I travel often and their health reports are so helpful for my boarders. Professional and passionate staff.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCumG27A4FfdPYzX6NeWJV5L1zGQbLHQs1tQNo80nTjtoPwq8EG69IukqGRNO5I_STqqw5_i-f27qKzFCyrmS4f-lKSLbHWNNyHkAa43IG0L0E7SWZxBMY9q9iPKB9PIoE9pckdKrDEqB1wr7E65tipZEE2gvySnj0O-dw3FTeSIJi5RCZ1ID6hy76pzYqsEG1KK7FwqBpz-Al5m9sADlKhSgT4cXMlbn92h9SnnEsX91EA2c_Dbxh0Gon4BpqzzU4YNmr5dlJTxpE",
    alt: "A portrait of a young woman with a vibrant, energetic smile. She is outdoors in a urban garden environment, holding a small white Pomeranian dog. The lighting is bright and cheerful, with a color palette featuring soft whites and fresh greens. The overall aesthetic is professional, modern, and high-energy.",
  },
];

const Feedback = () => {
  return (
    <div className="bg-[#eaefed] rounded-2xl p-3">
      <section className="py-24 px-5 bg-surface-container">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4 font-medium dark:text-slate-800">
              What pet parents say
            </h2>
            <p className="text-on-surface-variant  ">
              Trusted by thousands of families across the city.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-8 rounded-2xl shadow-sm italic text-on-surface-variant relative"
              >
                <Quote className="absolute top-4 right-8 text-secondary-container opacity-20 w-16 h-16" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-8 font-body-md">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-4 not-italic">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant">
                    <Image
                      width={100}
                      height={100}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      data-alt={t.alt}
                      src={t.image}
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface dark:text-slate-500" >{t.name}</h5>
                    <p className="text-xs text-primary dark:text-slate-500">Pet: {t.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;