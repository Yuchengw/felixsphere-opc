export type CountryCode = "US" | "UK" | "IN" | "SG" | "DE";

export type EntityTypeCode =
  | "LLC"
  | "LTD"
  | "OPC"
  | "PTE_LTD"
  | "GMBH"
  | "UG"
  | "SOLE_PROP";

export type CompanyStatus = "DRAFT" | "IN_PROGRESS" | "REGISTERED" | "ACTIVE";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

export type TaskCategory =
  | "REGISTRATION"
  | "LEGAL"
  | "FINANCIAL"
  | "OPERATIONAL"
  | "COMPLIANCE";

export type RoadmapStage =
  | "FORMATION"
  | "REGISTRATION"
  | "BANKING"
  | "COMPLIANCE"
  | "LAUNCH"
  | "GROWTH";

export type MilestoneStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface EntityTypeConfig {
  code: EntityTypeCode;
  name: string;
  description: string;
  nameFormat: string;
  nameSuffix: string;
  minCapital?: string;
  liability: "LIMITED" | "UNLIMITED";
  taxType: string;
  registrationBody: string;
  estimatedTimeDays: number;
  estimatedCostRange: string;
  requiresNominee: boolean;
  residencyRequired: boolean;
  residencyDetails?: string;
}

export interface ChecklistItemTemplate {
  key: string;
  title: string;
  description: string;
  category: TaskCategory;
  stage: RoadmapStage;
  priority: number;
  estimatedTimeDays?: number;
  resourceUrl?: string;
  resourceLabel?: string;
  requiredFor: EntityTypeCode[];
}

export interface DocumentTemplate {
  key: string;
  title: string;
  description: string;
  applicableTo: EntityTypeCode[];
  format: "MARKDOWN" | "PDF";
  templateContent?: string;
}

export interface BankingGuidance {
  recommendations: string[];
  requirements: string[];
  tips: string[];
}

export interface SubJurisdiction {
  code: string;
  name: string;
  additionalFees?: string;
  notes?: string;
}

export interface JurisdictionConfig {
  countryCode: CountryCode;
  countryName: string;
  flagEmoji: string;
  currency: string;
  entityTypes: EntityTypeConfig[];
  checklistItems: ChecklistItemTemplate[];
  documentTemplates: DocumentTemplate[];
  bankingGuidance: BankingGuidance;
  subJurisdictions?: SubJurisdiction[];
}

export interface SetupWizardData {
  country?: CountryCode;
  subJurisdiction?: string;
  entityType?: EntityTypeCode;
  companyName?: string;
  founderName?: string;
  founderEmail?: string;
  founderAddress?: string;
  founderTaxId?: string;
  industry?: string;
  description?: string;
  [key: string]: unknown;
}

export const STAGE_ORDER: RoadmapStage[] = [
  "FORMATION",
  "REGISTRATION",
  "BANKING",
  "COMPLIANCE",
  "LAUNCH",
  "GROWTH",
];

export const STAGE_LABELS: Record<RoadmapStage, string> = {
  FORMATION: "Company Formation",
  REGISTRATION: "Registration & Filing",
  BANKING: "Banking & Finance",
  COMPLIANCE: "Compliance & Legal",
  LAUNCH: "Launch & Operations",
  GROWTH: "Growth & Scaling",
};
