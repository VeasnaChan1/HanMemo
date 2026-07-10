import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import {
  BookCopy,
  BookOpen,
  Languages,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { Breadcrumb, Spinner, RED, RED_LT, RED_MID, BORDER } from "./SharedAdminUI";

export default function DashboardSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch { /* server might be offline */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function StatCard({ icon: Icon, label, value, delta, positive }) {
    return (
      <div className="bg-white border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
        style={{ borderColor: BORDER }}>
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: RED_LT }}>
            <Icon size={20} style={{ color: RED_MID }} />
          </div>
          {delta !== undefined && (
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${positive ? "text-green-600" : "text-red-500"}`}>
              {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {delta}
            </span>
          )}
        </div>
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase" style={{ color: RED }}>{label}</p>
          <p className="text-3xl font-black text-[#1A1A2E] mt-0.5">{value?.toLocaleString() ?? "—"}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb crumbs={["HanMemo", "Admin Dashboard"]} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">System Overview</h1>
          <p className="text-sm text-[#9B9BB4]">Real-time performance metrics across the ecosystem.</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg hover:bg-red-50 text-[#9B9BB4] hover:text-[#E8453C] transition-colors" title="Refresh">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard icon={BookCopy}  label="Total Decks"     value={stats?.totalDecks}      delta="+12%"  positive />
          <StatCard icon={BookOpen}  label="Total Lessons"   value={stats?.totalLessons}    delta="+5.4%" positive />
          <StatCard icon={Languages} label="Vocabulary"      value={stats?.totalVocabulary} delta="+22.1%" positive />
          <StatCard icon={Users}     label="Total Users"     value={stats?.totalUsers}      delta="-8%"   positive={false} />
        </div>
      )}
    </div>
  );
}
