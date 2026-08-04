import { team, teamIntro } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { TeamCard } from "@/components/sections/TeamCard";

export function TeamSection() {
  return (
    <section id="equipe" className="border-b border-border bg-bg px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-content">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">L&apos;équipe</span>
          <h2 className="mt-4 max-w-2xl font-display text-h2 font-semibold text-text-primary">
            {teamIntro.title}
          </h2>
          <p className="mt-5 max-w-xl text-base text-text-secondary">{teamIntro.description}</p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <Reveal key={member.name} delay={(index % 3) * 0.06}>
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
