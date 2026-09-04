"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { IconClose, IconMenu } from "@/components/ui/Icons";
import { COPY } from "@/data/farm";
import { cn } from "@/lib/cn";
import { useScrolled } from "@/lib/hooks";

const LINKS = [
  { href: "#produto", label: "Produto" },
  { href: "#ask-terus", label: "Ask Terus" },
  { href: "#aquafarm", label: "Case" },
  { href: "#raio-x", label: "Raio-X" },
];

export function Navbar() {
  const scrolled = useScrolled(16);
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("navbar tf-glass", scrolled && "is-scrolled")}>
      <div className="tf-container navbar-inner">
        <a href="#topo" className="logo-mark" aria-label="Terus Farm">
          TERUS <span>FARM</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Seções">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="#raio-x" size="md" className="min-w-[9.5rem]">
            {COPY.hero.secondaryCta}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-surface-border text-text-primary md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="tf-container border-t border-surface-border-subtle pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Menu móvel">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-text-secondary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button href="#raio-x" onClick={() => setOpen(false)}>
              {COPY.hero.secondaryCta}
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
