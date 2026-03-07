import { useState } from "react";

export default function InvestorChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Simulate mustChangePassword flag (would come from auth context/localStorage in real app)
  const isForcedChange = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) return setError("New passwords do not match.");
    if (form.newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (form.currentPassword === form.newPassword) return setError("New password must be different from your current password.");

    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess("Password changed successfully! Redirecting to your dashboard...");
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ fontSize: 48, marginBottom: 16, textAlign: "center" }}>🔐</div>
        <h2 style={s.title}>{isForcedChange ? "Set Your Password" : "Change Password"}</h2>
        <p style={s.subtitle}>
          {isForcedChange
            ? "Welcome! For your security, please set a new password before continuing."
            : "Please set a new secure password for your account."}
        </p>

        {isForcedChange && (
          <div style={s.banner}>
            🔒 You must change your temporary password before accessing your dashboard.
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>{isForcedChange ? "Temporary Password" : "Current Password"}</label>
            <input
              type="password"
              placeholder={isForcedChange ? "Enter temporary password from email" : "Enter current password"}
              value={form.currentPassword}
              onChange={e => setForm({ ...form, currentPassword: e.target.value })}
              style={s.input}
              required
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>New Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              style={s.input}
              required
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              style={s.input}
              required
            />
          </div>

          {error   && <div style={s.error}>⚠️ {error}</div>}
          {success && <div style={s.successMsg}>✅ {success}</div>}

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Updating..." : "Update Password →"}
          </button>

          {!isForcedChange && (
            <button type="button" style={s.cancelBtn}>Cancel</button>
          )}
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", background: "#f0faf4",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "Georgia, serif", padding: 20,
  },
  card: {
    background: "#fff", borderRadius: 20, padding: "48px 44px",
    width: "100%", maxWidth: 440,
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)", border: "1px solid #e8f5e9",
    textAlign: "center",
  },
  title:    { fontSize: 24, fontWeight: "bold", color: "#1b4332", margin: "0 0 10px" },
  subtitle: { fontSize: 14, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 },
  banner: {
    background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e",
    padding: "12px 16px", borderRadius: 8, fontSize: 13,
    marginBottom: 20, lineHeight: 1.5,
  },
  form:  { display: "flex", flexDirection: "column", gap: 18, textAlign: "left" },
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
  successMsg: {
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    color: "#15803d", padding: "10px 14px", borderRadius: 8, fontSize: 13,
  },
  btn: {
    padding: "14px",
    background: "linear-gradient(135deg, #2d6a4f, #40916c)",
    color: "#fff", border: "none", borderRadius: 10,
    fontSize: 15, fontWeight: "bold", cursor: "pointer",
  },
  cancelBtn: {
    padding: "12px", background: "transparent", color: "#6b7280",
    border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, cursor: "pointer",
  },
};