// Temporary dashboard demo content. Replace this module with live data later.
export const dashboardMockData = {
  workspaceLabel: "DEMO WORKSPACE",
  lastScan: "2 hours ago",
  metrics: [
    {
      label: "AI Visibility Score",
      value: "36",
      change: "+4 pts",
      changeNote: "vs. previous scan",
      tone: "lime",
    },
    {
      label: "Accuracy Rate",
      value: "68%",
      change: "+3 pts",
      changeNote: "vs. previous scan",
      tone: "teal",
    },
    {
      label: "Freshness Rate",
      value: "89%",
      change: "-2 pts",
      changeNote: "needs attention",
      tone: "amber",
    },
    {
      label: "Brand Mention Rate",
      value: "32%",
      change: "+5 pts",
      changeNote: "vs. previous scan",
      tone: "coral",
    },
    {
      label: "Top-3 Rate",
      value: "12%",
      change: "+2 pts",
      changeNote: "vs. previous scan",
      tone: "blue",
    },
    {
      label: "Needs Approval",
      value: "6",
      change: "2 urgent",
      changeNote: "awaiting your review",
      tone: "rose",
    },
  ],
  trendByScan: [
    { week: "Aug 19", visibility: 19, accuracy: 55, mentions: 16 },
    { week: "Aug 26", visibility: 22, accuracy: 58, mentions: 18 },
    { week: "Sep 02", visibility: 26, accuracy: 61, mentions: 21 },
    { week: "Sep 09", visibility: 24, accuracy: 60, mentions: 20 },
    { week: "Sep 16", visibility: 30, accuracy: 64, mentions: 25 },
    { week: "Sep 23", visibility: 33, accuracy: 66, mentions: 29 },
    { week: "Sep 30", visibility: 36, accuracy: 68, mentions: 32 },
  ],
  recommendations: [
    {
      title: "Correct LunaBook Pro 14 specs",
      description:
        "Processor details differ across 3 AI answers. Confirm the source of truth.",
      impact: "High impact",
      accent: "lime",
    },
    {
      title: "Refresh your returns policy",
      description:
        "The policy source was last verified 94 days ago and may be out of date.",
      impact: "Improve accuracy",
      accent: "teal",
    },
    {
      title: "Add comparison content",
      description:
        "LunaBook Air is rarely included in laptop recommendations for students.",
      impact: "Grow visibility",
      accent: "coral",
    },
  ],
  issues: [
    {
      id: "issue-1",
      product: "LunaBook Pro 14",
      issue: "Processor listed as Ultra 5, not Ultra 7",
      source: "ChatGPT · 2 scans ago",
      priority: "High",
    },
    {
      id: "issue-2",
      product: "LunaView 27 Monitor",
      issue: "Warranty period missing from answers",
      source: "Gemini · 1 scan ago",
      priority: "Medium",
    },
    {
      id: "issue-3",
      product: "LunaTab S11",
      issue: "Conflicting price mentioned",
      source: "Perplexity · 1 scan ago",
      priority: "High",
    },
  ],
};