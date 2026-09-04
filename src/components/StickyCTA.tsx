"use client";

import { useEffect, useState } from "react";

import { getDemoHref } from "@/config/contact";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function StickyCTA() {
  const [mode, setMode] = useState<"hidden" | "raiox" | "demo">("hidden");

  useEffect(() => {
    const hero = document.getElementById("topo");
    const form = document.getElementById("raio-x");
    if (!hero || !form) return;

    const state = { hero: true, form: false };

    const update = () => {
      if (state.form) setMode("hidden");
      else if (state.hero) setMode("hidden");
      else setMode("raiox");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "topo") state.hero = entry.isIntersecting;
          if (entry.target.id === "raio-x") state.form = entry.isIntersecting;
        }
        const afterForm = window.scrollY > form.offsetTop + form.offsetHeight * 0.35;
        if (!state.hero && !state.form && afterForm) {
          setMode("demo");
          return;
        }
        update();
      },
      { threshold: 0.18 },
    );

    observer.observe(hero);
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const isDemo = mode === "demo";
  const href = isDemo ? getDemoHref() : "#raio-x";

  return (
    <div className={cn("sticky-cta md:hidden", mode !== "hidden" && "is-visible")}>
      <a
        href={href}
        className="btn btn-primary shadow-floating"
        onClick={() => track(isDemo ? "demo_click" : "hero_cta_click", { source: "sticky" })}
      >
        {isDemo ? "Agendar demonstração" : "Fazer meu Raio-X"}
      </a>
    </div>
  );
}
