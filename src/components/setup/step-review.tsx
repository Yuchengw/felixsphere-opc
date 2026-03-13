"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetupStore } from "@/stores/setup-store";
import { getJurisdiction, getChecklistForEntity, getDocumentTemplates } from "@/data/jurisdictions";

export function StepReview() {
  const router = useRouter();
  const { data, prevStep, reset } = useSetupStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!data.country || !data.entityType || !data.companyName) return null;

  const jurisdiction = getJurisdiction(data.country);
  const entityType = jurisdiction.entityTypes.find((e) => e.code === data.entityType);
  const suffix = entityType?.nameSuffix ?? "";
  const fullName = suffix ? `${data.companyName} ${suffix}` : data.companyName;
  const checklistCount = getChecklistForEntity(data.country, data.entityType).length;
  const docCount = getDocumentTemplates(data.country, data.entityType).length;

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/company/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to create company");
        setSubmitting(false);
        return;
      }

      reset();
      router.push("/setup/complete");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const rows = [
    { label: "Country", value: `${jurisdiction.flagEmoji} ${jurisdiction.countryName}` },
    { label: "Entity Type", value: entityType?.name ?? data.entityType },
    { label: "Company Name", value: fullName },
    { label: "Founder", value: data.founderName ?? "—" },
    { label: "Email", value: data.founderEmail ?? "—" },
    { label: "Industry", value: data.industry ?? "—" },
    { label: "Tasks to Complete", value: `${checklistCount} registration tasks` },
    { label: "Documents", value: `${docCount} templates available` },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Review Your Setup</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Please review your company details. You can go back to any step to make changes.
      </p>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="border border-border rounded-xl overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-3 ${
              i < rows.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      {data.description && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{data.description}</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Creating Company..." : "Create My Company"}
        </button>
      </div>
    </div>
  );
}
