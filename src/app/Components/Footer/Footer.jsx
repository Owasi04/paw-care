import Link from "next/link";
import { PawPrint, Globe, Share2, Video, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background mt-20 p-10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <PawPrint className="h-5 w-5 text-primary" />
              </div>

              <span className="text-xl font-bold text-foreground">PawCare</span>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              Dedicated to providing quality veterinary care with a personal
              touch. Your pet{`&apos`}s health and happiness are our priority.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Globe className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Share2 className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Video className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 font-semibold text-foreground">Quick Links</h4>

            <ul className="space-y-3">
              {["Our Mission", "Health Blog", "Pet Insurance", "Reviews"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 font-semibold text-foreground">Services</h4>

            <ul className="space-y-3">
              {[
                "Emergency Care",
                "Vet Check-ups",
                "Pet Grooming",
                "Dental Clinic",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-5 font-semibold text-foreground">
              Working Hours
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Mon - Fri</span>
                <span className="font-medium text-foreground">
                  08:00 - 20:00
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Saturday</span>
                <span className="font-medium text-foreground">
                  09:00 - 18:00
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span className="font-medium text-primary">Emergency Only</span>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />

              <span className="text-sm text-muted-foreground">
                123 Pet Lane, Health City
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PawCare. All rights reserved by{" "}
            <span className="font-bold">Owasiul</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
