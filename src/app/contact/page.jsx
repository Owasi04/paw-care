import React from "react";
import { Phone, Mail, Clock, MapPin, MessageCircle, LifeBuoy } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-16">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <LifeBuoy className="w-7 h-7 text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3">
            Contact Our Veterinary Team
          </h1>

          <p className="text-muted-foreground">
            Whether you need pet care advice, product recommendations, or
            emergency assistance, we{`&apos`}re ready to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

            <div className="space-y-5">
              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+880 1234 567890</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">support@pawcare.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">123 Pet Street, Dhaka</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-muted-foreground">
                    Sat - Thu • 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg px-4 py-3 bg-background"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-3 bg-background"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-lg px-4 py-3 bg-background"
              />

              <textarea
                rows={5}
                placeholder="Tell us how we can help..."
                className="w-full border rounded-lg px-4 py-3 bg-background resize-none"
              />

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="mt-8 rounded-2xl bg-primary text-primary-foreground p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Pet Emergency?</h3>
              <p className="opacity-90">
                Our emergency veterinary support is available 24/7.
              </p>
            </div>

            <button className="bg-background text-foreground px-6 py-3 rounded-lg font-medium">
              Call Emergency Line
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
