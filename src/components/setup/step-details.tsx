"use client";

import { useState } from "react";
import { useSetupStore } from "@/stores/setup-store";

export function StepDetails() {
  const { data, updateData, nextStep, prevStep } = useSetupStore();
  const [form, setForm] = useState({
    founderName: data.founderName ?? "",
    founderEmail: data.founderEmail ?? "",
    founderAddress: data.founderAddress ?? "",
    industry: data.industry ?? "",
    description: data.description ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleContinue() {
    if (!form.founderName.trim() || !form.founderEmail.trim()) return;
    updateData(form);
    nextStep();
  }

  const industries = [
    "Technology / Software",
    "Consulting / Services",
    "E-commerce / Retail",
    "Marketing / Creative",
    "Finance / Fintech",
    "Healthcare",
    "Education",
    "Real Estate",
    "Manufacturing",
    "Other",
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Tell us about yourself</h3>
      <p className="text-sm text-muted-foreground mb-6">
        This information will be used for your company registration documents.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="founderName" className="block text-sm font-medium mb-1.5">
              Full Legal Name *
            </label>
            <input
              id="founderName"
              name="founderName"
              type="text"
              value={form.founderName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Your legal name"
            />
          </div>
          <div>
            <label htmlFor="founderEmail" className="block text-sm font-medium mb-1.5">
              Email Address *
            </label>
            <input
              id="founderEmail"
              name="founderEmail"
              type="email"
              value={form.founderEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="founderAddress" className="block text-sm font-medium mb-1.5">
            Address
          </label>
          <input
            id="founderAddress"
            name="founderAddress"
            type="text"
            value={form.founderAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Your business or residential address"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium mb-1.5">
            Industry
          </label>
          <select
            id="industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select an industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1.5">
            Company Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="Brief description of what your company does"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!form.founderName.trim() || !form.founderEmail.trim()}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
