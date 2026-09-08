// ============================================================
// TEMPORARY • DRE EXPO module — safe to remove after the expo.
// Everything for the expo registration feature lives behind this
// file (plus src/lib/expo.functions.ts, src/routes/expo*.tsx and
// the ExpoRegistrations admin tab). To retire the feature:
//   1. set EXPO_ENABLED = false  (hides CTA and registration)
//   2. delete the expo files and the admin tab entry
//   3. drop the public.expo_registrations table (see migration)
// ============================================================

export const EXPO_ENABLED = true;

export const expoParticipantOptions = [
  {
    kind: "entrepreneur" as const,
    title: "Register as Customer",
    description:
      "For entrepreneurs, MSMEs, farmers, FPOs, SHGs and students looking to explore DRE technologies, financing and business opportunities.",
  },
  {
    kind: "vendor" as const,
    title: "Register for Stall",
    description:
      "For vendors, manufacturers, technology providers, installers and partners who want to book a stall, showcase products and demonstrate at the expo.",
  },
];

export const expoParticipantTypes = [
  "Entrepreneur",
  "MSME",
  "Farmer",
  "FPO",
  "Women Entrepreneur",
  "SHG",
  "Student",
  "Other",
] as const;

export const expoInterests = [
  "Solar",
  "Battery / Energy Storage",
  "Cold Storage",
  "Solar Drying",
  "EV / E-Mobility",
  "Biomass / Biogas",
  "Energy-Efficient Equipment",
  "DRE Business Opportunities",
  "Financing",
  "Government Schemes",
  "Other",
] as const;

export const expoVendorCategories = [
  "Manufacturer",
  "Technology Provider",
  "Installer / EPC",
  "Distributor",
  "Service Provider",
  "Financing Partner",
  "Other",
] as const;

export const expoTechnologies = [
  "Solar PV",
  "Solar Pumps",
  "Solar Dryers",
  "Cold Storage",
  "Battery / Energy Storage",
  "EV / E-Mobility",
  "EV Charging",
  "Biomass",
  "Biogas",
  "Energy-Efficient Machinery",
  "Other",
] as const;

export const expoPowerPhases = ["Single Phase", "Three Phase", "Not Sure"] as const;

export type ExpoEntrepreneurInput = {
  full_name: string;
  mobile: string;
  email?: string;
  organisation?: string;
  district?: string;
  participant_type: (typeof expoParticipantTypes)[number];
  interests: string[];
  requirement?: string;
};

export type ExpoVendorInput = {
  organisation: string;
  contact_person: string;
  mobile: string;
  email: string;
  district?: string;
  website?: string;
  category: (typeof expoVendorCategories)[number];
  technologies: string[];
  experience_years: string;
  previous_projects?: string;
  service_area?: string;
  description?: string;
  requires_electricity: boolean;
  power_requirement?: string;
  power_phase?: (typeof expoPowerPhases)[number];
  equipment?: string;
  electrical_notes?: string;
};

export type ExpoRegistrationInput =
  | { kind: "entrepreneur"; payload: ExpoEntrepreneurInput }
  | { kind: "vendor"; payload: ExpoVendorInput };
