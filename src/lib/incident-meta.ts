export const TYPES = [
  { value: "late_delivery", label: "Late Delivery" },
  { value: "address_issue", label: "Address Issue" },
  { value: "damaged_parcel", label: "Damaged Parcel" },
  { value: "system_error", label: "System Error" },
  { value: "customer_complaint", label: "Customer Complaint" },
];

export const SOURCES = [
  { value: "email", label: "Email" },
  { value: "telegram", label: "Telegram" },
  { value: "teams", label: "Teams" },
  { value: "phone", label: "Phone" },
  { value: "image", label: "Image" },
  { value: "handwritten", label: "Handwritten" },
];

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "reviewed", label: "Reviewed" },
  { value: "resolved", label: "Resolved" },
];

export const labelOf = (list: { value: string; label: string }[], v?: string) =>
  list.find((x) => x.value === v)?.label ?? v ?? "—";

export const priorityClass = (p?: string) => {
  switch (p) {
    case "critical":
      return "bg-primary text-primary-foreground";
    case "high":
      return "bg-orange-500 text-white";
    case "medium":
      return "bg-secondary text-secondary-foreground";
    case "low":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const statusClass = (s?: string) => {
  switch (s) {
    case "resolved":
      return "bg-green-600 text-white";
    case "reviewed":
      return "bg-blue-600 text-white";
    case "draft":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};
