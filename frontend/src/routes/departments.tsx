import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Building2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/departments")({
  component: () => (
    <AppLayout>
      <DepartmentsPage />
    </AppLayout>
  ),
});

function DepartmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listDepartments()
      .then((data) => setItems(Array.isArray(data) ? data : (data as any)?.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Departments</h1>
        <p className="text-sm text-muted-foreground">
          Departments responsible for handling incidents
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="p-6 border-destructive/40 text-destructive">{error}</Card>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No departments found.
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((d, idx) => (
            <Card key={d.id ?? idx} className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {d.name ?? `Department ${d.id}`}
                  </h3>
                  {d.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {d.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
