import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import Image from "next/image";
import SupportButton from "../components/SupportButton";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | Theory of Change"),
};

const KPIDashboardTocPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="Last Mile Health's Theory of Change" />
      <div className=" border border-primary dark:border-border rounded-lg h-full bg-background/50 overflow-y-scroll py-5 px-4 flex flex-col gap-10">
        <div className="  ">
          <h1 className="th-lmh-header-1">Strategy Statement</h1>
          <p className="">
            We partner with governments to expand access to high-quality
            community-based primary healthcare within reach of millions of
            people living in remote and rural communities by strengthening
            health systems, upskilling the health workforce, and delivering
            community-based care and treatment.
          </p>
        </div>

        <Image
          src="/assets/img/kpi-dashboard/toc.png"
          width={2136}
          height={1070}
          alt={""}
          className="px-4 md:px-6 xl:px-12 "
          placeholder={"blur"}
          blurDataURL="/assets/img/kpi-dashboard/toc.png"
          unoptimized
          quality={90}
        />

        <div className="py-6 ">
          <h1 className="th-lmh-header-1">Narrative</h1>

          <ul className="list-disc space-y-4 text-lmh-dark-grey th-font-roman px-4">
            <li>
              <span className="th-font-medium text-primary text-lg">
                Last Mile Health takes an ecosystems approach to improving
                health equity and health outcomes.
              </span>{" "}
              We expand access to high-quality community-based primary
              healthcare to within reach of millions of people living in remote
              and rural communities, we partnership with governments to
              strengthen health systems, upskill the health workforce, and
              deliver community-based care and treatment. Gender mainstreaming,
              social inclusion, evidence generation, and learning are principles
              of our programming at each of these levels:
            </li>

            <li>
              <span className="th-font-medium text-primary text-lg">
                Strengthen Systems
              </span>
              : Sustainable, responsive, and resilient community health systems
              are a fundamental element of high-quality community-based primary
              health care. To achieve impact, we lead advocacy activities with
              global norming bodies and national governments that garner
              political will and mobilize resources to build health systems
              where community and frontline health workers are supervised,
              salaried, supplied and skilled. In partnership with governments,
              we design and refine policies to achieve high performing and
              data-driven community health systems with robust governance,
              supply chains, and information systems.
            </li>

            <li>
              <span className="th-font-medium text-primary text-lg">
                Upskill the health workforce
              </span>
              : Skilled health professionals are required to manage and sustain
              community-based primary care. We partner with governments to
              design and implement curricula and training to upskill the
              community health workforce. As a result, health systems leaders
              develop and supplement their expertise to manage community health
              programs. Additionally, community and frontline health workers
              acquire new knowledge and skills that are applied through the
              delivery of health services.
            </li>

            <li>
              <span className="th-font-medium text-primary text-lg">
                Deliver effective community-based primary care
              </span>
              : To improve health equity and outcomes in rural and remote areas,
              we collaborate with communities to identify health needs and
              design responsive programs and innovations. Through this approach,
              we endeavor to improve access to and strengthen trust in
              community-based care delivered by community and frontline health
              workers. Further, that health workers are equitabibly selected,
              supervised, salaried, and supplied to provide high-quality care to
              last mile communities.
            </li>

            <li>
              <span className="th-font-medium text-primary text-lg">
                At Last Mile Health
              </span>
              , we take a continuous quality improvement approach to our
              programming by monitoring activities and evaluating outcomes and
              impacts in order to systematically learn from and strengthen our
              programming. We share these learnings through knowledge products
              and research publications.
            </li>
          </ul>
        </div>
      </div>
      <SupportButton />
    </>
  );
};

export default KPIDashboardTocPage;
