import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

const STEPS = [
  {
    icon: "description",
    title: "Step 1",
    copy: "Paste your CV into our secure input field.",
  },
  {
    icon: "work",
    title: "Step 2",
    copy: "Add the detailed job description for the role you want.",
    connected: true,
  },
  {
    icon: "psychology",
    title: "Step 3",
    copy: "Generate highly specific AI interview questions.",
    glow: true,
  },
];

const EXAMPLES = [
  {
    tags: [
      { label: "Technical", variant: "accent" as const },
      { label: "Senior", variant: "default" as const },
    ],
    question:
      "Describe a time you had to optimize a complex database query that was causing system bottlenecks. What was your approach?",
    focus: "Tests analytical skills and backend proficiency.",
  },
  {
    tags: [
      { label: "Behavioral", variant: "accent" as const },
      { label: "Leadership", variant: "default" as const },
    ],
    question:
      "How do you handle a situation where a key stakeholder strongly disagrees with your architectural decisions?",
    focus: "Evaluates communication and conflict resolution.",
  },
  {
    tags: [
      { label: "Strategic", variant: "accent" as const },
      { label: "Product", variant: "default" as const },
    ],
    question:
      "If given a legacy codebase with no documentation, what is your 30-day plan to understand and begin refactoring it?",
    focus: "Assesses planning and systematic problem solving.",
  },
];

export default function LandingPage() {
  return (
    <main className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-32">
      {/* Hero */}
      <section className="text-center flex flex-col items-center justify-center pt-20 pb-10">
        <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl mb-6">
          Generate the Best Interview Questions for Your Next Job
        </h1>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mb-12">
          Paste your CV and job description and get AI-generated interview questions tailored specifically for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/generate">
            <Button variant="neon" size="lg">
              <Icon name="bolt" />
              Generate My Questions
            </Button>
          </Link>
          <Link href="/#example-questions">
            <Button variant="neumorphic" size="lg">
              See Example
            </Button>
          </Link>
        </div>

      </section>

      {/* How It Works */}
      <section id="how-it-works" className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="font-headline-md text-headline-md text-on-surface">How It Works</h2>
          <div className="w-16 h-1 bg-primary-container mx-auto mt-4 rounded-full shadow-glow" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <Card key={step.title} className="flex flex-col items-center text-center gap-6 relative">
              {i === 1 ? (
                <div className="hidden md:block absolute top-1/2 -left-4 w-8 border-t border-dashed border-primary-container/50" />
              ) : null}
              <div
                className={`w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center text-primary-container border border-primary-container/30 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(255,255,255,0.03)] ${
                  step.glow ? "shadow-glow" : ""
                }`}
              >
                <Icon name={step.icon} size={28} filled />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">{step.title}</h3>
              <p className="font-body-base text-body-base text-on-surface-variant">{step.copy}</p>
              {i === 1 ? (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-primary-container/50" />
              ) : null}
            </Card>
          ))}
        </div>
      </section>

      {/* Example Questions */}
      <section id="example-questions" className="flex flex-col gap-12">
        <div className="text-left">
          <h2 className="font-headline-md text-headline-md text-on-surface">Example Questions</h2>
          <div className="w-16 h-1 bg-primary-container mt-4 rounded-full shadow-glow" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXAMPLES.map((ex) => (
            <Card key={ex.question} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                {ex.tags.map((tag) => (
                  <Chip key={tag.label} variant={tag.variant}>
                    {tag.label}
                  </Chip>
                ))}
              </div>
              <p className="font-body-base text-body-base text-on-surface font-medium">&ldquo;{ex.question}&rdquo;</p>
              <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <Icon name="info" className="text-sm text-primary-container" />
                {ex.focus}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="flex justify-center pb-20">
        <div className="bg-surface-container rounded-xl p-10 max-w-2xl w-full shadow-neumorphic border border-primary-container/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl -ml-10 -mb-10" />
          <h2 className="font-display-lg text-display-lg text-on-surface mb-2 relative z-10">Simple Pricing</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mb-8 relative z-10">
            Pay only for what you need to succeed.
          </p>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center justify-between p-4 bg-surface-variant/50 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <Icon name="visibility" className="text-primary-container" />
                <span className="font-headline-md text-[20px] text-on-surface">Free preview</span>
              </div>
              <span className="font-body-base text-body-base text-on-surface-variant">2 questions</span>
            </div>
            <div className="flex items-center justify-between p-6 bg-canvas rounded-lg border border-primary-container/30 shadow-neumorphic-inset-soft">
              <div className="flex flex-col items-start gap-1">
                <span className="font-headline-md text-headline-md text-primary-container drop-shadow-[0_0_8px_rgba(0,245,255,0.3)]">
                  Unlock Full Set
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  10 tailored questions &amp; focus areas
                </span>
              </div>
              <div className="text-right">
                <span className="font-display-lg text-[32px] text-on-surface">$5</span>
              </div>
            </div>
            <Link href="/generate">
              <Button variant="neon" size="lg" block className="mt-4">
                <Icon name="payments" />
                Pay via PayPal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
