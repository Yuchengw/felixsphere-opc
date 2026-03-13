import type { CountryCode, JurisdictionConfig } from "@/types/company";
import { usJurisdiction } from "./us";
import { ukJurisdiction } from "./uk";
import { indiaJurisdiction } from "./india";

export const jurisdictions: Record<CountryCode, JurisdictionConfig> = {
  US: usJurisdiction,
  UK: ukJurisdiction,
  IN: indiaJurisdiction,
  SG: usJurisdiction, // Placeholder - to be implemented
  DE: usJurisdiction, // Placeholder - to be implemented
};

export const supportedCountries: { code: CountryCode; name: string; flag: string; available: boolean }[] = [
  { code: "US", name: "United States", flag: "\u{1F1FA}\u{1F1F8}", available: true },
  { code: "UK", name: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", available: true },
  { code: "IN", name: "India", flag: "\u{1F1EE}\u{1F1F3}", available: true },
  { code: "SG", name: "Singapore", flag: "\u{1F1F8}\u{1F1EC}", available: false },
  { code: "DE", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}", available: false },
];

export function getJurisdiction(countryCode: CountryCode): JurisdictionConfig {
  return jurisdictions[countryCode];
}

export function getEntityTypes(countryCode: CountryCode) {
  return jurisdictions[countryCode].entityTypes;
}

export function getChecklistForEntity(countryCode: CountryCode, entityType: string) {
  const config = jurisdictions[countryCode];
  return config.checklistItems.filter((item) =>
    item.requiredFor.includes(entityType as never)
  );
}

export function getDocumentTemplates(countryCode: CountryCode, entityType: string) {
  const config = jurisdictions[countryCode];
  return config.documentTemplates.filter((doc) =>
    doc.applicableTo.includes(entityType as never)
  );
}

export function getBankingGuidance(countryCode: CountryCode) {
  return jurisdictions[countryCode].bankingGuidance;
}
