import React, { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_INVESTOR = {
  investorId: "INV-2019-042",
  name: "Ahmad Faizal bin Kamarudin",
  email: "ahmad.faizal@email.com",
  phone: "+60 12-345 6789",
  joinedDate: "2019-03-15",
  packageType: "Premium",
  totalInvested: 48000,
  currency: "MYR",
};

const MOCK_TREES = [
  {
    treeId: "AGW-B1-0021",
    block: "Block A",
    plantedDate: "2019-04-01",
    healthStatus: "Healthy",
    lifecycleStatus: "Inoculated Twice",
    inoculationCount: 2,
    harvestCertificate: null,
    readyForHarvest: false,
    events: [
      { date: "2019-04-01", type: "Planted", note: "Initial planting, Block A Row 3" },
      { date: "2023-05-12", type: "Inoculated", note: "1st inoculation — Aquilaria malaccensis fungal injection" },
      { date: "2024-09-20", type: "Inoculated", note: "2nd inoculation — confirmed resin formation visible" },
      { date: "2024-11-05", type: "Inspection", note: "Excellent resin density, tree is on track" },
    ],
  },
  {
    treeId: "AGW-B1-0022",
    block: "Block A",
    plantedDate: "2019-04-01",
    healthStatus: "Healthy",
    lifecycleStatus: "Ready for Harvest",
    inoculationCount: 2,
    harvestCertificate: null,
    readyForHarvest: true,
    events: [
      { date: "2019-04-01", type: "Planted", note: "Initial planting" },
      { date: "2023-06-18", type: "Inoculated", note: "1st inoculation" },
      { date: "2024-10-02", type: "Inoculated", note: "2nd inoculation — Grade A resin formation" },
      { date: "2025-01-15", type: "Highlight", note: "Exceptionally high oleoresin content noted by field manager" },
    ],
  },
  {
    treeId: "AGW-B2-0088",
    block: "Block B",
    plantedDate: "2020-01-10",
    healthStatus: "Healthy",
    lifecycleStatus: "Inoculated Once",
    inoculationCount: 1,
    harvestCertificate: null,
    readyForHarvest: false,
    events: [
      { date: "2020-01-10", type: "Planted", note: "Initial planting, Block B" },
      { date: "2024-03-22", type: "Inoculated", note: "1st inoculation" },
      { date: "2024-08-10", type: "Treatment", note: "Foliar treatment for minor fungal spotting — resolved" },
    ],
  },
  {
    treeId: "AGW-B2-0089",
    block: "Block B",
    plantedDate: "2020-01-10",
    healthStatus: "Harvested",
    lifecycleStatus: "Harvested",
    inoculationCount: 2,
    harvestCertificate: { certId: "CERT-2025-0012", issuedDate: "2025-02-14", yield: "4.2 kg", grade: "Grade A" },
    readyForHarvest: false,
    events: [
      { date: "2020-01-10", type: "Planted", note: "Initial planting" },
      { date: "2023-12-05", type: "Inoculated", note: "1st inoculation" },
      { date: "2024-11-18", type: "Inoculated", note: "2nd inoculation" },
      { date: "2025-02-10", type: "Harvested", note: "Resin extracted — 4.2 kg Grade A agarwood chips" },
      { date: "2025-02-14", type: "Certificate", note: "Harvest certificate CERT-2025-0012 issued" },
    ],
  },
];

// ─── ROI Config (5-Year Plan) ─────────────────────────────────────────────────
// Assumptions:
//   • Investor pays annual management fee per tree each year
//   • Inoculation 1 at Year 3, Inoculation 2 at Year 4 (cost charged to investor)
//   • Tree harvested at Year 5, resin sold, harvesting/processing fee deducted
//   • Profit share: investor gets 70%, company retains 30% of net proceeds
const ROI_CONFIG = {
  annualMgmtFeePerTree: 600,       // MYR/year/tree
  inoculationCostEach: 350,        // MYR per inoculation (x2 = MYR 700 total)
  inoculationYears: [3, 4],        // which years inoculation happens
  harvestYear: 5,
  harvestingCostPerTree: 300,      // MYR flat processing/harvesting fee
  avgYieldPerTree: 3.8,            // kg of agarwood chips
  pricePerKgGradeA: 900,           // MYR/kg
  pricePerKgGradeB: 500,           // MYR/kg
  investorProfitSharePct: 70,      // % of net proceeds to investor
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";
const treeAge = (plantedDate) => {
  const diff = new Date() - new Date(plantedDate);
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return years;
};

const EVENT_STYLE = {
  Planted:     { bg: "bg-emerald-100",  text: "text-emerald-700",  dot: "bg-emerald-500" },
  Inoculated:  { bg: "bg-violet-100",   text: "text-violet-700",   dot: "bg-violet-500" },
  Harvested:   { bg: "bg-amber-100",    text: "text-amber-700",    dot: "bg-amber-500" },
  Certificate: { bg: "bg-blue-100",     text: "text-blue-700",     dot: "bg-blue-500" },
  Highlight:   { bg: "bg-rose-100",     text: "text-rose-600",     dot: "bg-rose-500" },
  Inspection:  { bg: "bg-slate-100",    text: "text-slate-600",    dot: "bg-slate-400" },
  Treatment:   { bg: "bg-orange-100",   text: "text-orange-700",   dot: "bg-orange-500" },
};

const HEALTH_STYLE = {
  Healthy:   "bg-emerald-100 text-emerald-700",
  Warning:   "bg-yellow-100 text-yellow-700",
  Damaged:   "bg-orange-100 text-orange-700",
  Dead:      "bg-gray-200 text-gray-600",
  Harvested: "bg-amber-100 text-amber-700",
};

const LIFECYCLE_STYLE = {
  "Growing":               "bg-blue-50 text-blue-700",
  "Inoculated Once":       "bg-indigo-100 text-indigo-700",
  "Inoculated Twice":      "bg-purple-100 text-purple-700",
  "Ready for Harvest":     "bg-orange-100 text-orange-800 font-semibold",
  "Harvested":             "bg-amber-100 text-amber-800",
  "Ready for 1st Inoculation": "bg-violet-100 text-violet-700",
  "Ready for 2nd Inoculation": "bg-violet-100 text-violet-700",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent || "bg-white border-gray-100"} shadow-sm`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ROISection({ investor, trees }) {
  const totalTrees = trees.length;
  const harvestedTrees = trees.filter(t => t.lifecycleStatus === "Harvested");
  const activeTrees = trees.filter(t => t.lifecycleStatus !== "Harvested" && t.healthStatus !== "Dead");
  const startYear = new Date(investor.joinedDate).getFullYear();
  const currentYear = new Date().getFullYear();

  // ── Per-tree cost/revenue model ──────────────────────────────────────────
  const cfg = ROI_CONFIG;
  const totalAnnualFees = cfg.annualMgmtFeePerTree * cfg.harvestYear;           // 5 × 600 = 3,000
  const totalInoculationCost = cfg.inoculationCostEach * cfg.inoculationYears.length; // 2 × 350 = 700
  const grossRevenuePerTree = cfg.avgYieldPerTree * cfg.pricePerKgGradeA;       // 3.8 × 900 = 3,420
  const harvestingCost = cfg.harvestingCostPerTree;                             // 300
  const netAfterCosts = grossRevenuePerTree - harvestingCost;                   // 3,120
  const investorSharePerTree = netAfterCosts * (cfg.investorProfitSharePct / 100); // 2,184
  const totalOutflowPerTree = totalAnnualFees + totalInoculationCost;           // 3,700
  const netProfitPerTree = investorSharePerTree - totalOutflowPerTree;          // -1,516 … offset by initial investment
  // Total picture across all trees
  const totalOutflow = investor.totalInvested + (totalOutflowPerTree * totalTrees);
  const totalInflow = investorSharePerTree * totalTrees;
  const netReturn = totalInflow - (totalOutflowPerTree * totalTrees);
  const roiPct = ((netReturn) / investor.totalInvested * 100).toFixed(1);
  const annualisedROI = (Math.pow((totalInflow / (investor.totalInvested + totalOutflowPerTree * totalTrees)), 1 / cfg.harvestYear) - 1) * 100;

  // ── Year-by-year cashflow (per tree) ─────────────────────────────────────
  const yearlyRows = Array.from({ length: cfg.harvestYear }, (_, i) => {
    const yr = i + 1;
    const calYear = startYear + yr;
    const isPast = calYear < currentYear;
    const isCurrent = calYear === currentYear;
    const mgmt = -cfg.annualMgmtFeePerTree;
    const inoc = cfg.inoculationYears.includes(yr) ? -cfg.inoculationCostEach : 0;
    const harvest = yr === cfg.harvestYear ? investorSharePerTree - cfg.harvestingCostPerTree : 0;
    const net = mgmt + inoc + harvest;
    return { yr, calYear, isPast, isCurrent, mgmt, inoc, harvest, net };
  });

  const cumulativeFlows = yearlyRows.reduce((acc, row) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : -investor.totalInvested / totalTrees;
    acc.push({ ...row, cumulative: prev + row.net });
    return acc;
  }, []);

  // Bar chart scale
  const maxAbs = Math.max(...cumulativeFlows.map(r => Math.abs(r.cumulative)), 1000);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Capital Invested" value={`MYR ${investor.totalInvested.toLocaleString()}`} sub="Initial outlay" />
        <StatCard label="Total Cost (5 yrs)" value={`MYR ${Math.round(totalOutflowPerTree * totalTrees + investor.totalInvested).toLocaleString()}`} sub="Incl. fees & inoculation" />
        <StatCard label="Projected Return" value={`MYR ${Math.round(totalInflow).toLocaleString()}`} sub={`${cfg.investorProfitSharePct}% profit share · ${totalTrees} trees`} />
        <StatCard
          label="Net ROI at Year 5"
          value={`${roiPct}%`}
          sub={`~${annualisedROI.toFixed(1)}% annualised`}
          accent="bg-emerald-50 border-emerald-200"
        />
      </div>

      {/* Assumptions legend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-3">Plan Assumptions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: "Annual Mgmt Fee", value: `MYR ${cfg.annualMgmtFeePerTree}/tree/yr`, icon: "📋" },
            { label: "Inoculation Cost", value: `MYR ${cfg.inoculationCostEach} × 2 (Yr 3 & 4)`, icon: "💉" },
            { label: "Harvesting Fee", value: `MYR ${cfg.harvestingCostPerTree}/tree (Yr 5)`, icon: "🪵" },
            { label: "Profit Share", value: `${cfg.investorProfitSharePct}% to investor`, icon: "📊" },
            { label: "Avg Yield", value: `${cfg.avgYieldPerTree} kg/tree`, icon: "⚖️" },
            { label: "Price (Grade A)", value: `MYR ${cfg.pricePerKgGradeA}/kg`, icon: "💰" },
            { label: "Harvest Year", value: `Year ${cfg.harvestYear}`, icon: "🌿" },
            { label: "Trees in Portfolio", value: `${totalTrees} trees`, icon: "🌳" },
          ].map(a => (
            <div key={a.label} className="bg-gray-50 rounded-xl p-3">
              <span className="text-base">{a.icon}</span>
              <p className="text-gray-400 mt-1">{a.label}</p>
              <p className="font-semibold text-gray-700">{a.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Year-by-year cashflow table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">5-Year Cashflow Breakdown <span className="font-normal text-gray-400 text-xs">(per tree)</span></h2>
        <p className="text-xs text-gray-400 mb-4">Annual outflows vs. harvest-year return · shaded = past · outlined = current year</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Year</th>
                <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Milestone</th>
                <th className="text-right py-2 pr-4 text-xs font-semibold text-red-400 uppercase tracking-wider">Costs (MYR)</th>
                <th className="text-right py-2 pr-4 text-xs font-semibold text-emerald-500 uppercase tracking-wider">Return (MYR)</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Net (MYR)</th>
              </tr>
            </thead>
            <tbody>
              {cumulativeFlows.map((row) => {
                const costTotal = Math.abs(row.mgmt) + Math.abs(row.inoc);
                const milestones = [];
                if (row.yr === 1) milestones.push("Planting & Setup");
                if (row.inoc < 0) milestones.push(`Inoculation ${row.yr === cfg.inoculationYears[0] ? "1" : "2"}`);
                if (row.yr === cfg.harvestYear) milestones.push("Harvest & Resin Sale");
                if (milestones.length === 0) milestones.push("Growing phase");

                return (
                  <tr
                    key={row.yr}
                    className={`border-b border-gray-50 ${
                      row.isPast ? "bg-gray-50 text-gray-400" :
                      row.isCurrent ? "bg-emerald-50 ring-1 ring-emerald-200 ring-inset" : ""
                    }`}
                  >
                    <td className="py-3 pr-4 font-bold text-gray-700">
                      Yr {row.yr}
                      <span className="ml-1 text-xs font-normal text-gray-400">({row.calYear})</span>
                      {row.isCurrent && <span className="ml-2 text-xs font-bold text-emerald-600">← now</span>}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 text-xs">{milestones.join(" · ")}</td>
                    <td className="py-3 pr-4 text-right text-red-500 font-mono">
                      {costTotal > 0 ? `(${costTotal.toLocaleString()})` : "—"}
                    </td>
                    <td className="py-3 pr-4 text-right text-emerald-600 font-mono font-semibold">
                      {row.harvest > 0 ? row.harvest.toLocaleString() : "—"}
                    </td>
                    <td className={`py-3 text-right font-mono font-bold ${row.net >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {row.net >= 0 ? `+${row.net.toLocaleString()}` : `(${Math.abs(row.net).toLocaleString()})`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={2} className="py-3 pr-4 font-bold text-gray-700 text-xs uppercase tracking-wide">Total (per tree)</td>
                <td className="py-3 pr-4 text-right text-red-500 font-mono font-bold">
                  ({(totalAnnualFees + totalInoculationCost).toLocaleString()})
                </td>
                <td className="py-3 pr-4 text-right text-emerald-600 font-mono font-bold">
                  {Math.round(investorSharePerTree).toLocaleString()}
                </td>
                <td className={`py-3 text-right font-mono font-bold ${netProfitPerTree >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {netProfitPerTree >= 0 ? `+${Math.round(netProfitPerTree).toLocaleString()}` : `(${Math.abs(Math.round(netProfitPerTree)).toLocaleString()})`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Cumulative cashflow bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">Cumulative Position <span className="font-normal text-gray-400 text-xs">(per tree, excl. initial capital)</span></h2>
        <p className="text-xs text-gray-400 mb-5">Shows how cumulative cashflow builds year by year toward harvest payoff</p>
        <div className="flex items-end gap-3 h-32">
          {cumulativeFlows.map((row) => {
            const pct = Math.abs(row.cumulative) / maxAbs;
            const isPositive = row.cumulative >= 0;
            return (
              <div key={row.yr} className="flex-1 flex flex-col items-center justify-end gap-1">
                <span className={`text-xs font-bold ${isPositive ? "text-emerald-600" : "text-red-400"}`}>
                  {row.cumulative >= 0 ? "+" : ""}{Math.round(row.cumulative).toLocaleString()}
                </span>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    row.yr === cfg.harvestYear ? "bg-amber-400" :
                    isPositive ? "bg-emerald-400" : "bg-red-300"
                  }`}
                  style={{ height: `${Math.max(pct * 96, 6)}px` }}
                />
                <span className="text-xs text-gray-400">Yr {row.yr}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-red-300 inline-block"></span>Negative (costs outpacing return)</span>
          <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block"></span>Positive</span>
          <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block"></span>Harvest year payoff</span>
        </div>
      </div>
    </div>
  );
}

function TreeCard({ tree, onSelect, selected }) {
  const age = treeAge(tree.plantedDate);
  const cert = tree.harvestCertificate;
  const latestEvent = tree.events[tree.events.length - 1];

  return (
    <div
      onClick={() => onSelect(tree)}
      className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-gray-900 text-sm">{tree.treeId}</p>
          <p className="text-xs text-gray-400">{tree.block} · Age {age} yrs</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${HEALTH_STYLE[tree.healthStatus] || "bg-gray-100 text-gray-600"}`}>
          {tree.healthStatus}
        </span>
      </div>

      <span className={`inline-block text-xs px-2 py-1 rounded-full mb-3 ${LIFECYCLE_STYLE[tree.lifecycleStatus] || "bg-gray-100 text-gray-600"}`}>
        {tree.lifecycleStatus}
      </span>

      {cert && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-700">🎖 Certificate Issued</p>
          <p className="text-xs text-amber-600">{cert.certId} · {formatDate(cert.issuedDate)}</p>
          <p className="text-xs text-amber-600">{cert.yield} · {cert.grade}</p>
        </div>
      )}

      {tree.readyForHarvest && !cert && (
        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs font-semibold text-orange-700">🌿 Ready for Harvest</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2 truncate">Latest: {latestEvent?.note}</p>
    </div>
  );
}

function TreeTimeline({ tree }) {
  if (!tree) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-300">
      <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
      <p className="text-sm">Select a tree to view its timeline</p>
    </div>
  );

  const sorted = [...tree.events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-base">{tree.treeId}</h3>
          <p className="text-xs text-gray-400">{tree.block} · Planted {formatDate(tree.plantedDate)} · {treeAge(tree.plantedDate)} years old</p>
        </div>
      </div>

      {tree.harvestCertificate && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🎖</span>
            <span className="font-bold text-amber-800 text-sm">Harvest Certificate</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-amber-700">
            <span>Cert ID: <strong>{tree.harvestCertificate.certId}</strong></span>
            <span>Issued: <strong>{formatDate(tree.harvestCertificate.issuedDate)}</strong></span>
            <span>Yield: <strong>{tree.harvestCertificate.yield}</strong></span>
            <span>Grade: <strong>{tree.harvestCertificate.grade}</strong></span>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
        <div className="space-y-4 pl-8">
          {sorted.map((event, i) => {
            const style = EVENT_STYLE[event.type] || EVENT_STYLE.Inspection;
            return (
              <div key={i} className="relative">
                <div className={`absolute -left-5 w-3 h-3 rounded-full border-2 border-white ${style.dot}`}></div>
                <div className={`rounded-xl p-3 ${style.bg}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold ${style.text}`}>{event.type}</span>
                    <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
                  </div>
                  <p className={`text-xs ${style.text}`}>{event.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function InvestorDashboard() {
  const investor = MOCK_INVESTOR;
  const trees = MOCK_TREES;
  const [selectedTree, setSelectedTree] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const harvestedCount = trees.filter(t => t.lifecycleStatus === "Harvested").length;
  const readyCount = trees.filter(t => t.readyForHarvest).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🌿</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Investor Portal</h1>
              <p className="text-xs text-gray-400">Agarwood Plantation Management</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{investor.name}</p>
            <p className="text-xs text-gray-400">{investor.investorId} · {investor.packageType}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Investor Info Strip */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-1">Name</p>
              <p className="font-semibold text-gray-800">{investor.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="font-semibold text-gray-800">{investor.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              <p className="font-semibold text-gray-800">{investor.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Joined</p>
              <p className="font-semibold text-gray-800">{formatDate(investor.joinedDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Package</p>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{investor.packageType}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Trees" value={trees.length} sub="In portfolio" />
          <StatCard label="Harvested" value={harvestedCount} sub="Completed cycles" accent="bg-amber-50 border-amber-100" />
          <StatCard label="Ready to Harvest" value={readyCount} sub="Awaiting extraction" accent="bg-orange-50 border-orange-100" />
          <StatCard label="Capital Invested" value={`MYR ${investor.totalInvested.toLocaleString()}`} sub={`Since ${new Date(investor.joinedDate).getFullYear()}`} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {["overview", "trees", "timeline"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "overview" ? "ROI Overview" : tab === "trees" ? "My Trees" : "Tree Timeline"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-0">
            <ROISection investor={investor} trees={trees} />
          </div>
        )}

        {activeTab === "trees" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Invested Trees</h2>
            <p className="text-xs text-gray-400 mb-5">Click any tree to view its full timeline in the Timeline tab</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trees.map(tree => (
                <TreeCard
                  key={tree.treeId}
                  tree={tree}
                  selected={selectedTree?.treeId === tree.treeId}
                  onSelect={(t) => { setSelectedTree(t); setActiveTab("timeline"); }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tree selector */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">Select Tree</h2>
              <div className="space-y-2">
                {trees.map(tree => (
                  <button
                    key={tree.treeId}
                    onClick={() => setSelectedTree(tree)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${
                      selectedTree?.treeId === tree.treeId
                        ? "bg-emerald-50 border border-emerald-300 font-semibold text-emerald-800"
                        : "hover:bg-gray-50 border border-transparent text-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{tree.treeId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${HEALTH_STYLE[tree.healthStatus] || "bg-gray-100 text-gray-600"}`}>
                        {tree.healthStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{tree.lifecycleStatus}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline detail */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto max-h-[70vh]">
              <TreeTimeline tree={selectedTree} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}