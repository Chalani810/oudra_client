import React, { useState, useEffect, useRef } from "react";

const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const StatCard = ({ value, suffix, label, delay, inView }) => {
  const count = useCounter(value, 1800, inView);
  return (
    <div className="text-center" style={{ animation: inView ? `fadeUp 0.6s ease ${delay}s both` : "none" }}>
      <div className="text-4xl font-extrabold text-green-600 tabular-nums">{count}{suffix}</div>
      <div className="mt-1 text-gray-500 text-xs font-medium tracking-widest uppercase">{label}</div>
    </div>
  );
};

const CustomerViewEvent = () => {
  const [activeTab, setActiveTab] = useState("investors");
  const [statsRef, statsInView] = useInView(0.3);

  return (
    <div className="value-page font-sans text-gray-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .value-page * { font-family: 'DM Sans', sans-serif; }
        .value-page h1, .value-page h2, .value-page h3 { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.3s both; }
        .hero-bg {
          background: linear-gradient(135deg, #1a4731 0%, #2d6a4f 45%, #4a9e6b 100%);
          position: relative; overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
        }
        .tab-pill { transition: all 0.3s ease; cursor: pointer; }
        .tab-pill.active { background: #16a34a; color: white; box-shadow: 0 4px 16px rgba(22,163,74,0.3); }
        .feat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .feat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.09); }
        .glass { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13); backdrop-filter: blur(8px); }
      `}</style>

      {/* HERO */}
      <section className="hero-bg py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="fade-up inline-flex items-center gap-2 bg-green-900 bg-opacity-60 border border-green-700 text-green-300 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Sri Lanka's Premier Agarwood Platform
          </div>
          <h1 className="fade-up-1 text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            Sri Lanka's Premier <span className="text-green-400">Agarwood</span> Plantation
          </h1>
          <p className="fade-up-2 text-green-100 text-sm max-w-lg mx-auto leading-relaxed font-light">
            We transform traditional Agarwood cultivation through IoT sensors, AI analytics,
            and blockchain traceability — from seedling at Ayagama Estate to premium oud oil,
            every step is data-driven and fully transparent.
          </p>
        </div>
        <div className="fade-up-3 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { icon: "🌱", label: "IoT Monitoring",      desc: "24/7 sensor data streams" },
            { icon: "🔗", label: "Blockchain Certified", desc: "Tamper-proof tree records" },
            { icon: "🤖", label: "AI Predictions",       desc: "Yield & resin forecasting" },
          ].map((item, i) => (
            <div key={i} className="glass rounded-xl p-3 text-left">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white font-semibold text-sm">{item.label}</div>
              <div className="text-green-300 text-xs mt-0.5 font-light">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 bg-white border-b border-gray-100" ref={statsRef}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={500} suffix="+" label="Trees Monitored"   delay={0}   inView={statsInView} />
          <StatCard value={98}  suffix="%" label="Data Accuracy"     delay={0.1} inView={statsInView} />
          <StatCard value={40}  suffix="%" label="Yield Increase"    delay={0.2} inView={statsInView} />
          <StatCard value={100} suffix="+" label="Investors Onboard" delay={0.3} inView={statsInView} />
        </div>
      </section>

      {/* TABS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Value for <span className="text-green-600">Everyone</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">
              Whether you're growing your portfolio or purchasing premium agarwood
              products, Oudra delivers transparent, technology-backed value.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="bg-white rounded-full p-1.5 shadow-md flex gap-2 border border-gray-100">
              {[
                { id: "investors", label: "🌳  For Investors" },
                { id: "customers", label: "🛍️  For Customers" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-pill px-6 py-2.5 rounded-full text-sm font-semibold ${
                    activeTab === tab.id ? "active" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "investors" && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  Investment Opportunity
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
                  Grow Wealth with the World's <span className="text-green-600"> Most Valuable Wood</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Agarwood commands prices exceeding $30,000/kg globally. Our platform maximises yield,
                  minimises risk, and gives you complete visibility into your investment — from seedling to harvest.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: "📊", title: "Real-Time Dashboard",   desc: "Track tree health, growth metrics, and projected returns live." },
                    { icon: "🔒", title: "Blockchain Certificate", desc: "Every tree has a tamper-proof digital record from planting to sale." },
                    { icon: "🤖", title: "AI Yield Prediction",    desc: "Machine learning forecasts resin quality and optimal harvest timing." },
                    { icon: "🌍", title: "Global Market Access",   desc: "Direct connections to premium oud oil buyers worldwide." },
                  ].map((item, i) => (
                    <li key={i} className="feat-card flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-800 to-green-950 rounded-3xl p-7 text-white shadow-2xl">
                <div className="text-xs font-semibold tracking-widest uppercase text-green-400 mb-5">Live Portfolio Preview</div>
                <div className="space-y-4">
                  {[
                    { label: "Tree ID #AU-2241", roi: "+18%", bar: 78, status: "Healthy" },
                    { label: "Tree ID #AU-2242", roi: "+12%", bar: 55, status: "Monitoring" },
                    { label: "Tree ID #AU-2243", roi: "+22%", bar: 88, status: "Healthy" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white bg-opacity-10 rounded-xl p-3.5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-green-400 font-bold text-sm">{item.roi} ROI</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: `${item.bar}%` }}></div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === "Healthy"
                            ? "bg-green-500 bg-opacity-30 text-green-300"
                            : "bg-yellow-500 bg-opacity-30 text-yellow-300"
                        }`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white border-opacity-10 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-green-400 font-bold text-2xl">LKR 4.2M</div>
                    <div className="text-green-200 text-xs mt-0.5">Portfolio Value</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-2xl">17.3%</div>
                    <div className="text-green-200 text-xs mt-0.5">Avg. Annual Return</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  Premium Products
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
                  Certified, Traceable <span className="text-green-600"> Agarwood Products</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Every product from our plantation carries a blockchain-verified certificate of authenticity.
                  From oud oil to raw chips — you know exactly where it came from, how it was grown, and who handled it.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: "🏷️", title: "Blockchain Verified Origin", desc: "Scan QR to trace your product from tree to your hands." },
                    { icon: "🌿", title: "100% Organic Cultivation",   desc: "Grown with AI precision — no synthetic chemicals." },
                    { icon: "⭐", title: "Premium Grade Oud Oil",       desc: "Extracted from resin-rich zones identified by computer vision." },
                    { icon: "📦", title: "Transparent Pricing",         desc: "Fair, data-backed pricing with zero middlemen markups." },
                  ].map((item, i) => (
                    <li key={i} className="feat-card flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-7 text-white shadow-2xl">
                <div className="text-xs font-semibold tracking-widest uppercase text-green-400 mb-5">Product Certificate</div>
                <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-5 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center text-xl">🌿</div>
                    <div>
                      <div className="font-bold text-sm">Premium Oud Oil — Grade A</div>
                      <div className="text-green-400 text-xs">Batch #OUD-2025-0041</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {[
                      ["Origin",      "Ayagama Estate, SL"],
                      ["Tree Age",    "12 Years"],
                      ["Resin Grade", "AAA Premium"],
                      ["Certified By","Blockchain #1A2F"],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-white bg-opacity-5 rounded-lg p-2.5">
                        <div className="text-gray-400">{k}</div>
                        <div className="font-semibold mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-green-900 bg-opacity-50 rounded-xl p-3">
                  <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-green-300">Authenticity Verified</div>
                    <div className="text-xs text-gray-400">Immutable blockchain record confirmed</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CustomerViewEvent;