import {
  Dog,
  Cat,
  Scissors,
  Stethoscope,
  GraduationCap,
  Footprints,
  PawPrint,
} from "lucide-react";

export const CATEGORY_ICONS = {
  Grooming: Scissors,
  Veterinary: Stethoscope,
  "Health Checkup": Stethoscope,
  Training: GraduationCap,
  Walking: Footprints,
};

export const PET_TYPE_ICONS = {
  Dogs: Dog,
  Dog: Dog,
  Cats: Cat,
  Cat: Cat,
};

export const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80";

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] ?? PawPrint;
}

export function getPetTypeIcon(type) {
  return PET_TYPE_ICONS[type] ?? PawPrint;
}

export function getInitials(name = "") {
  return name
    .replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
