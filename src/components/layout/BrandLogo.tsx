import Image from "next/image";

import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  size?: "nav" | "footer";
  priority?: boolean;
};

export function BrandLogo({ className, size = "nav", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/terus/terus-logo-on-dark.png"
      alt="Terus Farm"
      width={470}
      height={384}
      priority={priority}
      className={cn("brand-logo", size === "footer" && "brand-logo--footer", className)}
    />
  );
}
