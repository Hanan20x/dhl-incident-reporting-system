import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { api, type Incident } from "@/lib/api";
import {
  TYPES,
  STATUSES,
  PRIORITIES,
  labelOf,
  priorityClass,
  statusClass,
} from "@/lib/incident-meta";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ),
});

function Dashboard() {
  const [items, setItems] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [type, setType] = useState("all");

  useEffect(() => {
    api
      .listIncidents()
      .then((data) => setItems(Array.isArray(data) ? data : (data as any)?.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      if (priority !== "all" && i.priority !== priority) return false;
      if (type !== "all" && i.type !== type) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !i.title?.toLowerCase().includes(q) &&
          !i.description?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [items, search, status, priority, type]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incidents</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {items.length} incidents
          </p>
        </div>
        <Button asChild>
          <Link to="/incidents/create">
            <PlusCircle className="mr-2 h-4 w-4" /> New Incident
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {PRIORITIES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {TYPES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <Card className="p-6 border-destructive/40">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No incidents found.
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((i) => (
            <Link
              key={i.id}
              to="/incidents/$id"
              params={{ id: String(i.id) }}
              className="block"
            >
              <Card className="p-4 hover:border-primary/50 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">#{i.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {labelOf(TYPES, i.type)}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{i.title}</h3>
                    {i.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {i.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge className={statusClass(i.status)}>{i.status}</Badge>
                    <Badge className={priorityClass(i.priority)}>{i.priority}</Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
