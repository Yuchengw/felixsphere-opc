import { z } from "zod";

export const setupStepCountrySchema = z.object({
  country: z.string().min(1, "Please select a country"),
  subJurisdiction: z.string().optional(),
});

export const setupStepEntityTypeSchema = z.object({
  entityType: z.string().min(1, "Please select an entity type"),
});

export const setupStepCompanyNameSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
});

export const setupStepDetailsSchema = z.object({
  founderName: z.string().min(2, "Name is required"),
  founderEmail: z.string().email("Valid email is required"),
  founderAddress: z.string().min(5, "Address is required"),
  founderTaxId: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
});

export const createCompanySchema = z.object({
  name: z.string().min(2),
  jurisdictionCode: z.string().min(1),
  entityType: z.string().min(1),
  founderDetails: z.string().optional(),
  setupData: z.string().optional(),
});
