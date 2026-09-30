// Simulated competition-demo issues only; these are not live AI findings.
export type IssueSeverity = "High" | "Medium" | "Low" | "None";
export type IssueStatus =
  | "Needs approval"
  | "Open"
  | "Verified"
  | "Approved"
  | "Rejected";

export type DemoIssue = {
  id: string;
  product: string;
  category: string;
  issueType: string;
  aiClaimed: string;
  factVaultValue: string;
  severity: IssueSeverity;
  status: IssueStatus;
  suggestedFix: string | null;
  correct: boolean;
  source: string;
};

export const demoIssueRecords: DemoIssue[] = [
  {
    id: "SIM-001",
    product: "NovaBook 14",
    category: "Laptop",
    issueType: "Price mismatch",
    aiClaimed: "$499.00",
    factVaultValue: "$449.99",
    severity: "High",
    status: "Needs approval",
    suggestedFix: "Replace the claimed price with the verified price of $449.99.",
    correct: false,
    source: "Simulated response · Demo provider",
  },
  {
    id: "SIM-002",
    product: "NovaBook 14",
    category: "Laptop",
    issueType: "Memory specification mismatch",
    aiClaimed: "8 GB RAM",
    factVaultValue: "16 GB RAM",
    severity: "Medium",
    status: "Open",
    suggestedFix: "Update the answer to state that NovaBook 14 has 16 GB RAM.",
    correct: false,
    source: "Simulated response · Demo provider",
  },
  {
    id: "SIM-003",
    product: "NovaBook Pro 15",
    category: "Laptop",
    issueType: "Warranty mismatch",
    aiClaimed: "90 days",
    factVaultValue: "24 months",
    severity: "High",
    status: "Needs approval",
    suggestedFix: "Replace the 90-day claim with the verified 24-month warranty.",
    correct: false,
    source: "Simulated response · Demo provider",
  },
  {
    id: "SIM-004",
    product: "StudyBook 15",
    category: "Laptop",
    issueType: "Outdated stock information",
    aiClaimed: "Out of stock",
    factVaultValue: "In stock",
    severity: "Medium",
    status: "Open",
    suggestedFix: "Refresh the availability claim to show StudyBook 15 is in stock.",
    correct: false,
    source: "Simulated response · Demo provider",
  },
  {
    id: "SIM-005",
    product: "NovaBook Pro 15",
    category: "Laptop",
    issueType: "RAM claim verified",
    aiClaimed: "16 GB RAM",
    factVaultValue: "16 GB RAM",
    severity: "None",
    status: "Verified",
    suggestedFix: null,
    correct: true,
    source: "Simulated response · Demo provider",
  },
];
