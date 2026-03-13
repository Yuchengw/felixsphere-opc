"use client";

import { useSetupStore } from "@/stores/setup-store";
import { getBankingGuidance } from "@/data/jurisdictions";

export function StepBanking() {
  const { data, nextStep, prevStep } = useSetupStore();

  if (!data.country) return null;

  const banking = getBankingGuidance(data.country);

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Banking Setup Guide</h3>
      <p className="text-sm text-muted-foreground mb-6">
        You&apos;ll need a dedicated business bank account. Here are our recommendations and what you&apos;ll need.
      </p>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recommended Banks
          </h4>
          <div className="space-y-2">
            {banking.recommendations.map((bank, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <p className="text-sm">{bank}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            What You&apos;ll Need
          </h4>
          <ul className="space-y-2">
            {banking.requirements.map((req, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Tips
          </h4>
          <div className="space-y-2">
            {banking.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg">
                <span className="text-amber-600 mt-0.5">&#x1F4A1;</span>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
        <button
          onClick={nextStep}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
