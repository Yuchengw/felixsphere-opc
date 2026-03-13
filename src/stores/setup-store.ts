import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SetupWizardData } from "@/types/company";

export const WIZARD_STEPS = [
  { id: "country", label: "Country", description: "Choose your jurisdiction" },
  { id: "entity-type", label: "Entity Type", description: "Select your business structure" },
  { id: "company-name", label: "Company Name", description: "Name your company" },
  { id: "details", label: "Details", description: "Founder information" },
  { id: "registrations", label: "Registrations", description: "Required registrations" },
  { id: "banking", label: "Banking", description: "Set up banking" },
  { id: "documents", label: "Documents", description: "Required documents" },
  { id: "review", label: "Review", description: "Review and confirm" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

interface SetupStore {
  currentStep: number;
  data: SetupWizardData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<SetupWizardData>) => void;
  reset: () => void;
}

const initialData: SetupWizardData = {};

export const useSetupStore = create<SetupStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      data: initialData,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, WIZARD_STEPS.length - 1),
        })),
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),
      updateData: (partial) =>
        set((state) => ({
          data: { ...state.data, ...partial },
        })),
      reset: () => set({ currentStep: 0, data: initialData }),
    }),
    {
      name: "felixsphere-setup-wizard",
    }
  )
);
