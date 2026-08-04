"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsCompact(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-[95] border-b transition-[background-color,border-color,padding] duration-500",
          isCompact
            ? "border-border bg-bg/80 py-3 backdrop-blur-xl"
            : "border-transparent bg-transparent py-6"
        )}
      >
        <div className="mx-auto flex max-w-content items-center justify-between px-6 lg:px-10">
          <Logo />

          <nav className="hidden items-center gap-9 md:flex" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton href="#contact" aria-label="Demander un devis">
              Demander un devis
            </MagneticButton>
          </div>

          <button
            type="button"
            className="relative z-[95] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span
              className={cn(
                "block h-[1.5px] w-6 bg-text-primary transition-transform duration-300",
                isMenuOpen && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-6 bg-text-primary transition-transform duration-300",
                isMenuOpen && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </motion.header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
