"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function useScrollPin<T extends HTMLElement>(distance = 500) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) {
      setProgress(1);
      return;
    }

    const element = ref.current;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top top+=110",
          end: `+=${distance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => setProgress(self.progress),
        });
        return () => trigger.kill();
      });

      mm.add("(max-width: 1023px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top 80%",
          end: "bottom 45%",
          scrub: 0.5,
          onUpdate: (self) => setProgress(self.progress),
        });
        return () => trigger.kill();
      });
    }, element);

    return () => ctx.revert();
  }, [reducedMotion, distance]);

  return { ref, progress };
}
