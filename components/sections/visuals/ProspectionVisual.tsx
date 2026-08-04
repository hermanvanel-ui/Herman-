const ROWS = 4;
const COLS = 6;
const TOTAL = ROWS * COLS;

interface ProspectionVisualProps {
  progress: number;
}

export function ProspectionVisual({ progress }: ProspectionVisualProps) {
  const activeCount = Math.round(progress * TOTAL);

  return (
    <div className="flex aspect-square w-full max-w-sm flex-col justify-center rounded-lg border border-border bg-surface p-10">
      <div className="grid grid-cols-6 gap-4" role="img" aria-label="Visualisation des prospects identifiés">
        {Array.from({ length: TOTAL }).map((_, index) => {
          const active = index < activeCount;
          return (
            <span
              key={index}
              className="aspect-square rounded-full transition-all duration-500"
              style={{
                backgroundColor: active ? "#22D3EE" : "rgba(255,255,255,.08)",
                transform: active ? "scale(1)" : "scale(0.55)",
              }}
            />
          );
        })}
      </div>
      <div className="mt-8 flex items-baseline justify-between border-t border-border pt-6">
        <span className="font-mono text-3xl font-semibold tabular-nums text-accent">
          {Math.round(progress * 100)}
        </span>
        <span className="text-right text-xs uppercase tracking-[0.15em] text-text-tertiary">
          prospects qualifiés identifiés
        </span>
      </div>
    </div>
  );
}
