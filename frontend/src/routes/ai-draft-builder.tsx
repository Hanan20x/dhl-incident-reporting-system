import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { TYPES, SOURCES, PRIORITIES } from "@/lib/incident-meta";

export const Route = createFileRoute("/ai-draft-builder")({
  component: AIDraftBuilderPage,
});

function AIDraftBuilderPage() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState<{
    title: string;
    summary: string;
    type: string;
    source: string;
    priority: string;
    tags: string[];
    suggested_steps: string[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!rawText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }
    setLoading(true);
    try {
      const parsed = await api.analyzeIncident(rawText);
      
      setForm({
        title: parsed.title || "",
        summary: parsed.summary || "",
        type: parsed.type || "customer_complaint",
        source: parsed.source || "email",
        priority: parsed.priority || "medium",
        tags: parsed.tags || [],
        suggested_steps: parsed.suggested_steps || []
      });
      toast.success("Analysis complete");
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze text");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.summary + "\n\nSuggested Steps:\n" + form.suggested_steps.map((s,i)=>`${i+1}. ${s}`).join("\n"));
      formData.append("type", form.type);
      formData.append("source", form.source);
      formData.append("priority", form.priority);
      formData.append("status", "draft");
      
      await api.createIncident(formData);
      toast.success("Incident created successfully!");
      router.navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const removeTag = (tag: string) => {
    if (!form) return;
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#D40511]" />
            AI Draft Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Paste raw text and let AI organize it into a structured incident report.
          </p>
        </div>

        <Card className="p-6 border-[#FFCC00] shadow-sm">
          <Label htmlFor="raw-text" className="mb-2 block font-semibold">Raw Incident Text</Label>
          <Textarea 
            id="raw-text"
            placeholder="Paste email, chat logs, or notes here..."
            className="min-h-[150px] mb-4"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <Button onClick={handleAnalyze} disabled={loading || !rawText.trim()} className="bg-[#D40511] hover:bg-[#D40511]/90 text-white w-full sm:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze with AI
          </Button>
        </Card>

        {form && (
          <Card className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 border-t-4 border-t-[#D40511]">
            <h2 className="text-lg font-semibold border-b pb-2">Structured Incident</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Summary</Label>
                <Textarea value={form.summary} onChange={(e) => setForm({...form, summary: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(val) => setForm({...form, type: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(val) => setForm({...form, source: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SOURCES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(val) => setForm({...form, priority: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-[#FFCC00]/20 text-[#D40511] hover:bg-[#FFCC00]/30 border-0 flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Suggested Steps</Label>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {form.suggested_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t mt-4">
              <Button onClick={handleCreate} disabled={submitting} className="bg-[#D40511] hover:bg-[#D40511]/90 text-white mt-2">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Incident
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
