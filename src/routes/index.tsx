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
              <Button asChild className="bg-[#D40511] text-white hover:bg-[#b80410]">
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #FFCC00 0%, #FFE066 45%, #FFFFFF 100%)",
          }}
        >
          {/* Decorative red lines (DHL signature) */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
            <div
              className="absolute -left-20 top-10 h-2 w-[500px] rotate-[-8deg]"
              style={{ backgroundColor: DHL_RED }}
            />
            <div
              className="absolute -left-20 top-20 h-2 w-[400px] rotate-[-8deg]"
              style={{ backgroundColor: DHL_RED }}
            />
            <div
              className="absolute right-0 bottom-10 h-2 w-[500px] rotate-[-8deg]"
              style={{ backgroundColor: DHL_RED }}
            />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
            <img
              src={dhlLogo}
              alt="DHL"
              width={1536}
              height={1024}
              className="mx-auto mb-10 h-28 w-auto object-contain sm:h-36"
            />

            <h1
              className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
              style={{ color: DHL_RED }}
            >
              AI Enhanced Incident Reporting &amp; Resolution System
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-800 sm:text-lg">
              A smarter way for DHL teams to capture, classify and resolve operational
              incidents across every channel, from late deliveries to damaged parcels.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#D40511] text-white shadow-lg shadow-red-900/20 hover:bg-[#b80410]"
              >
                <Link to={authed ? "/dashboard" : "/login"}>
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#D40511] bg-white text-[#D40511] hover:bg-[#FFF7CC]"
              >
                <Link to="/incidents/create">Report an incident</Link>
              </Button>
            </div>
          </div>

          {/* Bottom red bar of hero */}
          <div className="h-1.5 w-full" style={{ backgroundColor: DHL_RED }} />
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

        {/* CTA band */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: DHL_RED }}
        >
          <div
            className="absolute -bottom-1 left-0 right-0 h-2"
            style={{ backgroundColor: DHL_YELLOW }}
          />
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-14 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: DHL_YELLOW, color: DHL_RED }}
              >
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Ready to resolve incidents faster?
                </h3>
                <p className="text-sm text-white/85">
                  Sign in and let AI handle the heavy lifting.
                </p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-[#D40511] hover:bg-[#FFF7CC]"
            >
              <Link to={authed ? "/dashboard" : "/login"}>
                {authed ? "Open Dashboard" : "Sign in"}{" "}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
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
