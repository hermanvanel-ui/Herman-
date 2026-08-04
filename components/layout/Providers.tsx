"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Grain } from "@/components/ui/Grain";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <CustomCursor />
        <Grain />
        {children}
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
