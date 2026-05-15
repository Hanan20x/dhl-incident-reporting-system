import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Workflow, Brain, ArrowRight, Zap } from "lucide-react";
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

const DHL_RED = "#D40511";
const DHL_YELLOW = "#FFCC00";

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
      {/* Top DHL yellow stripe */}
      <div className="h-2 w-full" style={{ backgroundColor: DHL_YELLOW }} />

      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src={dhlLogo}
              alt="DHL"
              width={1024}
              height={1024}
              className="h-14 w-auto object-contain"
            />
            <div className="hidden h-10 w-px bg-border sm:block" />
            <span
              className="hidden text-sm font-semibold tracking-wide sm:inline"
              style={{ color: DHL_RED }}
            >
              Incident Reporting & Resolution
            </span>
          </div>
          <div className="flex items-center gap-2">
            {authed ? (
              <Button asChild className="bg-[#D40511] text-white hover:bg-[#b80410]">
                <Link to="/dashboard">
                  Open Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#D40511] bg-white text-[#D40511] hover:bg-[#FFF7CC]"
                >
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-[#D40511] text-white hover:bg-[#b80410]">
                  <Link to="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#FFFBEB" }}>
          <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
              style={{ backgroundColor: DHL_RED }}
            >
              Internal Tool
            </span>

            <h1
              className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl"
            >
              AI Enhanced Incident{" "}
              <span style={{ color: DHL_RED }}>Reporting &amp; Resolution</span>{" "}
              System
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-600 sm:text-lg">
              A smarter way for DHL teams to capture, classify and resolve operational
              incidents across every channel, from late deliveries to damaged parcels.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#D40511] text-white hover:bg-[#b80410]"
              >
                <Link to={authed ? "/dashboard" : "/login"}>
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
              >
                <Link to="/incidents/create">Report an incident</Link>
              </Button>
            </div>
          </div>

          {/* Subtle yellow accent bar */}
          <div className="h-1 w-full" style={{ backgroundColor: DHL_YELLOW }} />
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: DHL_RED }}
            >
              What it does
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Everything you need to stay ahead of incidents
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: DHL_YELLOW }}
                />
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ backgroundColor: DHL_RED }}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DHL — Internal tool
        </div>
      </footer>
    </div>
  );
}
