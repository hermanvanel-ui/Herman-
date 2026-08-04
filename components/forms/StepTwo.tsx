"use client";

import { FormField } from "@/components/forms/FormField";

interface StepTwoProps {
  sector: string;
  city: string;
  errors: Record<string, string>;
  onChange: (key: "sector" | "city", value: string) => void;
}

export function StepTwo({ sector, city, errors, onChange }: StepTwoProps) {
  return (
    <div>
      <h3 className="mb-5 font-display text-xl font-medium text-text-primary">
        Votre secteur et votre zone ciblée
      </h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="sector"
          label="Secteur d'activité"
          placeholder="Ex : restauration, artisanat, sport..."
          value={sector}
          onChange={(event) => onChange("sector", event.target.value)}
          error={errors.sector}
          autoComplete="off"
        />
        <FormField
          id="city"
          label="Ville ciblée"
          placeholder="Ex : Nice"
          value={city}
          onChange={(event) => onChange("city", event.target.value)}
          error={errors.city}
          autoComplete="address-level2"
        />
      </div>
    </div>
  );
}
