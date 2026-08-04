"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } }}
        exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
