import React from "react";
import { Loader2, ChevronRight, X } from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
export const RED     = "#C0392B";
export const RED_LT  = "#FFF0EF";
export const RED_MID = "#E8453C";
export const SB_BG   = "#FFF8F8";
export const BORDER  = "#F0D8D8";

// ─── HSK level colours ────────────────────────────────────────────────────────
export const HSK_CLR = {
  1: { bg: "#E8F5E9", text: "#2E7D32" },
  2: { bg: "#E3F2FD", text: "#1565C0" },
  3: { bg: "#FFF8E1", text: "#F57F17" },
  4: { bg: "#FCE4EC", text: "#880E4F" },
  5: { bg: "#F3E5F5", text: "#6A1B9A" },
  6: { bg: "#EFEBE9", text: "#4E342E" },
};

// ─── Small shared components ──────────────────────────────────────────────────
export function HskBadge({ level }) {
  const c = HSK_CLR[level] || { bg: "#F5F5F5", text: "#555" };
  return (
    <span style={{ background: c.bg, color: c.text }}
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
      HSK {level}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={28} className="animate-spin" style={{ color: RED_MID }} />
    </div>
  );
}

export function Empty({ text = "No data found." }) {
  return (
    <tr><td colSpan={99} className="px-6 py-14 text-center text-[#9B9BB4] text-sm">{text}</td></tr>
  );
}

export function ActionBtn({ icon: Icon, color = "#555", onClick, title }) {
  return (
    <button title={title} onClick={onClick}
      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" style={{ color }}>
      <Icon size={15} />
    </button>
  );
}

export function Breadcrumb({ crumbs }) {
  return (
    <nav className="text-xs text-[#9B9BB4] flex items-center gap-1 mb-1">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          <span className={i === crumbs.length - 1 ? "text-[#1A1A2E] font-semibold" : ""}>{c}</span>
        </span>
      ))}
    </nav>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" style={{ borderTop: `4px solid ${RED_MID}` }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className="font-bold text-lg text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = "w-full border rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-red-300 transition";
export const btnPrimary = "px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm hover:brightness-90 transition-all flex items-center gap-2";
export const btnSecondary = "px-4 py-2 rounded-xl border text-sm font-semibold text-[#4A4A6A] hover:bg-gray-50 transition-colors";
