import { metaObject } from "@/config/site.config";
import Image from "next/image";
import React from "react";

export const metadata = {
  ...metaObject("Docs | About LMD 2.0"),
};

export default function AboutPage() {
  return (
    <article className="w-full max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">About</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
          Last Mile Data Portal 2.0
        </h1>
        <p className="text-lg text-muted-foreground">
          A programmatic data management &amp; reporting platform for Last Mile Health
        </p>
      </div>

      {/* Hero image */}
      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-10 bg-muted">
        <Image
          src="/assets/img/bg-landing-hero-2.png"
          alt="LMD Portal"
          fill
          className="object-cover"
        />
      </div>

      {/* Body */}
      <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed space-y-5 text-muted-foreground">
        <p>
          Half of the world&apos;s population lacks access to essential primary healthcare, including
          treatment for diarrhea, malaria, family planning, and prenatal care. This gap is
          particularly acute in remote communities, where an estimated two billion people live
          outside the reach of any healthcare services. The healthcare workforce shortage, already
          estimated at nearly 18 million people, has been exacerbated by the COVID-19 pandemic.
        </p>
        <p>
          Last Mile Health (LMH) partners with countries to bring high-quality primary healthcare
          to millions of rural people through teams of community and frontline health workers.
          LMH&apos;s work began in Liberia&apos;s remote, last mile communities in 2007. To manage
          the data and reporting needs, Last Mile Data Portal (LMD 1.0) was developed to track LMH
          organizational and programmatic efforts over time and make data-driven decisions using key
          performance indicators (KPIs).
        </p>
        <p>
          LMD 1.0 was built on a set of technologies that work well in low bandwidth environments,
          which was a primary requirement at the time. However, these technologies require extensive
          programming for their functionality, which is costly in terms of development and support.
        </p>
        <p>
          Over the last several years, LMH has gone global, evolving from a small organization
          directly implementing a community health worker (CHW) program in a single health district
          in remote Liberia to a global organization supporting community health systems in a
          diverse set of places (i.e. Ethiopia, Malawi, Sierra Leone, Uganda, etc.) and contexts.
          As the organization has evolved, so have its data sources and reporting needs. The costs
          associated with extending LMD 1.0 to accommodate these new needs is prohibitive.
          Scalability of the current system is also a challenge, as the current data warehouse is
          hosted on a private VPS.
        </p>
        <p>
          As LMH&apos;s work has grown beyond Liberia, the number of data sources and formats has
          increased, making it difficult to accurately track progress of country programs and make
          better data-driven decisions from the collected data. To solve this challenge, LMH has
          embarked on a journey to build a cloud-based next generation data management platform and
          portal (Last Mile Data 2.0 — LMD 2.0) with analytic capabilities as a long-term solution
          to extract actionable insights for more precise data-driven decisions.
        </p>
        <p>
          LMD 2.0 will deliver more functionality, a richer user experience, and a more extensible
          platform that allows developers and analysts to rapidly develop and deploy data collection,
          storage, and reporting systems. This work is critical to ensuring high data quality and
          access to data to support routine monitoring, evaluation, and learning activities across
          our growing programming in multiple countries.
        </p>
      </div>

      {/* Footer rule */}
      <div className="mt-12 pt-6 border-t border-border" />
    </article>
  );
}
