const START_SCORE = 42;
const END_SCORE = 98;
const RADIUS = 84;
const CIRCUMFERENCE = Math.PI * RADIUS;

function scoreColor(score: number): string {
  if (score < 50) return "#FB7185";
  if (score < 90) return "#FBBF24";
  return "#34D399";
}

interface LighthouseGaugeProps {
  progress: number;
}

export function LighthouseGauge({ progress }: LighthouseGaugeProps) {
  const score = Math.round(START_SCORE + (END_SCORE - START_SCORE) * progress);
  const dashOffset = CIRCUMFERENCE * (1 - score / 100);
  const color = scoreColor(score);

  return (
    <div className="relative flex aspect-square w-full max-w-sm items-center justify-center rounded-lg border border-border bg-surface p-8">
      <svg viewBox="0 0 200 120" className="w-full" role="img" aria-label={`Score de performance : ${score} sur 100`}>
        <path
          d="M 16 100 A 84 84 0 0 1 184 100"
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 16 100 A 84 84 0 0 1 184 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center pt-6">
        <span className="font-mono text-5xl font-semibold tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.15em] text-text-tertiary">
          Score de performance
        </span>
      </div>
    </div>
  );
}
