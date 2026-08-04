"use client";

import type { ServiceBlock } from "@/types";
import { useScrollPin } from "@/hooks/useScrollPin";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { LighthouseGauge } from "@/components/sections/visuals/LighthouseGauge";
import { ProspectionVisual } from "@/components/sections/visuals/ProspectionVisual";
import { SocialPlanningVisual } from "@/components/sections/visuals/SocialPlanningVisual";

interface ServiceRowProps {
  service: ServiceBlock;
  reverse: boolean;
}

export function ServiceRow({ service, reverse }: ServiceRowProps) {
  const { ref, progress } = useScrollPin<HTMLDivElement>(450);

  return (
    <div
      ref={ref}
      id={service.id}
      className="mx-auto grid w-full max-w-content items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 lg:px-10 lg:py-28"
    >
      <div className={cn(reverse && "md:order-2")}>
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{service.kicker}</span>
          <h3 className="mt-4 font-display text-h3 font-semibold text-text-primary">{service.title}</h3>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary">{service.description}</p>
          <ul className="mt-7 flex flex-col gap-3">
            {service.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className={cn("flex justify-center", reverse && "md:order-1")}>
        {service.visual === "lighthouse" && <LighthouseGauge progress={progress} />}
        {service.visual === "prospection" && <ProspectionVisual progress={progress} />}
        {service.visual === "planning" && <SocialPlanningVisual progress={progress} />}
      </div>
    </div>
  );
}
