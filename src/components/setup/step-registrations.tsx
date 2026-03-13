"use client";

import { useSetupStore } from "@/stores/setup-store";
import { getChecklistForEntity } from "@/data/jurisdictions";
import { STAGE_LABELS } from "@/types/company";

export function StepRegistrations() {
  const { data, nextStep, prevStep } = useSetupStore();

  if (!data.country || !data.entityType) return null;

  const checklistItems = getChecklistForEntity(data.country, data.entityType);
  const grouped = checklistItems.reduce((acc, item) => {
    if (!acc[item.stage]) acc[item.stage] = [];
    acc[item.stage].push(item);
    return acc;
  }, {} as Record<string, typeof checklistItems>);

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Your Registration Checklist</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Here&apos;s everything you&apos;ll need to do to register your company. These will become trackable tasks on your dashboard.
      </p>

      <div className="space-y-6">
        {Object.entries(grouped).map(([stage, items]) => (
          <div key={stage}>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {STAGE_LABELS[stage as keyof typeof STAGE_LABELS] ?? stage}
            </h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-5 h-5 rounded border-2 border-border mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                    {item.estimatedTimeDays && (
                      <span className="text-xs text-muted-foreground">
                        ~{item.estimatedTimeDays} day{item.estimatedTimeDays > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-lg p-4 mt-6">
        <p className="text-sm">
          <strong>{checklistItems.length} tasks</strong> will be added to your dashboard when you complete the setup.
        </p>
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
