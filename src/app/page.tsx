import dynamic from "next/dynamic";

import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { StickyCTA } from "@/components/StickyCTA";

const Problem = dynamic(() => import("@/components/Problem").then((mod) => mod.Problem));
const FarmCockpit = dynamic(() => import("@/components/FarmCockpit").then((mod) => mod.FarmCockpit));
const AskTerus = dynamic(() => import("@/components/AskTerus").then((mod) => mod.AskTerus));
const AquafarmCase = dynamic(() =>
  import("@/components/AquafarmCase").then((mod) => mod.AquafarmCase),
);
const HowItWorks = dynamic(() => import("@/components/HowItWorks").then((mod) => mod.HowItWorks));
const FarmDiagnostic = dynamic(() =>
  import("@/components/FarmDiagnostic").then((mod) => mod.FarmDiagnostic),
);
const FinalCTA = dynamic(() => import("@/components/FinalCTA").then((mod) => mod.FinalCTA));

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <FarmCockpit />
        <AskTerus />
        <AquafarmCase />
        <HowItWorks />
        <FarmDiagnostic />
        <FinalCTA />
      </main>
      <StickyCTA />
    </>
  );
}
