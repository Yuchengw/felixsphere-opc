"use client";

import { WizardShell } from "@/components/setup/wizard-shell";
import { StepCountry } from "@/components/setup/step-country";
import { StepEntityType } from "@/components/setup/step-entity-type";
import { StepCompanyName } from "@/components/setup/step-company-name";
import { StepDetails } from "@/components/setup/step-details";
import { StepRegistrations } from "@/components/setup/step-registrations";
import { StepBanking } from "@/components/setup/step-banking";
import { StepDocuments } from "@/components/setup/step-documents";
import { StepReview } from "@/components/setup/step-review";
import { useSetupStore } from "@/stores/setup-store";

const steps = [
  StepCountry,
  StepEntityType,
  StepCompanyName,
  StepDetails,
  StepRegistrations,
  StepBanking,
  StepDocuments,
  StepReview,
];

export default function SetupPage() {
  const { currentStep } = useSetupStore();
  const StepComponent = steps[currentStep];

  return (
    <WizardShell>
      <StepComponent />
    </WizardShell>
  );
}
