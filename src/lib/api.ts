const API_BASE = "http://localhost:8000/api";
const TOKEN_KEY = "dhl_token";

export const auth = {
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
  isAuthed: () => !!(typeof window !== "undefined" && localStorage.getItem(TOKEN_KEY)),
};

async function request<T = any>(
  path: string,
  options: RequestInit = {},
  isFormData = false,
): Promise<T> {
  const token = auth.getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user?: any }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request("/logout", { method: "POST" }).catch(() => {}),
  listIncidents: () => request<any[]>("/incidents"),
  getIncident: (id: string | number) => request<any>(`/incidents/${id}`),
  createIncident: (formData: FormData) =>
    request<any>("/incidents", { method: "POST", body: formData }, true),
  updateIncidentStatus: (id: string | number, status: string) =>
    request<any>(`/incidents/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  listDepartments: () => request<any[]>("/departments"),
};

export type Incident = {
  id: number | string;
  title: string;
  description?: string;
  type: string;
  source?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "draft" | "reviewed" | "resolved";
  created_at?: string;
  updated_at?: string;
  attachment_url?: string;
  logs?: { id: number | string; message: string; created_at: string; user?: string }[];
};
