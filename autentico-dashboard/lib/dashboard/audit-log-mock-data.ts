// Clearly labeled accountability demo data only; not a live or persistent audit log.
export type AuditSeverity = "High" | "Medium" | "Low" | "Info";

export type DemoAuditEvent = {
  id: string;
  timestamp: string;
  actor: "System" | "FuenteLuz AI" | "Demo Reviewer";
  action: string;
  category: string;
  productOrScan: string;
  outcome: string;
  severity: AuditSeverity;
};

export const auditLogDemoData = {
  summary: [
    { label: "Total Events", value: 42, note: "Demo history" },
    { label: "Automated Actions", value: 31, note: "System and AI activity" },
    { label: "Human Decisions", value: 8, note: "Reviewer actions" },
    { label: "High-Severity Reviews", value: 3, note: "Require attention" },
  ],
  events: [
    {
      id: "AUD-042",
      timestamp: "Sep 30, 2026 · 10:02 AM",
      actor: "System",
      action: "Re-scan completed",
      category: "Scan",
      productOrScan: "Scan #SCN-1042 · LunaTech Electronics",
      outcome: "Completed · 5 responses stored",
      severity: "Info",
    },
    {
      id: "AUD-041",
      timestamp: "Sep 30, 2026 · 9:41 AM",
      actor: "Demo Reviewer",
      action: "Fact Vault record updated",
      category: "Fact Vault",
      productOrScan: "NovaBook 14 · Warranty",
      outcome: "Verified value changed to 24 months",
      severity: "Medium",
    },
    {
      id: "AUD-040",
      timestamp: "Sep 30, 2026 · 9:35 AM",
      actor: "Demo Reviewer",
      action: "Warranty correction rejected",
      category: "Approval",
      productOrScan: "NovaBook Pro 15 · Issue ISS-018",
      outcome: "Returned for more evidence",
      severity: "High",
    },
    {
      id: "AUD-039",
      timestamp: "Sep 30, 2026 · 9:26 AM",
      actor: "Demo Reviewer",
      action: "Price correction approved",
      category: "Approval",
      productOrScan: "NovaBook 14 · Issue ISS-017",
      outcome: "Approved · $449.99 confirmed",
      severity: "High",
    },
    {
      id: "AUD-038",
      timestamp: "Sep 30, 2026 · 9:13 AM",
      actor: "FuenteLuz AI",
      action: "3 issues flagged",
      category: "Issue",
      productOrScan: "NovaBook 14, NovaBook Pro 15, StudyBook 15",
      outcome: "2 high · 1 medium",
      severity: "High",
    },
    {
      id: "AUD-037",
      timestamp: "Sep 30, 2026 · 9:12 AM",
      actor: "FuenteLuz AI",
      action: "7 claims evaluated",
      category: "Claim review",
      productOrScan: "Scan #SCN-1042",
      outcome: "4 matched · 3 need review",
      severity: "Medium",
    },
    {
      id: "AUD-036",
      timestamp: "Sep 30, 2026 · 9:11 AM",
      actor: "FuenteLuz AI",
      action: "5 responses stored",
      category: "Response",
      productOrScan: "Scan #SCN-1042",
      outcome: "Saved to demo response set",
      severity: "Info",
    },
    {
      id: "AUD-035",
      timestamp: "Sep 30, 2026 · 9:11 AM",
      actor: "FuenteLuz AI",
      action: "5 shopper questions processed",
      category: "Question",
      productOrScan: "Scan #SCN-1042",
      outcome: "5 of 5 processed",
      severity: "Info",
    },
    {
      id: "AUD-034",
      timestamp: "Sep 30, 2026 · 9:10 AM",
      actor: "System",
      action: "Demo scan started",
      category: "Scan",
      productOrScan: "Scan #SCN-1042 · LunaTech Electronics",
      outcome: "Started · 5 active questions queued",
      severity: "Low",
    },
  ] satisfies DemoAuditEvent[],
};
