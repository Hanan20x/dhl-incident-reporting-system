import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { auth } from "@/lib/api";

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth.isAuthed()) {
      router.navigate({ to: "/login" });
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 bg-primary rounded-sm" />
              <div className="h-2 w-4 bg-secondary rounded-sm" />
              <span className="ml-2 text-sm font-semibold text-foreground">
                Incident Reporting System
              </span>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
