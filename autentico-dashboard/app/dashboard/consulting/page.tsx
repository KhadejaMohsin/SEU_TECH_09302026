import {
  ArrowRight,
  BookOpenCheck,
  Compass,
  FileSearch,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    title: "Interpret visibility results",
    description:
      "Understand where your products appear, which prompts surface them, and what the patterns may mean.",
    icon: FileSearch,
  },
  {
    title: "Prioritize corrective actions",
    description:
      "Focus review effort on high-impact misinformation, missing facts, and trust risks first.",
    icon: Compass,
  },
  {
    title: "Improve product content",
    description:
      "Make specifications, pricing, availability, and policies clearer and easier to verify.",
    icon: BookOpenCheck,
  },
  {
    title: "Plan accountable next steps",
    description:
      "Build a practical improvement plan with governance checkpoints and clear ownership.",
    icon: ShieldCheck,
  },
];

const consultationTopics = [
  "Why NovaBook products are missing from student shopping prompts",
  "Which pricing, warranty, or availability claims need source-of-truth review",
  "How to prioritize structured data and third-party product coverage",
];

export default function ConsultingPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-brand-surface pb-5">
        <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
          <span>FuenteLuz advisory</span>
          <span className="size-1 rounded-full bg-brand-yellow" />
          <span>Claro Consulting</span>
        </div>
        <h1 className="font-display text-[26px] font-bold leading-tight text-brand-cream sm:text-[30px]">
          Human guidance for your AI visibility program
        </h1>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-brand-muted">
          Claro Consulting is FuenteLuz’s human advisory service. Work with an advisor to interpret AI visibility results, prioritize fixes, improve product content, and plan next steps.
        </p>
      </header>

      <section aria-labelledby="services-heading">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-brand-cream" id="services-heading">
            How Claro can help
          </h2>
          <p className="mt-1 text-[10px] text-brand-muted">
            Practical support for your team, grounded in your product facts and visibility signals.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="rounded-md border border-brand-surface bg-brand-navy p-4" key={service.title}>
                <span className="flex size-8 items-center justify-center rounded-md bg-brand-blue/20 text-brand-sky">
                  <Icon size={16} />
                </span>
                <h3 className="mt-3 text-xs font-semibold text-brand-cream">{service.title}</h3>
                <p className="mt-1.5 text-[10px] leading-5 text-brand-muted">{service.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5" aria-labelledby="topics-heading">
        <h2 className="text-sm font-semibold text-brand-cream" id="topics-heading">
          Example consultation topics
        </h2>
        <ul className="mt-3 space-y-2">
          {consultationTopics.map((topic) => (
            <li className="flex items-start gap-2 text-[10px] leading-5 text-brand-cream/85" key={topic}>
              <ArrowRight className="mt-1 shrink-0 text-brand-yellow" size={12} />
              {topic}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-md border border-brand-blue/40 bg-brand-blue/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" aria-label="Demo consultation booking">
        <div>
          <h2 className="text-sm font-semibold text-brand-cream">Ready to plan your next step?</h2>
          <p className="mt-1 text-[10px] leading-4 text-brand-muted">
            Consultation scheduling is a prototype and is not connected to a booking service.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Booking is not connected in this demo"
          className="inline-flex min-h-10 shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-brand-sky/30 bg-brand-blue/30 px-4 py-2 text-xs font-semibold text-brand-sky opacity-75"
        >
          <Lightbulb size={14} />
          Schedule a Consultation
        </button>
      </section>
    </div>
  );
}
