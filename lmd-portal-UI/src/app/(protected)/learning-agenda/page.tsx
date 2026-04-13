import { metaObject } from "@/config/site.config";
import Image from "next/image";
import React, { ReactNode } from "react";
import LearningAgenda from "./_components/main";
import { Card } from "@/components/ui/card";
import ProcessSoFarImg from "../../../../public/assets/img/learning-agenda/process-so-far.png";
import NextStep1 from "../../../../public/assets/img/learning-agenda/next-step-1.png";
import NextStep2 from "../../../../public/assets/img/learning-agenda/next-step-2.png";
import NextStep3 from "../../../../public/assets/img/learning-agenda/next-step-3.png";
import WhereWeAre from "../../../../public/assets/img/learning-agenda/where-we-are.png";
import Phase1 from "../.././../../public/assets/img/learning-agenda/ph-1.png";
import Phase2 from "../.././../../public/assets/img/learning-agenda/ph-2.png";
import Phase3 from "../.././../../public/assets/img/learning-agenda/ph-3.png";

import Link from "next/link";
import { PaintbrushUnderline } from "@/components/landingPageComponents/Features2";
import PhaseCard from "./_components/phaseCard";

export const metadata = {
  ...metaObject("Learning Agenda"),
};

const TextSection = ({ title, body }: { title: string; body: ReactNode }) => {
  return (
    <section className="mb-12 th-font-book">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground  uppercase underline-hover w-fit">
        {title}
      </h2>
      <div className="space-y-4 text-muted-foreground text-[#1a3847] text-base md:text-lg leading-relaxed ">
        {body}
      </div>
    </section>
  );
};

const ListCards = ({ title, body }: { title: string; body: ReactNode }) => {
  return (
    <Card className="group py-4 px-8 rounded-md border border-none  bg-transparent  hover:shadow-none shadow-none hover:border-none hover:bg-gray-100">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-lmh-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            ></path>
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#6e8b9e] mb-1 group-hover:text-lmh-blue transition-colors duration-300 uppercase">
            {title}
          </h1>
          <div className="text-lmh-dark-grey text-lg leading-relaxed  font-medium th-font-roman">
            {body}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function LearningAgendaPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 xl:px-12 2xl:px-4 flex flex-col gap-10 bg-background pb-10 mb-10 overflow-x-hidden">
      {/* header */}
      <header className="bg-primary px-6 py-8 md:px-12 md:py-12 relative mt-2">
        <div className="max-w-7xl mx-auto flex justify-start items-start">
          <div className="w-full mt-5 -mb-5">
            <h1 className="text-2xl md:text-4xl font-semibold text-gray-200 tracking-wide"></h1>
            <PaintbrushUnderline
              text="LEARNING AGENDA"
              className="header-text-1 text-white "
            />
          </div>
        </div>
      </header>

      <main className="">
        <div className="mx-auto max-w-6xl space-y-20">
          {/* Our Vision for Learning Section */}
          <TextSection
            title="OUR VISION FOR LEARNING"
            body={
              <>
                <p>
                  The Learning Agenda is a key initiative for Last Mile Health
                  to gather evidence that strengthens the impact and influence
                  of community health systems. It enables us to build robust and
                  resilient community health systems that improve the health of
                  remote populations. Aligned with Last Mile Health&apos;s
                  Theory of Change and strategic plans, it focuses on evaluating
                  the outcomes of our work and supporting continuous quality
                  improvement.
                </p>
                <p>
                  This Learning Agenda serves as a framework through which we
                  collaboratively define and prioritize our key questions of
                  focus, and begin to identify appropriate tactics and methods
                  for addressing them, using any combination of monitoring,
                  evaluation, research or learning tools. It also sets out a
                  plan for further developing a &apos;culture&apos; of learning
                  at Last Mile Health, building on historically strong
                  commitment to data and evidence, and embracing a wider array
                  of methods and tools, and more dispersed ownership of what,
                  how, and why we learn.
                </p>

                <div className="flex flex-col items-center justify-center py-8">
                  <Card className="bg-lmh-pink text-white p-8 rounded-none max-w-4xl">
                    <h3 className="text-xl md:text-2xl font-bold text-center mb-4">
                      WHAT IS A LEARNING AGENDA?
                    </h3>
                    <div className="text-center text-base md:text-lg leading-relaxed">
                      <p className="mb-4">
                        A learning agenda is defined as a set of questions,
                        planned activities and products that facilitate learning
                        and decision making within an organization, operating
                        unit, or team.
                      </p>
                      <p className="text-sm md:text-base font-medium">
                        (USAID; Urban Institute).
                      </p>
                    </div>
                  </Card>
                </div>
              </>
            }
          />

          <TextSection
            title="WHO IS THIS FOR?"
            body={
              <>
                <p>
                  The primary audience for this Learning Agenda is Last Mile
                  Health itself - our internal teams and country programs. By
                  answering these questions, we aim to improve the quality and
                  effectiveness of our work. In addition, the findings will also
                  be shared with external stakeholders such as government
                  partners, donors, and global health organizations to inform
                  community health policy, programmatic decisions, and advocacy.
                </p>

                <div className="flex flex-col items-center justify-center py-8">
                  <Card className="bg-[#434343] text-white p-8 rounded-none max-w-4xl">
                    <h3 className="text-xl md:text-2xl font-bold text-center mb-2">
                      PURPOSE
                    </h3>
                    <div className="text-center text-base md:text-lg leading-relaxed">
                      <p className="mb-4">
                        LMH will test and evaluate the impact of its work on
                        community health outcomes, systems, and cost, in order
                        to provide continuous quality improvement internally and
                        evidence of its effectiveness externally to governments,
                        donors, communities, and partners
                      </p>
                    </div>
                  </Card>
                </div>
              </>
            }
          />

          <TextSection
            title="CONCEPT NOTE"
            body={
              <p>
                The{" "}
                <Link
                  className="underline text-lmh-blue"
                  href={
                    "https://docs.google.com/document/d/1svmsgqUyKoglhr8kDHTuVaTniigC5CIR/edit"
                  }
                  target={"_blank"}
                >
                  Learning Agenda Concept Note
                </Link>{" "}
                details the vision and purpose of the Learning Agenda and how it
                fits in with the LMH Theory of Change.
              </p>
            }
          />

          <TextSection
            title="PROCESS SO FAR"
            body={
              <>
                <p>
                  The Learning Agenda was developed through a collaborative
                  process. We started with the creation of a concept note and
                  assembled an interdepartmental team which worked to clarify
                  and document the base of evidence we know, trust, and use as a
                  basis for our own Theory of Change, strategic plans, and
                  emergent initiatives. (This set of evidence is now being
                  incorporated into a digital Library on Slite, along with other
                  programmatic resources.) Then we engaged teams through
                  workshops and country listening tours to identify key
                  questions for which we did not already have clear evidence and
                  answers, particularly in our own contexts. These questions
                  were then prioritized using criteria such as relevance to our
                  work, impact, potential for utilization, and LMH&apos;s
                  comparative advantage in addressing them. We also reviewed
                  them for financial viability. This rigorous process ensured
                  that our Learning Agenda aligns with both global and
                  country-specific priorities. For more details on the process
                  and timeline, see the presentation{" "}
                  <Link
                    className="underline text-lmh-blue"
                    href={
                      "https://docs.google.com/presentation/d/1nZSTqxl3sbVDDrGqnR0yi-8578AKxUxXQTerMidPFSg/edit?slide=id.p1#slide=id.p1"
                    }
                    target={"_blank"}
                  >
                    here
                  </Link>
                  .
                </p>

                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={ProcessSoFarImg}
                    alt={"process so far img"}
                    priority
                  />
                </div>
              </>
            }
          />

          <TextSection
            title="WHERE DOES THE LEARNING AGENDA FIT IN?"
            body={
              <>
                <p>
                  The set of questions we defined for the LMH Learning Agenda
                  are framed around our Theory of Change. It should enable us to
                  gather answers and evidence that will strengthen our impact
                  and influence as we strive to build strong community health
                  systems. This Learning Agenda will be a cornerstone in our
                  roadmap for achieving Closing the Distance Strategic Objective
                  #2:{" "}
                  <span className="font-medium th-font-heavyOblique text-lmh-dark-blue">
                    “Evaluate the impact of Last Mile Health&apos;s
                    accompaniment on community health outcomes, systems, and
                    costs.”
                  </span>
                </p>

                {/* image goes here */}
                <div className="flex flex-col items-center justify-center text-">
                  <Image
                    src={WhereWeAre}
                    alt="current phase in the learning agenda"
                  />
                </div>
              </>
            }
          />

          <TextSection
            title="Learning agenda theory of change"
            body={
              <>
                <p>
                  The Learning Agenda has three main outcomes (mapped below).
                  For more details the{" "}
                  <Link
                    className="underline text-lmh-blue"
                    target={"_blank"}
                    href={
                      "https://docs.google.com/spreadsheets/d/1sGErs18Y3sT5bdFhRo8UsGV1fEssDKMzwnHs4VGF78M/edit?gid=1227030696#gid=1227030696"
                    }
                  >
                    Learning Agenda Project Hub
                  </Link>{" "}
                  details separate tasks and the existing workplan for each
                  outcome.
                </p>

                {/* image here */}
                <div className="space-y-6">
                  {/* Phase 1 */}
                  <PhaseCard
                    phase="Phase 1"
                    title="Foundation & Mapping"
                    imageSrc={Phase1}
                    imageAlt="phase 1"
                    colorScheme="gray"
                    items={[
                      "Key areas of existing, robust evidence mapped",
                      "Summary of the internal and external evidence base is documented and available on Slite",
                    ]}
                  />

                  {/* Phase 2 with reverse layout */}
                  <PhaseCard
                    phase="Phase 2"
                    title="Development & Prioritization"
                    imageSrc={Phase2}
                    imageAlt="phase 2"
                    colorScheme="green"
                    items={[
                      "Key evidence gaps mapped and learning questions generated and prioritized",
                      "Learning Agenda developed (with Learning Questions, methods and products)",
                      "MERL Initiatives identified to address Learning Agenda",
                    ]}
                  />

                  {/* Phase 3 */}
                  <PhaseCard
                    phase="Phase 3"
                    title="Implementation & Impact"
                    imageSrc={Phase3}
                    imageAlt="phase 3"
                    colorScheme="yellow"
                    items={[
                      "Staff socialized to Learning Agenda and related activities",
                      "MERL resources developed with focus on research and evaluation tools and SOPs",
                      "Findings are used internally to contribute to Slite resources, through active learning events, etc.",
                      "Findings are used externally for advocacy and outreach, as publications, presentations, blogs, advocacy talking points, or other types of content",
                    ]}
                  />
                </div>
              </>
            }
          />

          <TextSection
            title=""
            body={
              <>
                <div className="-ml-[3.5vw] mr-[25vw] lg:mr-[35vw] ">
                  <div className="border bg-lmh-blue rounded-e-full h-20 flex items-center p-6">
                    <h1 className="uppercase font-semibold text-2xl text-white">
                      core questions
                    </h1>
                  </div>
                </div>
                <div className="space-y-2 ">
                  {/* Hero Card */}
                  <Card className="bg-gradient-to-r from-lmh-dark-blue via-lmh-blue to-lmh-dark-blue text-white p-6 md:p-8 rounded-none shadow-lg text-center transform hover:scale-[1.02] transition-all duration-300">
                    <p className="text-lg md:text-xl leading-relaxed font-medium">
                      Last Mile Health will focus on the following core
                      questions to evaluate the impact of our work on community
                      health outcomes, systems, and costs. They will guide our
                      learning and decision-making starting in FY25:
                    </p>
                  </Card>

                  {/* UPSKILL Card */}
                  <ListCards
                    title="UPSKILL"
                    body={
                      <p>
                        What training approaches are effective in improving
                        service delivery by the community health system?
                      </p>
                    }
                  />

                  <ListCards
                    title="deliver"
                    body={
                      <p>
                        To what extent does CHW programming result in
                        improvements in maternal and child health (and reduction
                        of mortality)?
                      </p>
                    }
                  />
                  <ListCards
                    title="Strengthen"
                    body={
                      <p>
                        How can technology be effectively used to improve 6Ss in
                        rural African healthcare delivery systems?
                      </p>
                    }
                  />

                  <ListCards
                    title="Strengthen/Africa frontline first"
                    body={
                      <p>
                        In health finance (and HRH), how can LMH influence
                        global health initiatives like GAVI/GF and their
                        strategies; does that translate into better practices
                        and more resources for community health?
                      </p>
                    }
                  />
                </div>

                <div className="-mr-[3.5vw] ml-[25vw] lg:ml-[35vw] pt-5">
                  <div className="border bg-lmh-blue rounded-s-full h-20 flex items-center justify-end p-6">
                    <h1 className="uppercase font-semibold text-2xl text-white ">
                      HOW DO WE ANSWER THESE QUESTIONS?
                    </h1>
                  </div>
                </div>

                {/* Methods and Pathways Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                  {/* bg-gradient-to-br from-lmh-dark-blue via-blue-700 to-blue-800 */}
                  <Card className="bg-lmh-dark-blue p-8 text-white rounded-sm shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            ></path>
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold">
                          Variety of Methods:
                        </h2>
                      </div>
                      <ul className="space-y-1 text-white/90 pl-4">
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Evaluations</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Research studies</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Routine monitoring</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Deeper analysis of existing data</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Planning for future data</span>
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="bg-lmh-blue  p-8 text-white rounded-sm shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            ></path>
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold">
                          Variety of Pathways:
                        </h2>
                      </div>
                      <ul className="space-y-1 text-white/90 pl-4">
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Modify existing M&E plans/approaches</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Seek evidence/learning-specific funding</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>
                            Build robust M&E plans into proposals and budgets
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </>
            }
          />

          <TextSection
            title="NEXT STEPS"
            body={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                <Card className="bg-background border-none hover:bg-gray-100 p-6 flex flex-col items-center justify-center min-h-[200px] h-full">
                  <Image
                    src={NextStep1}
                    alt={"Next Step 1"}
                    width={105}
                    height={105}
                  />
                  <h1 className="text-lmh-dark-blue dark:text-foreground font-semibold text-center mt-4">
                    Identify Opportunities
                  </h1>
                </Card>
                <Card className="bg-background border-none hover:bg-gray-100 p-6 flex flex-col items-center justify-center min-h-[200px] h-full">
                  <Image
                    src={NextStep2}
                    alt={"Next Step 2"}
                    width={105}
                    height={105}
                  />
                  <h1 className="text-lmh-dark-blue dark:text-foreground font-semibold text-center mt-4">
                    Integrate with Program Design
                  </h1>
                </Card>
                <Card className="bg-background border-none hover:bg-gray-100 p-6 flex flex-col items-center justify-center min-h-[200px] h-full">
                  <Image
                    src={NextStep3}
                    alt={"Next Step 3"}
                    width={105}
                    height={105}
                  />
                  <h1 className="text-lmh-dark-blue dark:text-foreground font-semibold text-center mt-4">
                    Seek Funding
                  </h1>
                </Card>
              </div>
            }
          />

          <TextSection
            title="looking ahead"
            body={
              <>
                <p>
                  The findings will serve multiple strategic purposes: informing
                  project improvements, identifying new intervention areas for
                  development, strengthening capacity statements in future
                  proposals, contributing to the broader CHW evidence base
                  through networks like CHIC, and supporting governments in
                  shaping effective programs and policies.
                </p>

                <p>
                  Addressing these research questions is central to the Closing
                  the Distance Strategy and represents an ongoing, iterative
                  process. As new findings emerge, they should directly inform
                  strategic decisions including annual planning cycles and
                  resource allocation. Equally important is recognizing what
                  remains unknown—these knowledge gaps must be actively
                  monitored and addressed through continuous learning and
                  adaptation. This dynamic approach ensures that both answered
                  and unanswered questions shape our strategic direction,
                  creating a feedback loop between evidence generation and
                  program implementation that strengthens over time.{" "}
                  <Link
                    href={
                      "https://docs.google.com/spreadsheets/d/1PhMpeoj_mxJb79b42-K6A8WC_w5H7RZwyCfxyFiPfJs/edit?gid=1518727440#gid=1518727440"
                    }
                    target={"_blank"}
                    className="underline text-lmh-blue"
                  >
                    This sheet
                  </Link>{" "}
                  tracks current opportunities and how they map to the learning
                  agenda.
                </p>
              </>
            }
          />
        </div>
      </main>
    </div>
  );
}
