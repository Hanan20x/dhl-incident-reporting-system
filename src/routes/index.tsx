import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Workflow, Brain, ArrowRight } from "lucide-react";
import dhlLogo from "@/assets/dhl-logo.png";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "AI‑Enhanced Incident Reporting & Resolution System" },
      {
        name: "description",
        content:
          "AI‑powered incident reporting and resolution for DHL operations — capture, triage, and resolve faster.",
      },
    ],
  }),
});

function LandingPage() {
  const authed = auth.isAuthed();

  const features = [
    {
      icon: Brain,
      title: "AI Triage",
      desc: "Automatically classify incidents by type, source and priority.",
    },
    {
      icon: Workflow,
      title: "Unified Intake",
      desc: "Capture from email, Telegram, Teams, phone, images and handwritten notes.",
    },
    {
      icon: ShieldCheck,
      title: "Faster Resolution",
      desc: "Track status, history and assignments across departments in one place.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={dhlLogo}
              alt="DHL"
              width={1024}
              height={1024}
              className="h-8 w-auto object-contain"
            />
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              Incident Reporting & Resolution
            </span>
          </div>
          <div className="flex items-center gap-2">
            {authed ? (
              <Button asChild>
                <Link to="/dashboard">
                  Open Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            AI‑Enhanced Incident Reporting & Resolution System
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A smarter way for DHL teams to capture, classify and resolve operational incidents —
            from late deliveries to damaged parcels — across every channel.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to={authed ? "/dashboard" : "/login"}>
                Get started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/incidents/create">Report an incident</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DHL — Internal tool
        </div>
      </footer>
    </div>
  );
}
