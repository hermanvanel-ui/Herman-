"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ProgressBar } from "@/components/forms/ProgressBar";
import { StepOne } from "@/components/forms/StepOne";
import { StepTwo } from "@/components/forms/StepTwo";
import { StepThree } from "@/components/forms/StepThree";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  contactFormSchema,
  stepOneSchema,
  stepThreeSchema,
  stepTwoSchema,
} from "@/lib/validations/contact";
import { EASE_PREMIUM } from "@/lib/motion";

const TOTAL_STEPS = 3;

interface FormData {
  need: string;
  sector: string;
  city: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

const initialData: FormData = {
  need: "",
  sector: "",
  city: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-5 py-16 text-center"
    >
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <motion.circle
          cx="36"
          cy="36"
          r="33"
          stroke="#22D3EE"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        />
        <motion.path
          d="M22 37L31 46L50 26"
          stroke="#22D3EE"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: 0.5 }}
        />
      </svg>
      <p className="font-display text-xl font-medium text-text-primary">Demande envoyée !</p>
      <p className="text-sm text-text-secondary">Redirection en cours...</p>
    </motion.div>
  );
}

export function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function updateField(key: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateStep(currentStep: number): boolean {
    const schema = currentStep === 1 ? stepOneSchema : currentStep === 2 ? stepTwoSchema : stepThreeSchema;
    const result = schema.safeParse(data);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return false;
  }

  function handleNext() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;
    const fullValidation = contactFormSchema.safeParse(data);
    if (!fullValidation.success) return;

    setStatus("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullValidation.data),
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue. Merci de réessayer ou de nous contacter directement.");
      }

      setStatus("success");
      window.setTimeout(() => {
        router.push("/merci");
      }, 1400);
    } catch (error) {
      setStatus("error");
      setServerError(error instanceof Error ? error.message : "Une erreur est survenue.");
    }
  }

  if (status === "success") {
    return <SuccessState />;
  }

  return (
    <div>
      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="mt-10 min-h-[280px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          >
            {step === 1 && (
              <StepOne value={data.need} onChange={(value) => updateField("need", value)} error={errors.need} />
            )}
            {step === 2 && (
              <StepTwo sector={data.sector} city={data.city} errors={errors} onChange={updateField} />
            )}
            {step === 3 && <StepThree data={data} errors={errors} onChange={updateField} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {serverError && (
        <p role="alert" className="mt-4 text-sm text-error">
          {serverError}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Retour
          </button>
        ) : (
          <span aria-hidden="true" />
        )}

        {step < TOTAL_STEPS ? (
          <MagneticButton type="button" onClick={handleNext} aria-label="Passer à l'étape suivante">
            Continuer
          </MagneticButton>
        ) : (
          <MagneticButton
            type="button"
            onClick={handleSubmit}
            disabled={status === "submitting"}
            aria-label="Envoyer ma demande"
          >
            {status === "submitting" ? "Envoi..." : "Envoyer ma demande"}
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
