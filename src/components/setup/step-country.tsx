"use client";

import { useSetupStore } from "@/stores/setup-store";
import { supportedCountries } from "@/data/jurisdictions";
import { cn } from "@/lib/utils";
import type { CountryCode } from "@/types/company";

export function StepCountry() {
  const { data, updateData, nextStep } = useSetupStore();

  function selectCountry(code: CountryCode) {
    updateData({ country: code, subJurisdiction: undefined, entityType: undefined });
    nextStep();
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Where will your company be registered?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Choose the country where you want to form your company. Each jurisdiction has different requirements and benefits.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {supportedCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => country.available && selectCountry(country.code)}
            disabled={!country.available}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
              data.country === country.code
                ? "border-primary bg-primary/5"
                : country.available
                ? "border-border hover:border-primary/30 hover:bg-muted/50"
                : "border-border opacity-50 cursor-not-allowed"
            )}
          >
            <span className="text-3xl">{country.flag}</span>
            <div>
              <p className="font-medium">{country.name}</p>
              {!country.available && (
                <p className="text-xs text-muted-foreground">Coming soon</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
