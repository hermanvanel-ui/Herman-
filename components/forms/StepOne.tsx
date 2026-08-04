"use client";

import { contactStepOneOptions } from "@/content/site";
import { cn } from "@/lib/utils";

interface StepOneProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function StepOne({ value, onChange, error }: StepOneProps) {
  return (
    <fieldset>
      <legend className="mb-5 font-display text-xl font-medium text-text-primary">
        Quel est votre besoin principal ?
      </legend>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Type de besoin">
        {contactStepOneOptions.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "rounded-lg border px-5 py-4 text-left transition-colors",
                selected
                  ? "border-accent bg-accent-dim"
                  : "border-border bg-surface hover:border-border-strong"
              )}
            >
              <span className="block font-display text-base font-medium text-text-primary">
                {option.label}
              </span>
              <span className="mt-1 block text-xs text-text-secondary">{option.description}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-xs text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
