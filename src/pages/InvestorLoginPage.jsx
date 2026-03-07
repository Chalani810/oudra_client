// src/pages/InvestorLoginPage.jsx
// ✅ CHANGES:
//  1. After login, checks data.user.mustChangePassword
//  2. If true → redirects to /investor/change-password (forced first-login flow)
//  3. If false → redirects to /investor/dashboard (normal login)
//  4. Stores _id consistently (was "id" in old response, now "_id")

import { useState } from "react";

const API = "http://localhost:5000";

export default function InvestorLoginPage() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    form.email,
          password: form.password,
          platform: "web",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ── Role guard: only investors can use this portal ──────────
      if (data.user?.role !== "investor") {
        throw new Error("This portal is for investors only.");
      }

      // ── Persist auth data ────────────────────────────────────────
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ If admin flagged this account as needing a password change,
      //    send them to the change-password page before the dashboard.
      if (data.user?.mustChangePassword) {
        window.location.href = "/investor/change-password";
      } else {
        window.location.href = "/investor/dashboard";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h1 style={s.brand}>Oudra Plantation</h1>
          <p style={s.brandSub}>Premium Agarwood Investment Platform</p>
          <div style={s.featureList}>
            {[
              { icon: "🔗", text: "Blockchain-verified tree records" },
              { icon: "📊", text: "Real-time ROI tracking" },
              { icon: "🌳", text: "GPS-tagged tree monitoring" },
              { icon: "📄", text: "Downloadable harvest certificates" },
            ].map((f, i) => (
              <div key={i} style={s.feature}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (login form) ────────────────────────────── */}
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Investor Portal</h2>
          <p style={s.cardSub}>Sign in with credentials provided by Oudra Admin</p>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={s.input}
                required
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={s.input}
                required
              />
            </div>

            {error && <div style={s.error}>⚠️ {error}</div>}

            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={s.hint}>
            Don't have credentials? Contact your plantation administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "Georgia, serif" },
  left: {
    width: "45%",
    background: "linear-gradient(160deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 50px",
  },
  leftInner: { maxWidth: 380 },
  brand:    { fontSize: 32, fontWeight: "bold", color: "#fff", margin: "0 0 8px" },
  brandSub: { fontSize: 15, color: "#b7e4c7", margin: "0 0 40px", lineHeight: 1.5 },
  featureList: { display: "flex", flexDirection: "column", gap: 16 },
  feature: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "12px 16px", background: "rgba(255,255,255,0.1)", borderRadius: 10,
  },
  featureText: { color: "#d8f3dc", fontSize: 14, lineHeight: 1.4 },
  right: {
    width: "55%", background: "#f8faf9",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 50px",
  },
  card: {
    background: "#fff", borderRadius: 20, padding: "48px 44px",
    width: "100%", maxWidth: 440,
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)", border: "1px solid #e8f5e9",
  },
  cardTitle: { fontSize: 26, fontWeight: "bold", color: "#1b4332", margin: "0 0 8px" },
  cardSub:   { fontSize: 14, color: "#6b7280", margin: "0 0 32px", lineHeight: 1.5 },
  form:  { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151" },
  input: {
    padding: "12px 16px", borderRadius: 10, border: "1.5px solid #d1fae5",
    fontSize: 14, color: "#1f2937", outline: "none", background: "#f9fffe",
  },
  error: {
    background: "#fef2f2", border: "1px solid #fecaca",
    color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13,
  },
  btn: {
    padding: "14px",
    background: "linear-gradient(135deg, #2d6a4f, #40916c)",
    color: "#fff", border: "none", borderRadius: 10,
    fontSize: 15, fontWeight: "bold", cursor: "pointer",
  },
  hint: { textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 24, lineHeight: 1.5 },
};