import {
  Dog,
  Cat,
  Scissors,
  Stethoscope,
  GraduationCap,
  Footprints,
  PawPrint,
  BedDouble,
  Smile,
  Sparkles,
  Siren,
  ScanLine,
  Microscope,
  Salad,
  BriefcaseMedical,
  Syringe,
} from "lucide-react";

// Covers every `category` currently present in the services collection, so the
// vet dashboard's filter chips are visually distinguishable.
export const CATEGORY_ICONS = {
  Boarding: BedDouble,
  Dental: Smile,
  Dermatology: Sparkles,
  Emergency: Siren,
  Grooming: Scissors,
  "Health Checkup": Stethoscope,
  Identification: ScanLine,
  Imaging: Microscope,
  Nutrition: Salad,
  Surgery: BriefcaseMedical,
  Training: GraduationCap,
  Vaccination: Syringe,
  Veterinary: Stethoscope,
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
