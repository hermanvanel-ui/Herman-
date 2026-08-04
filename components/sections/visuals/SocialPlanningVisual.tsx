import { cn } from "@/lib/utils";

const PLATFORMS = [
  { key: "Instagram", color: "#E1306C" },
  { key: "Facebook", color: "#1877F2" },
  { key: "X", color: "#F5F5F7" },
  { key: "Threads", color: "#A1A1AA" },
];

const CELLS = 21;

interface SocialPlanningVisualProps {
  progress: number;
}

export function SocialPlanningVisual({ progress }: SocialPlanningVisualProps) {
  const activeCount = Math.round(progress * CELLS);

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.15em] text-text-tertiary">Planning automatique</span>
        <span className="font-mono text-xs text-accent">
          {activeCount}/{CELLS}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2" role="img" aria-label="Calendrier de publication automatique se remplissant">
        {Array.from({ length: CELLS }).map((_, index) => {
          const active = index < activeCount;
          const platform = PLATFORMS[index % PLATFORMS.length]!;
          return (
            <div
              key={index}
              className={cn(
                "flex aspect-square items-center justify-center rounded-[6px] border transition-all duration-500",
                active ? "border-transparent" : "border-border"
              )}
              style={{ backgroundColor: active ? `${platform.color}22` : "transparent" }}
            >
              {active && (
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
        {PLATFORMS.map((platform) => (
          <span key={platform.key} className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: platform.color }} />
            {platform.key}
          </span>
        ))}
      </div>
    </div>
  );
}
