"use client";

import { useSetupStore } from "@/stores/setup-store";
import { getDocumentTemplates } from "@/data/jurisdictions";

export function StepDocuments() {
  const { data, nextStep, prevStep } = useSetupStore();

  if (!data.country || !data.entityType) return null;

  const documents = getDocumentTemplates(data.country, data.entityType);

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Required Documents</h3>
      <p className="text-sm text-muted-foreground mb-6">
        These document templates will be available on your dashboard after setup. You can generate and download them.
      </p>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.key}
            className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{doc.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">{doc.description}</p>
              <span className="inline-block mt-2 text-xs bg-muted rounded px-2 py-0.5 text-muted-foreground uppercase">
                {doc.format}
              </span>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No document templates available for this entity type yet.</p>
        </div>
      )}

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
