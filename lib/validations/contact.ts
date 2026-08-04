import { z } from "zod";

export const stepOneSchema = z.object({
  need: z.enum(["reseaux", "site", "prospection", "tout"], {
    errorMap: () => ({ message: "Sélectionnez un type de besoin." }),
  }),
});

export const stepTwoSchema = z.object({
  sector: z
    .string()
    .trim()
    .min(2, "Indiquez votre secteur d'activité.")
    .max(80, "80 caractères maximum."),
  city: z
    .string()
    .trim()
    .min(2, "Indiquez la ville ciblée.")
    .max(80, "80 caractères maximum."),
});

export const stepThreeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Votre nom doit contenir au moins 2 caractères.")
    .max(100, "100 caractères maximum."),
  company: z
    .string()
    .trim()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères.")
    .max(100, "100 caractères maximum."),
  email: z.string().trim().email("Adresse email invalide."),
  phone: z
    .string()
    .trim()
    .regex(/^(\+33|0)[1-9](\s?\d{2}){4}$/, "Numéro de téléphone français invalide."),
  message: z
    .string()
    .trim()
    .max(1000, "1000 caractères maximum.")
    .optional()
    .or(z.literal("")),
});

export const contactFormSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema);

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type StepOneValues = z.infer<typeof stepOneSchema>;
export type StepTwoValues = z.infer<typeof stepTwoSchema>;
export type StepThreeValues = z.infer<typeof stepThreeSchema>;
