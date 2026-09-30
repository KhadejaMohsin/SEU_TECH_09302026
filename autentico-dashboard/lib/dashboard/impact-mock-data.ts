// Illustrative prototype values only. Not measured traffic, conversions, or business outcomes.
export const impactDemoData = {
  demoLabel: "MODELED DEMO · NOT MEASURED RESULTS",
  metrics: [
    {
      label: "AI-assisted discovery opportunities",
      value: "320",
      suffix: "/ 1,000",
      note: "Illustrative mentions in modeled queries",
      tone: "blue",
    },
    {
      label: "Missed consideration opportunities",
      value: "680",
      suffix: "/ 1,000",
      note: "Modeled queries without a LunaTech mention",
      tone: "yellow",
    },
    {
      label: "Accuracy improvement",
      value: "+23",
      suffix: "pp",
      note: "Illustrative 68% → 91% scenario",
      tone: "sky",
    },
    {
      label: "Trust risk level",
      value: "Elevated",
      suffix: "",
      note: "Modeled from demo issue patterns",
      tone: "red",
    },
    {
      label: "High-severity errors",
      value: "5 → 2",
      suffix: "",
      note: "Illustrative before / after fixes",
      tone: "red",
    },
  ],
  comparison: [
    { label: "Mention Rate", before: "24%", after: "32%", direction: "up" },
    { label: "Accuracy Rate", before: "68%", after: "91%", direction: "up" },
    { label: "Top-3 Rate", before: "8%", after: "12%", direction: "up" },
    { label: "High-Severity Errors", before: "5", after: "2", direction: "down" },
  ],
  funnel: [
    { stage: "AI shopping queries", value: 1000, note: "Modeled query set", width: 100 },
    { stage: "LunaTech mentions", value: 320, note: "32% of query set", width: 76 },
    { stage: "Top-3 placements", value: 120, note: "12% of query set", width: 56 },
    { stage: "Estimated site visits", value: 84, note: "Modeled from placements", width: 40 },
    { stage: "Estimated conversions", value: 12, note: "Illustrative only", width: 24 },
  ],
  impactDrivers: [
    {
      title: "Missing mentions",
      effect: "Fewer discovery opportunities",
      detail: "Weak coverage on non-branded student and small-business laptop prompts.",
      signal: "Visibility gap",
    },
    {
      title: "Wrong pricing",
      effect: "Lower confidence to compare",
      detail: "Conflicting prices can make a product harder to recommend confidently.",
      signal: "Trust risk",
    },
    {
      title: "Outdated stock",
      effect: "Availability mismatch",
      detail: "Stale stock information may divert shoppers to currently available alternatives.",
      signal: "Freshness gap",
    },
    {
      title: "Incorrect warranty",
      effect: "Purchase reassurance weakened",
      detail: "Unclear coverage can reduce confidence for higher-consideration purchases.",
      signal: "Policy clarity",
    },
    {
      title: "Low ranking",
      effect: "Less visibility in shortlist answers",
      detail: "Products appearing below the first three options may receive less attention.",
      signal: "Rank opportunity",
    },
  ],
  expectedBenefits: [
    {
      title: "More qualified discovery",
      detail: "Clearer product coverage can improve the chance of appearing in relevant shopping answers.",
      indicator: "Mention Rate · 24% → 32%",
    },
    {
      title: "Greater answer confidence",
      detail: "Consistent pricing, specs, and policies give answer systems clearer facts to reference.",
      indicator: "Accuracy Rate · 68% → 91%",
    },
    {
      title: "Stronger shortlist presence",
      detail: "Improved coverage and clear comparisons may support better placement in modeled prompts.",
      indicator: "Top-3 Rate · 8% → 12%",
    },
    {
      title: "Reduced trust exposure",
      detail: "Correcting high-severity discrepancies reduces modeled misinformation risk.",
      indicator: "High-Severity Errors · 5 → 2",
    },
  ],
};
