"use client";

import { AnimatePresence, motion } from "motion/react";
import { navLinks } from "@/content/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

const panelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, when: "beforeChildren" as const, staggerChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="fixed inset-0 z-[90] flex flex-col bg-bg/95 px-6 pt-28 pb-10 backdrop-blur-xl md:hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
        >
          <nav className="flex flex-1 flex-col justify-center gap-2">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                variants={linkVariants}
                className="border-b border-border py-5 font-display text-4xl font-medium text-text-primary transition-colors hover:text-accent"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
          <motion.div variants={linkVariants} className="flex flex-col gap-4">
            <MagneticButton href="#contact" onClick={onClose} className="w-full justify-center">
              Demander un devis
            </MagneticButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
