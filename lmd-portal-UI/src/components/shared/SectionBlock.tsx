import { cn } from "@/lib/utils";
import React from "react";

export default function SectionBlock({
  children,
  title,
  titleClassName,
  className,
}: React.PropsWithChildren<{
  title?: string;
  titleClassName?: string;
  className?: string;
}>) {
  return (
    <section className={cn(" border-red-200 mb-10 ", className)}>
      <header>
        <h1 className={cn("th-lmh-header-1", titleClassName)}>{title}</h1>
      </header>

      {children}
    </section>
  );
}
