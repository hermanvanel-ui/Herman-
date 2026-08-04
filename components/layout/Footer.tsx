import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { navLinks, siteConfig, footerContent } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-content px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-text-secondary">{footerContent.baseline}</p>
            <p className="mt-6 font-mono text-xs text-text-tertiary">
              {siteConfig.contact.email}
              <br />
              {siteConfig.contact.phone}
              <br />
              {siteConfig.contact.city}
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-medium uppercase tracking-[0.12em] text-text-primary">
              {footerContent.sitemapTitle}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-medium uppercase tracking-[0.12em] text-text-primary">
              {footerContent.legalTitle}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="font-mono text-xs text-text-tertiary">{footerContent.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
