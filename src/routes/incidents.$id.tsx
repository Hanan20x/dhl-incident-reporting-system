import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Paperclip, Clock } from "lucide-react";
import { api, type Incident } from "@/lib/api";
import {
  TYPES,
  SOURCES,
  STATUSES,
  labelOf,
  priorityClass,
  statusClass,
} from "@/lib/incident-meta";
import { toast } from "sonner";

export const Route = createFileRoute("/incidents/$id")({
  component: () => (
    <AppLayout>
      <DetailPage />
    </AppLayout>
  ),
});

function DetailPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getIncident(id)
      .then((data) => {
        const inc = (data as any)?.data ?? data;
        setIncident(inc);
        setNewStatus(inc.status);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleUpdateStatus = async () => {
    if (!incident || newStatus === incident.status) return;
    setUpdating(true);
    try {
      await api.updateIncidentStatus(incident.id, newStatus);
      toast.success("Status updated");
      load();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error || !incident) {
    return (
      <Card className="p-6 max-w-3xl mx-auto">
        <p className="text-destructive">{error || "Incident not found"}</p>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground mb-1">Incident #{incident.id}</div>
            <h1 className="text-2xl font-bold text-foreground">{incident.title}</h1>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge className={statusClass(incident.status)}>{incident.status}</Badge>
              <Badge className={priorityClass(incident.priority)}>{incident.priority}</Badge>
              <Badge variant="outline">{labelOf(TYPES, incident.type)}</Badge>
              <Badge variant="outline">{labelOf(SOURCES, incident.source)}</Badge>
            </div>
          </div>
        </div>

        {incident.description && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {incident.description}
            </p>
          </div>
        )}

        {incident.attachment_url && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Attachment</h3>
            <a
              href={incident.attachment_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Paperclip className="h-4 w-4" /> View attachment
            </a>
          </div>
        )}

        {incident.created_at && (
          <div className="mt-6 text-xs text-muted-foreground">
            Created {new Date(incident.created_at).toLocaleString()}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Update Status</h3>
        <div className="flex gap-2 flex-wrap">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleUpdateStatus}
            disabled={updating || newStatus === incident.status}
          >
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">History</h3>
        {!incident.logs || incident.logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="space-y-4">
            {incident.logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 w-px bg-border my-1" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-foreground">{log.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.user ? `${log.user} · ` : ""}
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
