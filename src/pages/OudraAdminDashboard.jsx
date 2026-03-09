// path: oudra-client/src/pages/OudraAdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import {
  Filter, Camera, FileText, Download,
  CloudSun, Thermometer, Wind, Droplets, Eye, Gauge,
  Sunrise, Sunset, Leaf, RefreshCw, AlertTriangle, MapPin, Search,
  Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Sun, Cloudy,
} from "lucide-react";
import TreeMap from "../component/TreeMap/TreeMap";
import { treeService } from "../services/treeService";
import SidePanel from "../component/SidePanel";
import getFormattedWeatherData from "../services/WeatherService";

// ─── OWM icon code → Lucide icon ─────────────────────────────────────────────
const getWeatherIcon = (iconCode, size = 32, extraClass = "") => {
  if (!iconCode) return <Sun size={size} className={`text-yellow-400 ${extraClass}`} />;
  const code = iconCode.replace(/[dn]$/, "");
  const cls  = (c) => `${c} ${extraClass}`;
  const map = {
    "01": <Sun             size={size} className={cls("text-yellow-400")} />,
    "02": <CloudSun        size={size} className={cls("text-yellow-300")} />,
    "03": <Cloud           size={size} className={cls("text-gray-400")}  />,
    "04": <Cloudy          size={size} className={cls("text-gray-500")}  />,
    "09": <CloudDrizzle    size={size} className={cls("text-blue-400")}  />,
    "10": <CloudRain       size={size} className={cls("text-blue-500")}  />,
    "11": <CloudLightning  size={size} className={cls("text-purple-500")}/>,
    "13": <CloudSnow       size={size} className={cls("text-blue-200")}  />,
    "50": <CloudFog        size={size} className={cls("text-gray-400")}  />,
  };
  return map[code] ?? <Cloud size={size} className={cls("text-gray-400")} />;
};

// ─── Weather stat card ────────────────────────────────────────────────────────
const WeatherStatCard = ({ icon: Icon, label, value, unit, iconColor, bgColor }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
    <div className={`p-2.5 rounded-lg ${bgColor}`}>
      <Icon size={18} className={iconColor} />
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-base font-bold text-gray-800">
        {value ?? "—"}
        {value != null && <span className="text-xs font-normal text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);

// ─── Plant care tips ──────────────────────────────────────────────────────────
const getPlantTips = (w) => {
  if (!w) return [];
  const tips = [];
  if (w.temp > 30)     tips.push({ Icon: Thermometer, text: "High temp — ensure hydration",        level: "warn", color: "text-red-500"    });
  if (w.temp < 10)     tips.push({ Icon: CloudSnow,   text: "Low temp — protect saplings",         level: "warn", color: "text-blue-500"   });
  if (w.humidity > 80) tips.push({ Icon: Droplets,    text: "High humidity — watch for fungi",     level: "warn", color: "text-blue-400"   });
  if (w.humidity < 30) tips.push({ Icon: Droplets,    text: "Low humidity — increase watering",    level: "warn", color: "text-orange-400" });
  if (w.speed > 20)    tips.push({ Icon: Wind,        text: "Strong winds — secure equipment",     level: "warn", color: "text-cyan-500"   });
  if (tips.length === 0) tips.push({ Icon: Leaf,      text: "Ideal growing conditions today",      level: "ok",   color: "text-green-600"  });
  return tips;
};

// ─── Inline Weather Section (embedded below the map) ─────────────────────────
const WeatherSection = () => {
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [units,   setUnits]   = useState("metric");
  const [query,   setQuery]   = useState({ q: "Ayagama" });
  const [search,  setSearch]  = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { setQuery({ q: search.trim() }); setSearch(""); }
  };

  useEffect(() => { fetchWeather(); }, [query, units]); // eslint-disable-line

 // Find this in OudraAdminDashboard.jsx
const fetchWeather = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await getFormattedWeatherData({ ...query, units });
    setWeather(data);
  } catch (err) { 
    console.error("Detailed Weather Error:", err); 
    setError("Could not load weather data.");
  } finally {
    setLoading(false);
  }
};

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";
  const tips     = getPlantTips(weather);

  const safeVisibility = (v) => (!v || isNaN(v) ? null : (v / 1000).toFixed(1));
  const safePressure   = (v) => (!v || isNaN(v) ? null : v);

  const CITIES = ["Colombo", "Kandy", "Galle", "Matara", "Jaffna", "Ayagama"];

  return (
    <div className="px-6 pb-6 space-y-4">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CloudSun size={20} className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Weather Forecast</h3>
          {weather && !loading && (
            <span className="text-sm text-gray-400">{weather.name}, {weather.country}</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-1.5">
            <div className="relative">
              <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city…"
                className="pl-7 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-green-400 w-32"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
            >
              <Search size={12} /> Search
            </button>
          </form>

          {/* City quick-select */}
          <div className="hidden md:flex gap-1.5">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setQuery({ q: c })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  weather?.name === c
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Unit toggle */}
          <div className="flex bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {["metric", "imperial"].map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  units === u ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {u === "metric" ? "°C" : "°F"}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchWeather}
            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh weather"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-green-500" : "text-gray-500"} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertTriangle size={15} /> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-20 border border-gray-100" />
          ))}
        </div>
      )}

      {/* ── Weather Content ── */}
      {!loading && weather && (
        <div className="space-y-4">

          {/* Hero + Sunrise/Sunset */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 text-white flex items-center justify-between gap-4">
              {/* Left: location + description */}
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={13} className="text-green-200 shrink-0" />
                <span className="text-sm font-semibold truncate">{weather.name}, {weather.country}</span>
                <span className="text-green-300 text-xs shrink-0">·</span>
                <span className="capitalize text-green-200 text-xs truncate">{weather.details}</span>
              </div>
              {/* Right: temp + feels like + icon + date */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-bold leading-none">{Math.round(weather.temp)}{tempUnit}</p>
                  <p className="text-green-200 text-xs mt-0.5">
                    Feels {Math.round(weather.feels_like)}{tempUnit}&nbsp;·&nbsp;H:{Math.round(weather.temp_max)}° L:{Math.round(weather.temp_min)}°
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-1.5">
                  {getWeatherIcon(weather.icon, 28)}
                </div>
                <p className="text-green-200 text-xs hidden lg:block">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>

            {/* Sunrise / Sunset strip */}
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {[
                { Icon: Sunrise, label: "Sunrise", val: weather.sunrise, bg: "bg-amber-50",  color: "text-amber-500"  },
                { Icon: Sunset,  label: "Sunset",  val: weather.sunset,  bg: "bg-orange-50", color: "text-orange-500" },
              ].map(({ Icon, label, val, bg, color }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-3">
                  <div className={`p-1.5 ${bg} rounded-lg`}><Icon size={16} className={color} /></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-bold text-gray-800">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <WeatherStatCard icon={Droplets}    label="Humidity"   value={weather.humidity}                                      unit="%"       iconColor="text-blue-500"   bgColor="bg-blue-50"   />
            <WeatherStatCard icon={Wind}        label="Wind"       value={weather.speed != null ? Math.round(weather.speed) : null} unit={windUnit} iconColor="text-cyan-500"  bgColor="bg-cyan-50"  />
            <WeatherStatCard icon={Thermometer} label="Feels Like" value={weather.feels_like != null ? Math.round(weather.feels_like) : null} unit={tempUnit} iconColor="text-red-400" bgColor="bg-red-50" />
            {safePressure(weather.pressure) && (
              <WeatherStatCard icon={Gauge} label="Pressure" value={safePressure(weather.pressure)} unit="hPa" iconColor="text-gray-500" bgColor="bg-gray-50" />
            )}
            {safeVisibility(weather.visibility) && (
              <WeatherStatCard icon={Eye} label="Visibility" value={safeVisibility(weather.visibility)} unit="km" iconColor="text-purple-500" bgColor="bg-purple-50" />
            )}
          </div>

          {/* Forecasts + Care — 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Hourly */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" /> Hourly Forecast
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {weather.hourly?.map((h, i) => (
                  <div key={i} className="flex flex-col items-center bg-gray-50 rounded-xl p-2.5 min-w-[66px] border border-gray-100 gap-0.5">
                    <p className="text-xs text-gray-400 font-medium text-center leading-tight">{h.title}</p>
                    <div className="my-1">{getWeatherIcon(h.icon, 22)}</div>
                    <p className="text-sm font-bold text-gray-800">{Math.round(h.temp)}°</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" /> 7-Day Forecast
              </h4>
              <div className="space-y-2.5">
                {weather.daily?.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 w-10">{d.title}</span>
                    <div className="flex-1 flex justify-center">{getWeatherIcon(d.icon, 20)}</div>
                    <span className="font-semibold text-gray-800 w-14 text-right">{Math.round(d.temp)}{tempUnit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tree & Crop Care + Conditions Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Leaf size={13} className="text-green-600" /> Tree &amp; Crop Care
              </h4>

              <div className="space-y-2 mb-3">
                {tips.map(({ Icon, text, level, color }, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 rounded-lg p-2.5 text-xs ${
                      level === "ok"
                        ? "bg-green-50 border border-green-100 text-green-800"
                        : "bg-amber-50 border border-amber-100 text-amber-800"
                    }`}
                  >
                    <Icon size={13} className={`mt-0.5 shrink-0 ${color}`} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Conditions Summary — same dot+label style as Tree Health Status legend */}
              <div className="pt-3 border-t border-gray-100">
                <p className="font-semibold mb-2 text-gray-800 text-xs uppercase tracking-wider">Conditions</p>
                <div className="space-y-1.5 text-sm">
                  {[
                    { label: "Temperature", val: `${Math.round(weather.temp)}${tempUnit}`,   ok: weather.temp >= 10 && weather.temp <= 30 },
                    { label: "Humidity",    val: `${weather.humidity}%`,                      ok: weather.humidity >= 40 && weather.humidity <= 70 },
                    { label: "Wind Speed",  val: `${Math.round(weather.speed)} ${windUnit}`,  ok: weather.speed <= 20 },
                  ].map(({ label, val, ok }) => (
                    <div key={label} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${ok ? "bg-green-500" : "bg-yellow-400"}`} />
                        <span className="text-gray-600 text-xs">{label}</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-xs">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Main Dashboard
// ═════════════════════════════════════════════════════════════════════════════
const OudraAdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    healthy: 0, warning: 0, damaged: 0, dead: 0,
    totalWithGPS: 0, totalTrees: 0, harvestedTrees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const trees = await treeService.getAllTrees();
      const activeTreesWithGPS = trees.filter(
        (t) => t.gps && t.gps.lat !== 0 && t.lifecycleStatus !== "Harvested"
      );
      setStats({
        healthy:        trees.filter((t) => t.healthStatus === "Healthy"  && t.lifecycleStatus !== "Harvested").length,
        warning:        trees.filter((t) => t.healthStatus === "Warning"  && t.lifecycleStatus !== "Harvested").length,
        damaged:        trees.filter((t) => t.healthStatus === "Damaged"  && t.lifecycleStatus !== "Harvested").length,
        dead:           trees.filter((t) => t.healthStatus === "Dead"     && t.lifecycleStatus !== "Harvested").length,
        totalWithGPS:   activeTreesWithGPS.length,
        totalTrees:     trees.length,
        harvestedTrees: trees.filter((t) => t.lifecycleStatus === "Harvested").length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const mapRef = useRef(null);

  const downloadMapImage = async () => {
    if (!mapRef.current) return;
    
    try {
      const canvas = await html2canvas(mapRef.current, {
        useCORS: true, // Crucial for loading Google Maps tiles
        allowTaint: true,
        backgroundColor: null,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Oudra-Tree-Map-${new Date().toISOString().split('T')[0]}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error capturing map:", error);
      alert("Failed to capture map snapshot.");
    }
  };

  const handleExportMap = downloadMapImage;
  const handleMapSnapshot = downloadMapImage;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />

      <div className="flex-1 ml-0 md:ml-64 overflow-auto">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Virtual Tree Map</h2>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? "Loading…" : (
                <>
                  {stats.totalWithGPS} active trees mapped
                  {stats.harvestedTrees > 0 && (
                    <span className="text-gray-500 ml-2">
                      ({stats.harvestedTrees} harvested trees hidden)
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMapSnapshot}
              className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Camera size={18} className="mr-2" />
              Snapshot
            </button>
            <button
              onClick={fetchStats}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh data"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* ── Map Area ── */}
        <div className="p-6 pb-4">
          {/* 👇 ADDED ref={mapRef} HERE */}
          <div ref={mapRef} className="relative bg-white rounded-xl shadow-sm w-full h-[600px] overflow-hidden">
            <TreeMap />

            {/* Action Buttons (Top centre) */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              {/* REMOVED Generate Report Button */}
              
              <button
                onClick={handleExportMap}
                className="flex items-center bg-white px-3 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                <Download size={18} className="mr-2" />
                Export Map
              </button>
            </div>

            {/* Tree Health Status Legend (Bottom-left) */}
            <div className="absolute bottom-6 left-6 bg-white shadow-md rounded-xl p-4 z-10">
              <p className="font-semibold mb-3 text-gray-800">Tree Health Status</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Healthy", color: "bg-green-500",  count: stats.healthy  },
                  { label: "Warning", color: "bg-yellow-500", count: stats.warning  },
                  { label: "Damaged", color: "bg-orange-500", count: stats.damaged  },
                  { label: "Dead",    color: "bg-red-500",    count: stats.dead     },
                ].map(({ label, color, count }) => (
                  <div key={label} className="flex justify-between items-center w-48">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 ${color} rounded-full`} />
                      <span className="text-gray-700">{label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>

              {stats.harvestedTrees > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    * {stats.harvestedTrees} harvested tree
                    {stats.harvestedTrees !== 1 ? "s" : ""} not shown on map
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Weather Section (below the map) ── */}
        <WeatherSection />

      </div>
    </div>
  );
};

export default OudraAdminDashboard;