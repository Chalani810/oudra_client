// src/pages/InvestorDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

// ── ROI CALCULATOR ─────────────────────────────────────────────────────────────
function ROICalculator({ investment, treeCount }) {
  const base = investment || 0, trees = treeCount || 0;
  const fmt = n => `LKR ${Number(n).toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
  const rows = [
    { year: 1, pct: 5,  label: "Year 1 — Establishment" },
    { year: 2, pct: 12, label: "Year 2 — Early Growth" },
    { year: 3, pct: 22, label: "Year 3 — Mid Growth" },
    { year: 4, pct: 38, label: "Year 4 — Maturation" },
    { year: 5, pct: 60, label: "Year 5 — Harvest Ready" },
  ];
  return (
    <div style={rc.wrap}>
      <h3 style={rc.title}>📊 5-Year ROI Projection</h3>
      <p style={rc.sub}>Based on {fmt(base)} investment across {trees} trees</p>
      <div style={rc.summary}>
        {[
          { label: "Initial Investment",     value: fmt(base),             color: "#1f2937" },
          { label: "Projected Year 5 Value", value: fmt(base * 1.6),       color: "#2d6a4f" },
          { label: "Total Projected Return", value: `+${fmt(base * 0.6)}`, color: "#059669" },
        ].map((c, i) => (
          <div key={i} style={rc.summaryCard}>
            <span style={rc.summaryLabel}>{c.label}</span>
            <span style={{ ...rc.summaryVal, color: c.color }}>{c.value}</span>
          </div>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={rc.table}>
          <thead>
            <tr style={rc.thead}>
              {["Period","Growth %","Projected Value","Gain","Progress"].map(h => <th key={h} style={rc.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const val = base * (1 + r.pct / 100), gain = val - base;
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafffe" }}>
                  <td style={rc.td}>{r.label}</td>
                  <td style={{ ...rc.td, color: "#2d6a4f", fontWeight: "bold" }}>+{r.pct}%</td>
                  <td style={rc.td}>{fmt(val)}</td>
                  <td style={{ ...rc.td, color: "#059669" }}>+{fmt(gain)}</td>
                  <td style={rc.td}>
                    <div style={rc.barBg}><div style={{ ...rc.barFill, width: `${(r.pct / 60) * 100}%` }} /></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={rc.note}>* Projections are estimates. Actual returns may vary based on market conditions.</p>
    </div>
  );
}
const rc = {
  wrap: { background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e8f5e9" },
  title: { fontSize: 18, fontWeight: "bold", color: "#1b4332", margin: "0 0 6px" },
  sub: { fontSize: 13, color: "#6b7280", margin: "0 0 24px" },
  summary: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  summaryCard: { flex: 1, minWidth: 150, padding: "16px 20px", border: "1.5px solid #e8f5e9", borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 },
  summaryLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  summaryVal: { fontSize: 20, fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f0fdf4" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: "700", color: "#374151", borderBottom: "2px solid #d1fae5" },
  td: { padding: "12px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f3f4f6" },
  barBg: { height: 8, background: "#e8f5e9", borderRadius: 4, width: 100 },
  barFill: { height: "100%", background: "linear-gradient(90deg, #2d6a4f, #52b788)", borderRadius: 4 },
  note: { fontSize: 11, color: "#9ca3af", marginTop: 16, fontStyle: "italic" },
};

// ── MY TREES ───────────────────────────────────────────────────────────────────
function MyTrees({ trees }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All","Growing","Inoculated Once","Inoculated Twice","Ready for Harvest","Harvested"];
  const healthColor = { Healthy: "#15803d", Warning: "#d97706", Damaged: "#dc2626", Dead: "#6b7280" };
  const filtered = trees.filter(t =>
    t.treeId?.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || t.lifecycleStatus === filter)
  );
  return (
    <div>
      <div style={mt.controls}>
        <input placeholder="Search by Tree ID..." value={search} onChange={e => setSearch(e.target.value)} style={mt.search} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={mt.select}>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={mt.count}>{filtered.length} trees</span>
      </div>
      {filtered.length === 0
        ? <div style={mt.empty}>🌱 No trees found</div>
        : <div style={mt.grid}>
            {filtered.map((tree, i) => (
              <div key={i} style={mt.card}>
                <div style={mt.cardTop}>
                  <span style={mt.treeId}>{tree.treeId}</span>
                  {tree.blockchainStatus === "Verified" && <span style={mt.badge}>🔗 Verified</span>}
                </div>
                <div style={mt.cardBody}>
                  {[
                    { label: "Health",  value: tree.healthStatus,  color: healthColor[tree.healthStatus] },
                    { label: "Status",  value: tree.lifecycleStatus },
                    { label: "Block",   value: tree.block || "—" },
                    { label: "GPS",     value: tree.gps ? `${tree.gps.lat?.toFixed(4)}, ${tree.gps.lng?.toFixed(4)}` : "—", small: true },
                    { label: "Planted", value: tree.plantedDate ? new Date(tree.plantedDate).toLocaleDateString() : "—" },
                  ].map((row, j) => (
                    <div key={j} style={mt.row}>
                      <span style={mt.rowLabel}>{row.label}</span>
                      <span style={{ ...mt.rowVal, color: row.color || "#374151", fontSize: row.small ? 11 : 13 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
const mt = {
  controls: { display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" },
  search: { flex: 1, minWidth: 200, padding: "10px 16px", border: "1.5px solid #d1fae5", borderRadius: 10, fontSize: 14, outline: "none", background: "#f9fffe" },
  select: { padding: "10px 16px", border: "1.5px solid #d1fae5", borderRadius: 10, fontSize: 13, outline: "none", background: "#f9fffe", cursor: "pointer" },
  count: { fontSize: 13, color: "#6b7280", fontWeight: "600" },
  empty: { textAlign: "center", padding: 60, color: "#9ca3af", fontSize: 15 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
  card: { background: "#fff", borderRadius: 14, border: "1.5px solid #e8f5e9", overflow: "hidden" },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderBottom: "1px solid #d1fae5" },
  treeId: { fontWeight: "bold", color: "#1b4332", fontSize: 15 },
  badge: { fontSize: 11, background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: 20, fontWeight: "600" },
  cardBody: { padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { fontSize: 12, color: "#9ca3af", fontWeight: "600" },
  rowVal: { fontSize: 13, color: "#374151" },
};

// ── BLOCKCHAIN VERIFICATION ────────────────────────────────────────────────────
function BlockchainVerification({ trees }) {
  const verified = trees.filter(t => t.blockchainStatus === "Verified");
  const pending  = trees.filter(t => t.blockchainStatus !== "Verified");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={bv.banner}>
        <div style={{ fontSize: 40 }}>🔗</div>
        <div style={{ flex: 1 }}>
          <h3 style={bv.bannerTitle}>Blockchain Verification Status</h3>
          <p style={bv.bannerText}>Your tree records are immutably stored on the blockchain — they cannot be altered or deleted.</p>
        </div>
        <div style={bv.badge}>{verified.length}/{trees.length} Verified</div>
      </div>
      <div style={bv.stats}>
        {[
          { num: verified.length, label: "✅ Verified on Blockchain" },
          { num: pending.length,  label: "⏳ Pending Verification" },
          { num: trees.length,    label: "🌳 Total Trees" },
        ].map((s, i) => (
          <div key={i} style={bv.statCard}>
            <span style={bv.statNum}>{s.num}</span>
            <span style={bv.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
      {verified.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f5e9", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8f5e9" }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: "bold", color: "#1b4332" }}>Verified Tree Records</h4>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0fdf4" }}>
                  {["Tree ID","Lifecycle Status","GPS","Blockchain Tx Hash","Status"].map(h => <th key={h} style={bv.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {verified.map((tree, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafffe" }}>
                    <td style={{ ...bv.td, fontWeight: "bold", color: "#1b4332" }}>{tree.treeId}</td>
                    <td style={bv.td}><span style={bv.lifecycle}>{tree.lifecycleStatus}</span></td>
                    <td style={{ ...bv.td, fontSize: 12 }}>{tree.gps ? `${tree.gps.lat?.toFixed(4)}, ${tree.gps.lng?.toFixed(4)}` : "N/A"}</td>
                    <td style={{ ...bv.td, fontSize: 11, color: "#2d6a4f", fontFamily: "monospace" }}>{tree.blockchainTxHash ? `${tree.blockchainTxHash.substring(0, 20)}...` : "N/A"}</td>
                    <td style={bv.td}><span style={bv.verBadge}>✅ Verified</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
const bv = {
  banner: { display: "flex", alignItems: "center", gap: 20, background: "linear-gradient(135deg, #1b4332, #2d6a4f)", borderRadius: 16, padding: "24px 28px", color: "#fff" },
  bannerTitle: { fontSize: 18, fontWeight: "bold", margin: "0 0 6px", color: "#fff" },
  bannerText: { fontSize: 13, color: "#b7e4c7", margin: 0, lineHeight: 1.5 },
  badge: { marginLeft: "auto", background: "#52b788", color: "#fff", padding: "8px 18px", borderRadius: 20, fontWeight: "bold", fontSize: 14, whiteSpace: "nowrap" },
  stats: { display: "flex", gap: 16, flexWrap: "wrap" },
  statCard: { flex: 1, minWidth: 160, padding: "20px 24px", background: "#fff", border: "1.5px solid #e8f5e9", borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 },
  statNum: { fontSize: 26, fontWeight: "bold", color: "#1b4332" },
  statLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: "700", color: "#374151", borderBottom: "2px solid #d1fae5" },
  td: { padding: "12px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f3f4f6" },
  lifecycle: { background: "#e8f5e9", color: "#1b4332", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: "600" },
  verBadge: { background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: "700" },
};

// ── CERTIFICATE ────────────────────────────────────────────────────────────────
function CertificateSection({ investorId, trees }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const harvested = trees.filter(t => t.lifecycleStatus === "Harvested" && t.blockchainStatus === "Verified").length;

  const download = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/certificates/harvest/${investorId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Failed"); }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `Harvest_Certificate_${investorId}.pdf`;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={cs.wrap}>
      <div style={cs.hero}>
        <div style={{ fontSize: 56 }}>📄</div>
        <div>
          <h3 style={cs.heroTitle}>Harvest Certificate</h3>
          <p style={cs.heroText}>Download your official harvest certificate with blockchain verification hashes, GPS coordinates, and a QR code for instant verification.</p>
        </div>
      </div>
      <div style={cs.grid}>
        {[
          { num: harvested,                                                                label: "Harvested & Verified Trees" },
          { num: trees.filter(t => t.blockchainStatus === "Verified").length, label: "Blockchain Verified Trees" },
          { num: trees.length,                                                                 label: "Total Invested Trees" },
        ].map((c, i) => (
          <div key={i} style={cs.card}>
            <span style={cs.cardNum}>{c.num}</span>
            <span style={cs.cardLabel}>{c.label}</span>
          </div>
        ))}
      </div>
      <div style={cs.features}>
        {["✅ Blockchain transaction hashes for each tree","📍 GPS coordinates immutably recorded","🔲 QR code for instant digital verification","🏛️ Official Oudra Plantation branding","📅 Timestamped and digitally certified"].map((f, i) => (
          <div key={i} style={cs.feature}>{f}</div>
        ))}
      </div>
      {harvested === 0
        ? <div style={cs.notice}>ℹ️ No harvested and blockchain-verified trees found yet. The certificate will be available once your trees are harvested and verified on the blockchain.</div>
        : <button onClick={download} disabled={loading} style={cs.btn}>{loading ? "⏳ Generating..." : "📥 Download Harvest Certificate (PDF)"}</button>
      }
      {error && <div style={cs.error}>⚠️ {error}</div>}
    </div>
  );
}
const cs = {
  wrap: { background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e8f5e9" },
  hero: { display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 28 },
  heroTitle: { fontSize: 20, fontWeight: "bold", color: "#1b4332", margin: "0 0 10px" },
  heroText: { fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 },
  grid: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  card: { flex: 1, minWidth: 140, padding: "18px 20px", background: "#f0fdf4", border: "1px solid #d1fae5", borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 },
  cardNum: { fontSize: 28, fontWeight: "bold", color: "#1b4332" },
  cardLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  features: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 },
  feature: { padding: "12px 16px", background: "#f9fffe", border: "1px solid #e8f5e9", borderRadius: 8, fontSize: 13, color: "#374151" },
  notice: { background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", padding: "16px 20px", borderRadius: 10, fontSize: 13, lineHeight: 1.5 },
  btn: { width: "100%", padding: 16, background: "linear-gradient(135deg, #2d6a4f, #40916c)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: "pointer" },
  error: { marginTop: 12, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13 },
};

// ── PROFILE ────────────────────────────────────────────────────────────────────
function InvestorProfile({ investor }) {
  if (!investor) return null;
  return (
    <div style={ip.wrap}>
      <div style={ip.avatarCard}>
        <div style={ip.avatar}>{investor.name?.charAt(0).toUpperCase()}</div>
        <h3 style={ip.name}>{investor.name}</h3>
        <p style={ip.id}>{investor.investorId}</p>
        <span style={ip.status}>{investor.status}</span>
      </div>
      <div style={ip.details}>
        <h4 style={ip.detailTitle}>Account Details</h4>
        {[
          { label: "Full Name",         value: investor.name },
          { label: "Email Address",     value: investor.email },
          { label: "Phone Number",      value: investor.phone },
          { label: "Investor ID",       value: investor.investorId },
          { label: "Total Investment", value: `LKR ${investor.investment?.toLocaleString() || 0}` },
          { label: "Trees Invested",    value: investor.investedTrees?.length || 0 },
          { label: "Account Status",    value: investor.status },
          { label: "Member Since",      value: investor.createdAt ? new Date(investor.createdAt).toLocaleDateString() : "—" },
        ].map((row, i) => (
          <div key={i} style={ip.row}>
            <span style={ip.rowLabel}>{row.label}</span>
            <span style={ip.rowVal}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
const ip = {
  wrap: { display: "flex", gap: 24, flexWrap: "wrap" },
  avatarCard: { width: 240, background: "#fff", border: "1.5px solid #e8f5e9", borderRadius: 16, padding: "32px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  avatar: { width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #2d6a4f, #52b788)", color: "#fff", fontSize: 32, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "bold", color: "#1b4332", margin: 0 },
  id: { fontSize: 13, color: "#6b7280", margin: 0 },
  status: { background: "#dcfce7", color: "#15803d", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: "700" },
  details: { flex: 1, background: "#fff", border: "1.5px solid #e8f5e9", borderRadius: 16, padding: "24px 28px" },
  detailTitle: { fontSize: 16, fontWeight: "bold", color: "#1b4332", margin: "0 0 20px" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0fdf4" },
  rowLabel: { fontSize: 13, color: "#6b7280", fontWeight: "600" },
  rowVal: { fontSize: 13, color: "#1f2937", fontWeight: "500" },
};

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────────
export default function InvestorDashboard() {
  // ✅ useNavigate properly imported and used
  const navigate = useNavigate();

  const [tab,      setTab]      = useState("overview");
  const [investor, setInvestor] = useState(null);
  const [trees,    setTrees]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    // UPDATED: Check for generic /login instead of /investor/login
    if (!user?.id || user.role !== "investor") { 
      navigate("/login"); 
      return; 
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Logic to find the correct ID
      const investorId = user.linkedRecordId || user.investorDbId;
      if (!investorId) throw new Error("Investor record not linked to this login.");

      const [invRes, treeRes] = await Promise.all([
        fetch(`${API}/api/investors/${investorId}`,       { headers: getHeaders() }),
        fetch(`${API}/api/investors/${investorId}/trees`, { headers: getHeaders() }),
      ]);
      
      const invData  = await invRes.json();
      const treeData = await treeRes.json();
      
      if (invData.success)  setInvestor(invData.data);
      if (treeData.success) setTrees(treeData.data);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const tabs = [
    { id: "overview",    label: "Overview",         icon: "🏠" },
    { id: "trees",       label: "My Trees",         icon: "🌳" },
    { id: "blockchain",  label: "Blockchain Proof", icon: "🔗" },
    { id: "roi",         label: "ROI Calculator",   icon: "📊" },
    { id: "certificate", label: "Certificate",      icon: "📄" },
    { id: "profile",     label: "My Profile",       icon: "👤" },
  ];

  const verifiedCount  = trees.filter(t => t.blockchainStatus === "Verified").length;
  const harvestedCount = trees.filter(t => t.lifecycleStatus  === "Harvested").length;

  if (loading) {
    return (
      <div style={d.loadWrap}>
        <div style={{ fontSize: 48 }}>🌿</div>
        <p style={{ fontSize: 16, color: "#6b7280" }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={d.page}>
      {/* SIDEBAR */}
      <div style={d.sidebar}>
        <div style={{ marginBottom: 24 }}>
          <div style={d.logo}>🌿 Oudra</div>
          <p style={d.logoSub}>Investor Portal</p>
        </div>
        <div style={d.investorCard}>
          <div style={d.investorAvatar}>{investor?.name?.charAt(0) || user.firstName?.charAt(0) || "I"}</div>
          <div>
            <p style={d.investorName}>{investor?.name || user.firstName}</p>
            <p style={d.investorId}>{investor?.investorId || ""}</p>
          </div>
        </div>
        <nav style={d.nav}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ ...d.navBtn, ...(tab === t.id ? d.navBtnActive : {}) }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div style={d.sideBottom}>
          {/* ✅ Fixed: onClick with navigate */}
          <button onClick={() => navigate("/investor/change-password")} style={d.changePwBtn}>
            🔐 Change Password
          </button>
          <button onClick={handleLogout} style={d.logoutBtn}>← Sign Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={d.main}>
        <div style={d.topbar}>
          <div>
            <h1 style={d.pageTitle}>{tabs.find(t => t.id === tab)?.icon} {tabs.find(t => t.id === tab)?.label}</h1>
            <p style={d.pageSub}>Welcome back, {investor?.name?.split(" ")[0] || user.firstName}</p>
          </div>
          <span style={d.networkBadge}>🔗 Blockchain Active</span>
        </div>

        {error && <div style={d.errorBanner}>⚠️ {error}</div>}

        <div style={d.content}>
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={d.statsRow}>
                {[
                  { label: "Total Investment",     value: `LKR ${investor?.investment?.toLocaleString() || 0}`, icon: "💰", color: "#2d6a4f" },
                  { label: "Trees Invested",       value: trees.length,   icon: "🌳", color: "#059669" },
                  { label: "Blockchain Verified", value: verifiedCount,  icon: "🔗", color: "#0891b2" },
                  { label: "Harvested Trees",     value: harvestedCount, icon: "🌾", color: "#d97706" },
                ].map((s, i) => (
                  <div key={i} style={d.statCard}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <span style={{ ...d.statNum, color: s.color }}>{s.value}</span>
                    <span style={d.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div style={d.quickBox}>
                <h3 style={d.sectionTitle}>Quick Actions</h3>
                <div style={d.actionGrid}>
                  {[
                    { label: "View My Trees",    icon: "🌳", tab: "trees"       },
                    { label: "Blockchain Proof", icon: "🔗", tab: "blockchain"  },
                    { label: "ROI Calculator",   icon: "📊", tab: "roi"         },
                    { label: "Certificate",      icon: "📄", tab: "certificate" },
                  ].map((a, i) => (
                    <button key={i} onClick={() => setTab(a.tab)} style={d.actionBtn}>
                      <span style={{ fontSize: 28 }}>{a.icon}</span>
                      <span style={d.actionLabel}>{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {trees.length > 0 && (
                <div style={d.quickBox}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={d.sectionTitle}>Recent Trees</h3>
                    <button onClick={() => setTab("trees")} style={d.viewAllBtn}>View All →</button>
                  </div>
                  <div style={mt.grid}>
                    {trees.slice(0, 4).map((tree, i) => (
                      <div key={i} style={mt.card}>
                        <div style={mt.cardTop}>
                          <span style={mt.treeId}>{tree.treeId}</span>
                          {tree.blockchainStatus === "Verified" && <span style={mt.badge}>🔗</span>}
                        </div>
                        <div style={mt.cardBody}>
                          <div style={mt.row}><span style={mt.rowLabel}>Status</span><span style={mt.rowVal}>{tree.lifecycleStatus}</span></div>
                          <div style={mt.row}><span style={mt.rowLabel}>Health</span><span style={mt.rowVal}>{tree.healthStatus}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === "trees"       && <MyTrees trees={trees} />}
          {tab === "blockchain"  && <BlockchainVerification trees={trees} />}
          {tab === "roi"         && <ROICalculator investment={investor?.investment} treeCount={trees.length} />}
          {tab === "certificate" && <CertificateSection investorId={investor?._id} trees={trees} />}
          {tab === "profile"     && <InvestorProfile investor={investor} />}
        </div>
      </div>
    </div>
  );
}

const d = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "Georgia, serif", background: "#f8faf9" },
  loadWrap: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#f0fdf4" },
  sidebar: { width: 260, background: "linear-gradient(180deg, #1b4332 0%, #2d6a4f 100%)", display: "flex", flexDirection: "column", padding: "28px 20px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  logo: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  logoSub: { fontSize: 12, color: "#74c69d", margin: "4px 0 0" },
  investorCard: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", marginBottom: 28 },
  investorAvatar: { width: 40, height: 40, borderRadius: "50%", background: "#52b788", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: "bold" },
  investorName: { fontSize: 14, fontWeight: "bold", color: "#fff", margin: 0 },
  investorId: { fontSize: 11, color: "#74c69d", margin: "3px 0 0" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navBtn: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, border: "none", background: "transparent", color: "#b7e4c7", fontSize: 14, cursor: "pointer", textAlign: "left" },
  navBtnActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: "bold" },
  sideBottom: { display: "flex", flexDirection: "column", gap: 8, marginTop: 20 },
  changePwBtn: { padding: "10px 14px", background: "rgba(255,255,255,0.1)", color: "#b7e4c7", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  logoutBtn: { padding: "10px 14px", background: "transparent", color: "#fca5a5", border: "1px solid rgba(252,165,165,0.3)", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", background: "#fff", borderBottom: "1px solid #e8f5e9" },
  pageTitle: { fontSize: 22, fontWeight: "bold", color: "#1b4332", margin: 0 },
  pageSub: { fontSize: 13, color: "#6b7280", margin: "4px 0 0" },
  networkBadge: { background: "#dcfce7", color: "#15803d", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: "700" },
  errorBanner: { background: "#fef2f2", color: "#dc2626", padding: "12px 32px", fontSize: 13, borderBottom: "1px solid #fecaca" },
  content: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 },
  statCard: { background: "#fff", border: "1.5px solid #e8f5e9", borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  statNum: { fontSize: 26, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#9ca3af", fontWeight: "600" },
  quickBox: { background: "#fff", border: "1.5px solid #e8f5e9", borderRadius: 14, padding: "22px 24px" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1b4332", margin: "0 0 16px" },
  actionGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
  actionBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 12px", background: "#f0fdf4", border: "1.5px solid #d1fae5", borderRadius: 12, cursor: "pointer" },
  actionLabel: { fontSize: 12, color: "#374151", fontWeight: "600", textAlign: "center" },
  viewAllBtn: { background: "none", border: "none", color: "#2d6a4f", fontSize: 13, cursor: "pointer", fontWeight: "bold" },
};