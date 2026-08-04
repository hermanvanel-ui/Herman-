"use client";

import { FormField, FormTextarea } from "@/components/forms/FormField";

interface StepThreeData {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

type StepThreeKey = keyof StepThreeData;

interface StepThreeProps {
  data: StepThreeData;
  errors: Record<string, string>;
  onChange: (key: StepThreeKey, value: string) => void;
}

export function StepThree({ data, errors, onChange }: StepThreeProps) {
  return (
    <div>
      <h3 className="mb-5 font-display text-xl font-medium text-text-primary">Vos coordonnées</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="name"
          label="Nom complet"
          placeholder="Jean Dupont"
          value={data.name}
          onChange={(event) => onChange("name", event.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <FormField
          id="company"
          label="Entreprise"
          placeholder="Nom de votre entreprise"
          value={data.company}
          onChange={(event) => onChange("company", event.target.value)}
          error={errors.company}
          autoComplete="organization"
        />
        <FormField
          id="email"
          type="email"
          label="Email"
          placeholder="vous@entreprise.fr"
          value={data.email}
          onChange={(event) => onChange("email", event.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          id="phone"
          type="tel"
          label="Téléphone"
          placeholder="06 12 34 56 78"
          value={data.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>
      <div className="mt-5">
        <FormTextarea
          id="message"
          label="Message (facultatif)"
          placeholder="Parlez-nous en quelques mots de votre projet..."
          rows={4}
          value={data.message}
          onChange={(event) => onChange("message", event.target.value)}
          error={errors.message}
        />
      </div>
    </div>
  );
}
