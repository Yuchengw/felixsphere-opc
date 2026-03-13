"use client";

import { useState } from "react";
import { useSetupStore } from "@/stores/setup-store";
import { getJurisdiction } from "@/data/jurisdictions";

export function StepCompanyName() {
  const { data, updateData, nextStep, prevStep } = useSetupStore();
  const [name, setName] = useState(data.companyName ?? "");

  if (!data.country || !data.entityType) return null;

  const jurisdiction = getJurisdiction(data.country);
  const entityType = jurisdiction.entityTypes.find((e) => e.code === data.entityType);
  const suffix = entityType?.nameSuffix ?? "";
  const preview = suffix ? `${name || "Your Company"} ${suffix}` : name || "Your Company";

  function handleContinue() {
    if (name.trim().length < 2) return;
    updateData({ companyName: name.trim() });
    nextStep();
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">What will you name your company?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a unique name for your business. It should not be identical or too similar to existing registered companies.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium mb-1.5">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your company name"
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
          />
        </div>

        {name && (
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Your full company name will be:</p>
            <p className="text-lg font-semibold">{preview}</p>
          </div>
        )}

        <div className="bg-amber-500/10 rounded-lg p-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <strong>Tip:</strong> Before finalizing, check name availability with {entityType?.registrationBody ?? "your local registry"}.
            {jurisdiction.checklistItems.find((c) => c.key.includes("check_name"))?.resourceUrl && (
              <> You can search at the official registry website.</>
            )}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={name.trim().length < 2}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
