import { Card } from "@/components/ui/card";

const LearningAgenda = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="bg-primary px-6 py-8 md:px-12 md:py-12 relative">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground tracking-wide">
              LEARNING AGENDA
            </h1>
          </div>
          <div className="bg-document-gray px-6 py-4 rounded-lg">
            <div className="text-primary text-lg md:text-xl font-bold">
              LAST
            </div>
            <div className="text-primary text-lg md:text-xl font-bold">
              MILE
            </div>
            <div className="text-primary text-lg md:text-xl font-bold">
              HEALTH
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 md:px-12 md:py-12">
        {/* Our Vision for Learning Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            OUR VISION FOR LEARNING
          </h2>
          <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              The Learning Agenda is a key initiative for Last Mile Health to
              gather evidence that strengthens the impact and influence of
              community health systems. It enables us to build robust and
              resilient community health systems that improve the health of
              remote populations. Aligned with Last Mile Health&apos;s Theory of
              Change and strategic plans, it focuses on evaluating the outcomes
              of our work and supporting continuous quality improvement.
            </p>
            <p>
              This Learning Agenda serves as a framework through which we
              collaboratively define and prioritize our key questions of focus,
              and begin to identify appropriate tactics and methods for
              addressing them, using any combination of monitoring, evaluation,
              research or learning tools. It also sets out a plan for further
              developing a &apos;culture&apos; of learning at Last Mile Health,
              building on historically strong commitment to data and evidence,
              and embracing a wider array of methods and tools, and more
              dispersed ownership of what, how, and why we learn.
            </p>
          </div>
        </section>

        {/* What is a Learning Agenda Callout */}
        <section className="mb-12">
          <Card className="bg-secondary text-secondary-foreground p-8 rounded-lg">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
              WHAT IS A LEARNING AGENDA?
            </h3>
            <div className="text-center text-base md:text-lg leading-relaxed">
              <p className="mb-4">
                A learning agenda is defined as a set of questions, planned
                activities and products that facilitate learning and decision
                making within an organization, operating unit, or team.
              </p>
              <p className="text-sm md:text-base font-medium">
                (USAID; Urban Institute).
              </p>
            </div>
          </Card>
        </section>

        {/* Who is this for Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            WHO IS THIS FOR?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            The primary audience for this Learning Agenda is Last Mile Health
            itself—our internal teams and country programs. By answering these
            questions, we aim to improve the quality and effectiveness of our
            work. In addition, the findings will also be shared with external
            stakeholders such as government partners, donors, and global health
            organizations to inform community health policy, programmatic
            decisions, and advocacy.
          </p>
        </section>

        {/* Purpose Section */}
        <section className="mb-12">
          <Card className="bg-document-gray text-document-gray-foreground p-8 rounded-lg">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
              PURPOSE
            </h3>
            <p className="text-center text-base md:text-lg leading-relaxed">
              LMH will test and evaluate the impact of its work on community
              health outcomes, systems, and cost, in order to provide continuous
              quality improvement internally and evidence of its effectiveness
              externally to governments, donors, communities, and partners
            </p>
          </Card>
        </section>

        {/* Concept Note Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            CONCEPT NOTE
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            The{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Learning Agenda Concept Note
            </a>{" "}
            details the vision and purpose of the Learning Agenda and how it
            fits in with the LMH Theory of Change.
          </p>
        </section>

        {/* Process So Far Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            PROCESS SO FAR
          </h2>
          <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            <p>
              The Learning Agenda was developed through a collaborative process.
              We started with the creation of a concept note and assembled an
              interdepartmental team which worked to clarify and document the
              base of evidence we know, trust, and use as a basis for our own
              Theory of Change, strategic plans, and emergent initiatives. (This
              set of evidence is now being incorporated into a digital Library
              on Slite, along with other programmatic resources.) Then we
              engaged teams through workshops and country listening tours to
              identify key questions for which we did not already have clear
              evidence and answers, particularly in our own contexts. These
              questions were then prioritized using criteria such as relevance
              to our work, impact, potential for utilization, and LMH&apos;s
              comparative advantage in addressing them. We also reviewed them
              for financial viability. This rigorous process ensured that our
              Learning Agenda aligns with both global and country-specific
              priorities. For more details on the process and timeline, see the
              presentation{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                here
              </a>
              .
            </p>
          </div>

          {/* Process Flow Diagram */}
          <div className="bg-primary p-8 rounded-lg mb-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="bg-primary-foreground text-primary px-6 py-3 rounded-full text-center max-w-xs">
                  <span className="text-sm md:text-base font-medium">
                    Org wide prioritization input
                  </span>
                </div>
                <div className="text-primary-foreground text-3xl">📋</div>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <div className="bg-primary-foreground text-primary px-6 py-3 rounded-full text-center max-w-xs">
                  <span className="text-sm md:text-base font-medium">
                    P&C input on financial viability
                  </span>
                </div>
                <div className="text-primary-foreground text-3xl">🤝</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="bg-primary-foreground text-primary px-6 py-3 rounded-full text-center max-w-xs">
                  <span className="text-sm md:text-base font-medium">
                    Learning Agenda core team defines final set of questions
                  </span>
                </div>
                <div className="text-primary-foreground text-3xl">📊</div>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <div className="bg-primary-foreground text-primary px-6 py-3 rounded-full text-center max-w-xs">
                  <span className="text-sm md:text-base font-medium">
                    Final set presented to GOG for discussion/approval
                  </span>
                </div>
                <div className="text-primary-foreground text-3xl">👥</div>
              </div>
            </div>
          </div>
        </section>

        {/* Where Does The Learning Agenda Fit In Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            WHERE DOES THE LEARNING AGENDA FIT IN?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            The set of questions we defined for the LMH Learning Agenda are
            framed around our Theory of Change. It should enable us to gather
            answers and evidence that will strengthen our impact and influence
            as we strive to build strong community health systems. This Learning
            Agenda will be a cornerstone in our roadmap for achieving Closing
            the Distance Strategic Objective #2: &quot;Evaluate the impact of
            Last Mile Health&apos;s accompaniment on community health outcomes,
            systems, and costs.&quot;
          </p>

          {/* Theory of Change Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-muted text-muted-foreground p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Outcome 1</h3>
              <p>
                Evidence map defines LMH&apos;s existing body of work and
                evidence
              </p>
            </Card>
            <Card className="bg-accent text-accent-foreground p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Outcome 2</h3>
              <p>
                Learning Agenda identifies key priorities for MERL engagement at
                country and global levels
              </p>
            </Card>
            <Card className="bg-yellow-500 text-white p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Outcome 3</h3>
              <p>Culture of learning strengthened at LMH</p>
            </Card>
          </div>
        </section>

        {/* Learning Agenda Theory of Change Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            LEARNING AGENDA THEORY OF CHANGE
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            The Learning Agenda has three main outcomes (mapped below). For more
            details the{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Learning Agenda Project Hub
            </a>{" "}
            details separate tasks and the existing workplan for each outcome.
          </p>

          {/* Theory of Change Flow */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-muted text-muted-foreground p-6 rounded-lg flex-1">
                <h3 className="font-bold text-lg mb-4">
                  Evidence map defines LMH&apos;s existing body of work and
                  evidence
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Key areas of existing, robust evidence mapped</li>
                  <li>
                    • Summary of the internal and external evidence base is
                    documented and available on Slite
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-accent text-accent-foreground p-6 rounded-lg flex-1">
                <h3 className="font-bold text-lg mb-4">
                  Learning Agenda identifies key priorities for MERL engagement
                  at country and global levels
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Key evidence gaps mapped and learning questions generated
                    and prioritized
                  </li>
                  <li>
                    • Learning Agenda developed (with Learning Questions,
                    methods and products)
                  </li>
                  <li>
                    • MERL Initiatives identified to address Learning Agenda
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-yellow-500 text-white p-6 rounded-lg flex-1">
                <h3 className="font-bold text-lg mb-4">
                  Culture of learning strengthened at LMH
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Staff socialized to Learning Agenda and related activities
                  </li>
                  <li>
                    • MERL resources developed with focus on research and
                    evaluation tools and SOPs
                  </li>
                  <li>
                    • Findings are used internally to contribute to Slite
                    resources, through active learning events, etc.
                  </li>
                  <li>
                    • Findings are used externally for advocacy and outreach, as
                    publications, presentations, blogs, advocacy talking points,
                    or other types of content
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Questions Section */}
        <section className="mb-16">
          <div className="bg-primary px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              CORE QUESTIONS
            </h2>
          </div>
          <div className="bg-card border-x border-b rounded-b-lg p-6 md:p-8">
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              Last Mile Health will focus on the following core questions to
              evaluate the impact of our work on community health outcomes,
              systems, and costs. They will guide our learning and
              decision-making starting in FY25:
            </p>

            <div className="space-y-8">
              {/* UPSKILL */}
              <div className="flex items-start gap-4">
                <div className="text-primary text-3xl">👥</div>
                <div>
                  <h3 className="text-primary font-bold text-lg mb-2">
                    UPSKILL
                  </h3>
                  <p className="text-foreground text-base">
                    What training approaches are effective in improving service
                    delivery by the community health system?
                  </p>
                </div>
              </div>

              {/* DELIVER */}
              <div className="flex items-start gap-4">
                <div className="text-primary text-3xl">🏥</div>
                <div>
                  <h3 className="text-primary font-bold text-lg mb-2">
                    DELIVER
                  </h3>
                  <p className="text-foreground text-base">
                    To what extent does CHW programming result in improvements
                    in maternal and child health (and reduction of mortality)?
                  </p>
                </div>
              </div>

              {/* STRENGTHEN */}
              <div className="flex items-start gap-4">
                <div className="text-primary text-3xl">⚙️</div>
                <div>
                  <h3 className="text-primary font-bold text-lg mb-2">
                    STRENGTHEN
                  </h3>
                  <p className="text-foreground text-base">
                    How can technology be effectively used to improve 6Ss in
                    rural African healthcare delivery systems?
                  </p>
                </div>
              </div>

              {/* STRENGTHEN/AFRICA FRONTLINE FIRST */}
              <div className="flex items-start gap-4">
                <div className="text-primary text-3xl">🤝</div>
                <div>
                  <h3 className="text-primary font-bold text-lg mb-2">
                    STRENGTHEN/AFRICA FRONTLINE FIRST
                  </h3>
                  <p className="text-foreground text-base">
                    In health finance (and HRH), how can LMH influence global
                    health initiatives like GAVI/GF and their strategies; does
                    that translate into better practices and more resources for
                    community health?
                  </p>
                </div>
              </div>
            </div>

            {/* How Do We Answer These Questions */}
            <div className="mt-12">
              <Card className="bg-primary text-primary-foreground p-6 rounded-lg text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold">
                  HOW DO WE ANSWER THESE QUESTIONS?
                </h3>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-document-gray text-document-gray-foreground p-6">
                  <h4 className="font-bold text-lg mb-4">
                    Variety of Methods:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Evaluations</li>
                    <li>• Research studies</li>
                    <li>• Routine monitoring</li>
                    <li>• Deeper analysis of existing data</li>
                    <li>• Planning for future data</li>
                  </ul>
                </Card>

                <Card className="bg-primary text-primary-foreground p-6">
                  <h4 className="font-bold text-lg mb-4">
                    Variety of Pathways:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Modify existing M&E plans/approaches</li>
                    <li>• Seek evidence/learning-specific funding</li>
                    <li>• Build robust M&E plans into proposals and budgets</li>
                  </ul>
                </Card>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  NEXT STEPS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-document-gray text-document-gray-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h4 className="font-bold text-lg">
                      Identify Opportunities
                    </h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-document-gray text-document-gray-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🧩</span>
                    </div>
                    <h4 className="font-bold text-lg">
                      Integrate with Program Design
                    </h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-document-gray text-document-gray-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h4 className="font-bold text-lg">Seek Funding</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Looking Ahead Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            LOOKING AHEAD
          </h2>
          <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              The findings will serve multiple strategic purposes: informing
              project improvements, identifying new intervention areas for
              development, strengthening capacity statements in future
              proposals, contributing to the broader CHW evidence base through
              networks like CHIC, and supporting governments in shaping
              effective programs and policies.
            </p>
            <p>
              Addressing these research questions is central to the Closing the
              Distance Strategy and represents an ongoing, iterative process. As
              new findings emerge, they should directly inform strategic
              decisions including annual planning cycles and resource
              allocation. Equally important is recognizing what remains
              unknown—these knowledge gaps must be actively monitored and
              addressed through continuous learning and adaptation. This dynamic
              approach ensures that both answered and unanswered questions shape
              our strategic direction, creating a feedback loop between evidence
              generation and program implementation that strengthens over time.{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                This sheet
              </a>{" "}
              tracks current opportunities and how they map to the learning
              agenda.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LearningAgenda;
