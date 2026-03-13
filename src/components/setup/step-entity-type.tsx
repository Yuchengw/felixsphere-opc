"use client";

import { useSetupStore } from "@/stores/setup-store";
import { getEntityTypes, getJurisdiction } from "@/data/jurisdictions";
import { cn } from "@/lib/utils";
import type { EntityTypeCode } from "@/types/company";

export function StepEntityType() {
  const { data, updateData, nextStep, prevStep } = useSetupStore();

  if (!data.country) return null;

  const jurisdiction = getJurisdiction(data.country);
  const entityTypes = getEntityTypes(data.country);

  function selectEntityType(code: EntityTypeCode) {
    updateData({ entityType: code });
    nextStep();
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">
        Choose your business structure in {jurisdiction.countryName}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select the entity type that best fits your needs. We recommend the first option for most solo founders.
      </p>

      <div className="space-y-3">
        {entityTypes.map((type, i) => (
          <button
            key={type.code}
            onClick={() => selectEntityType(type.code)}
            className={cn(
              "w-full text-left p-5 rounded-xl border-2 transition-all",
              data.entityType === type.code
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{type.name}</h4>
                {i === 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Recommended
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{type.estimatedCostRange}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Liability: <strong className="text-foreground">{type.liability === "LIMITED" ? "Limited" : "Unlimited"}</strong></span>
              <span>Tax: <strong className="text-foreground">{type.taxType.replace("_", " ")}</strong></span>
              <span>Time: <strong className="text-foreground">~{type.estimatedTimeDays} days</strong></span>
              {type.requiresNominee && <span className="text-amber-600">Requires nominee</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
      </div>
    </div>
  );
}
