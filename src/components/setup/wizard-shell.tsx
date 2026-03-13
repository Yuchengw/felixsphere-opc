"use client";

import { useSetupStore, WIZARD_STEPS } from "@/stores/setup-store";
import { cn } from "@/lib/utils";

export function WizardShell({ children }: { children: React.ReactNode }) {
  const { currentStep } = useSetupStore();
  const step = WIZARD_STEPS[currentStep];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {WIZARD_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                  i < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : i === currentStep
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground"
                )}
              >
                {i < currentStep ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    "hidden sm:block w-8 md:w-12 h-0.5 mx-1",
                    i < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {WIZARD_STEPS.length}
          </p>
          <h2 className="text-xl font-semibold mt-1">{step.description}</h2>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
