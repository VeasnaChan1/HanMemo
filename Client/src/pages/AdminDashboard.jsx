import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  LayoutDashboard,
  BookCopy,
  BookOpen,
  Languages,
  Users,
  LogOut,
  UserCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Bell,
  HelpCircle,
  CheckSquare,
} from "lucide-react";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const RED = "#C0392B";
const RED_LIGHT = "#FFF0EF";
const RED_MID = "#E8453C";
const SIDEBAR_BG = "#FFF8F8";
const BORDER = "#F0D8D8";

// ─── HSK badge colours ────────────────────────────────────────────────────────
const HSK_COLORS = {
  1: { bg: "#E8F5E9", text: "#2E7D32" },
  2: { bg: "#E3F2FD", text: "#1565C0" },
  3: { bg: "#FFF8E1", text: "#F57F17" },
  4: { bg: "#FCE4EC", text: "#880E4F" },
  5: { bg: "#F3E5F5", text: "#6A1B9A" },
  6: { bg: "#EFEBE9", text: "#4E342E" },
};

function HskBadge({ level }) {
  const c = HSK_COLORS[level] || { bg: "#F5F5F5", text: "#555" };
  return (
    <span
      style={{ background: c.bg, color: c.text }}
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
    >
      HSK {level}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, delta, positive }) {
  return (
    <div className="bg-white border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: BORDER }}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: RED_LIGHT }}>
          <Icon size={20} style={{ color: RED_MID }} />
        </div>
        {delta !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${positive ? "text-green-600" : "text-red-500"}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold tracking-wider uppercase" style={{ color: RED }}>
          {label}
        </p>
        <p className="text-3xl font-black text-[#1A1A2E] mt-0.5">
          {value?.toLocaleString() ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" style={{ borderTop: `4px solid ${RED_MID}` }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className="font-bold text-lg text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Form field ───────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-red-300 transition";

// ─── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ crumbs }) {
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

// ─── Action icon button ────────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, color = "#555", onClick, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
      style={{ color }}
    >
      <Icon size={15} />
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION: Dashboard Overview
// ════════════════════════════════════════════════════════════════════════════════
function DashboardSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Breadcrumb crumbs={["HanMemo", "Admin Dashboard"]} />
      <h1 className="text-2xl font-black text-[#1A1A2E] mb-1">System Overview</h1>
      <p className="text-sm text-[#9B9BB4] mb-8">
        Real-time performance metrics and content distribution across the ecosystem.
      </p>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={BookCopy} label="Total Decks" value={stats?.totalDecks} delta="+12%" positive />
        <StatCard icon={BookOpen} label="Total Lessons" value={stats?.totalLessons} delta="+5.4%" positive />
        <StatCard icon={Languages} label="Vocabulary" value={stats?.totalVocabulary} delta="+22.1%" positive />
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} delta="-8%" positive={false} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION: Decks Management
// ════════════════════════════════════════════════════════════════════════════════
function DecksSection() {
  const [decks, setDecks] = useState([]);
  const [modal, setModal] = useState(null); // null | {mode:'add'|'edit', deck?}
  const [form, setForm] = useState({ title: "", hsk_level: 1, description: "" });

  const load = useCallback(() => {
    API.get("/admin/decks").then((r) => setDecks(r.data.decks || [])).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ title: "", hsk_level: 1, description: "" }); setModal({ mode: "add" }); };
  const openEdit = (deck) => { setForm({ title: deck.title, hsk_level: deck.hsk_level, description: deck.description || "" }); setModal({ mode: "edit", deck }); };

  const handleSave = async () => {
    try {
      if (modal.mode === "add") {
        await API.post("/admin/decks", form);
      } else {
        await API.patch(`/admin/decks/${modal.deck.id}`, form);
      }
      setModal(null);
      load();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this deck and all its content?")) return;
    try { await API.delete(`/admin/decks/${id}`); load(); } catch (e) { console.error(e); }
  };

  const hskColors = (lvl) => {
    const m = { 1: "text-green-700 bg-green-100", 2: "text-blue-700 bg-blue-100", 3: "text-yellow-700 bg-yellow-100", 4: "text-pink-700 bg-pink-100" };
    return m[lvl] || "text-gray-700 bg-gray-100";
  };

  return (
    <div>
      <Breadcrumb crumbs={["Decks", "Management"]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Decks Management</h1>
          <p className="text-sm text-[#9B9BB4]">Curate and manage HSK-aligned study sets for students.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm hover:brightness-90 transition-all"
          style={{ background: RED_MID }}
        >
          <Plus size={16} /> Add New Deck
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-[11px] font-bold uppercase tracking-wider text-[#9B9BB4]" style={{ borderColor: BORDER }}>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-4 py-4 text-left">HSK Level</th>
              <th className="px-4 py-4 text-left">Lessons</th>
              <th className="px-4 py-4 text-left">Words</th>
              <th className="px-4 py-4 text-left">Created Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {decks.map((deck) => (
              <tr key={deck.id} className="border-b hover:bg-[#FAFAFA] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-6 py-4 font-semibold text-[#1A1A2E] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: RED_LIGHT }}>
                    <BookCopy size={14} style={{ color: RED_MID }} />
                  </div>
                  {deck.title}
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${hskColors(deck.hsk_level)}`}>
                    HSK LEVEL {deck.hsk_level}
                  </span>
                </td>
                <td className="px-4 py-4 text-[#4A4A6A]">{deck.lessonCount} Lessons</td>
                <td className="px-4 py-4 font-semibold" style={{ color: RED_MID }}>{deck.wordCount?.toLocaleString()} Words</td>
                <td className="px-4 py-4 text-[#9B9BB4]">
                  {deck.created_at ? new Date(deck.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={BookOpen} title="View lessons" />
                    <ActionBtn icon={Pencil} color={RED_MID} title="Edit deck" onClick={() => openEdit(deck)} />
                    <ActionBtn icon={Trash2} color="#DC2626" title="Delete deck" onClick={() => handleDelete(deck.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {decks.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-[#9B9BB4]">No decks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Deck" : "Edit Deck"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Title">
              <input className={inputCls} style={{ borderColor: BORDER }} value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Elementary Mandarin Basics" />
            </Field>
            <Field label="HSK Level">
              <select className={inputCls} style={{ borderColor: BORDER }} value={form.hsk_level}
                onChange={e => setForm(f => ({ ...f, hsk_level: parseInt(e.target.value) }))}>
                {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>HSK {l}</option>)}
              </select>
            </Field>
            <Field label="Description">
              <textarea className={inputCls} style={{ borderColor: BORDER }} rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description…" />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2 rounded-xl border text-sm font-semibold text-[#4A4A6A] hover:bg-gray-50 transition-colors"
                style={{ borderColor: BORDER }}>
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 py-2 rounded-xl text-white text-sm font-bold hover:brightness-90 transition-all"
                style={{ background: RED_MID }}>
                {modal.mode === "add" ? "Create Deck" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION: Lessons Management
// ════════════════════════════════════════════════════════════════════════════════
function LessonsSection() {
  const [lessons, setLessons] = useState([]);
  const [decks, setDecks] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ deck_id: "", title: "", lesson_number: 1 });

  const load = useCallback(() => {
    Promise.all([
      API.get("/admin/lessons"),
      API.get("/admin/decks"),
    ]).then(([lRes, dRes]) => {
      setLessons(lRes.data.lessons || []);
      setDecks(dRes.data.decks || []);
    }).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ deck_id: decks[0]?.id || "", title: "", lesson_number: 1 }); setModal({ mode: "add" }); };
  const openEdit = (l) => { setForm({ deck_id: l.deck_id, title: l.title, lesson_number: l.lesson_number }); setModal({ mode: "edit", lesson: l }); };

  const handleSave = async () => {
    try {
      if (modal.mode === "add") await API.post("/admin/lessons", form);
      else await API.patch(`/admin/lessons/${modal.lesson.id}`, form);
      setModal(null); load();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this lesson and all its vocabulary?")) return;
    try { await API.delete(`/admin/lessons/${id}`); load(); } catch (e) { console.error(e); }
  };

  return (
    <div>
      <Breadcrumb crumbs={["Lessons", "Management"]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Lessons Management</h1>
          <p className="text-sm text-[#9B9BB4]">Organise and schedule lessons within each deck.</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm hover:brightness-90 transition-all"
          style={{ background: RED_MID }}>
          <Plus size={16} /> Add New Lesson
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-[11px] font-bold uppercase tracking-wider text-[#9B9BB4]" style={{ borderColor: BORDER }}>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-4 py-4 text-left">Title</th>
              <th className="px-4 py-4 text-left">Deck</th>
              <th className="px-4 py-4 text-left">HSK</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id} className="border-b hover:bg-[#FAFAFA] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-6 py-4 font-mono text-[#9B9BB4] text-xs">L{String(l.lesson_number).padStart(2, "0")}</td>
                <td className="px-4 py-4 font-semibold text-[#1A1A2E]">{l.title}</td>
                <td className="px-4 py-4 text-[#4A4A6A]">{l.Deck?.title || "—"}</td>
                <td className="px-4 py-4"><HskBadge level={l.Deck?.hsk_level} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={Pencil} color={RED_MID} title="Edit" onClick={() => openEdit(l)} />
                    <ActionBtn icon={Trash2} color="#DC2626" title="Delete" onClick={() => handleDelete(l.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {lessons.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-[#9B9BB4]">No lessons found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Lesson" : "Edit Lesson"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Deck">
              <select className={inputCls} style={{ borderColor: BORDER }} value={form.deck_id}
                onChange={e => setForm(f => ({ ...f, deck_id: e.target.value }))}>
                {decks.map(d => <option key={d.id} value={d.id}>{d.title} (HSK {d.hsk_level})</option>)}
              </select>
            </Field>
            <Field label="Lesson Number">
              <input type="number" className={inputCls} style={{ borderColor: BORDER }} value={form.lesson_number}
                onChange={e => setForm(f => ({ ...f, lesson_number: parseInt(e.target.value) }))} min={1} />
            </Field>
            <Field label="Title">
              <input className={inputCls} style={{ borderColor: BORDER }} value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Greetings" />
            </Field>
            <Field label="Description">
              <textarea className={inputCls} style={{ borderColor: BORDER }} rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description…" />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2 rounded-xl border text-sm font-semibold text-[#4A4A6A] hover:bg-gray-50 transition-colors"
                style={{ borderColor: BORDER }}>Cancel</button>
              <button onClick={handleSave}
                className="flex-1 py-2 rounded-xl text-white text-sm font-bold hover:brightness-90 transition-all"
                style={{ background: RED_MID }}>
                {modal.mode === "add" ? "Create Lesson" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION: Vocabulary Management
// ════════════════════════════════════════════════════════════════════════════════
function VocabularySection() {
  const [vocab, setVocab] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hskFilter, setHskFilter] = useState("");
  const [modal, setModal] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ lesson_id: "", hanzi: "", pinyin: "", definition_en: "", definition_km: "", hsk_level: 1 });
  const LIMIT = 10;

  const load = useCallback(() => {
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (search) params.set("search", search);
    if (hskFilter) params.set("hsk", hskFilter);
    API.get(`/admin/vocabulary?${params}`).then(r => {
      setVocab(r.data.vocabulary || []);
      setTotal(r.data.total || 0);
    }).catch(() => {});
  }, [page, search, hskFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    API.get("/admin/lessons").then(r => setLessons(r.data.lessons || [])).catch(() => {});
  }, []);

  const openAdd = () => {
    setForm({ lesson_id: lessons[0]?.id || "", hanzi: "", pinyin: "", definition_en: "", definition_km: "", hsk_level: 1 });
    setModal({ mode: "add" });
  };
  const openEdit = (v) => {
    setForm({ lesson_id: v.lesson_id, hanzi: v.hanzi, pinyin: v.pinyin, definition_en: v.definition_en || "", definition_km: v.definition_km || "", hsk_level: v.hsk_level || 1 });
    setModal({ mode: "edit", vocab: v });
  };

  const handleSave = async () => {
    try {
      if (modal.mode === "add") await API.post("/admin/vocabulary", form);
      else await API.patch(`/admin/vocabulary/${modal.vocab.id}`, form);
      setModal(null); load();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this vocabulary word?")) return;
    try { await API.delete(`/admin/vocabulary/${id}`); load(); } catch (e) { console.error(e); }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <Breadcrumb crumbs={["Vocabulary", "List"]} />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Vocabulary List
            <span className="ml-2 text-sm font-semibold text-white px-2 py-0.5 rounded-full align-middle" style={{ background: RED_MID }}>
              {total.toLocaleString()} Items
            </span>
          </h1>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm hover:brightness-90 transition-all"
          style={{ background: RED_MID }}>
          <Plus size={16} /> Add Vocabulary
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BB4]" />
          <input
            className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200 transition"
            style={{ borderColor: BORDER }}
            placeholder="Search Hanzi, Pinyin or Definitions..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200 transition text-[#4A4A6A]"
          style={{ borderColor: BORDER }}
          value={hskFilter}
          onChange={e => { setHskFilter(e.target.value); setPage(1); }}
        >
          <option value="">All HSK</option>
          {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>HSK {l}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-[11px] font-bold uppercase tracking-wider text-[#9B9BB4]" style={{ borderColor: BORDER }}>
              <th className="px-6 py-4 text-left">Hanzi</th>
              <th className="px-4 py-4 text-left">Pinyin</th>
              <th className="px-4 py-4 text-left">Definition (EN)</th>
              <th className="px-4 py-4 text-left">Definition (KM)</th>
              <th className="px-4 py-4 text-left">HSK</th>
              <th className="px-4 py-4 text-left">Lesson</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vocab.map(v => (
              <tr key={v.id} className="border-b hover:bg-[#FAFAFA] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-6 py-3 text-xl font-bold" style={{ color: RED_MID }}>{v.hanzi}</td>
                <td className="px-4 py-3 italic text-[#4A4A6A]">{v.pinyin}</td>
                <td className="px-4 py-3 text-[#1A1A2E]">{v.definition_en}</td>
                <td className="px-4 py-3 text-[#4A4A6A]">{v.definition_km || "—"}</td>
                <td className="px-4 py-3"><HskBadge level={v.hsk_level} /></td>
                <td className="px-4 py-3 text-[#9B9BB4] text-xs">
                  {v.Lesson ? `L${String(v.Lesson.lesson_number).padStart(2, "0")}: ${v.Lesson.title}` : "—"}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={Pencil} color={RED_MID} title="Edit" onClick={() => openEdit(v)} />
                    <ActionBtn icon={Trash2} color="#DC2626" title="Delete" onClick={() => handleDelete(v.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {vocab.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-[#9B9BB4]">No vocabulary found.</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-[#9B9BB4]" style={{ borderColor: BORDER }}>
          <span>Showing {Math.min((page - 1) * LIMIT + 1, total)} to {Math.min(page * LIMIT, total)} of {total.toLocaleString()} entries</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-colors">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${page === p ? "text-white" : "hover:bg-gray-100 text-[#4A4A6A]"}`}
                  style={page === p ? { background: RED_MID } : {}}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Vocabulary" : "Edit Vocabulary"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hanzi">
                <input className={inputCls} style={{ borderColor: BORDER }} value={form.hanzi}
                  onChange={e => setForm(f => ({ ...f, hanzi: e.target.value }))} placeholder="你好" />
              </Field>
              <Field label="Pinyin">
                <input className={inputCls} style={{ borderColor: BORDER }} value={form.pinyin}
                  onChange={e => setForm(f => ({ ...f, pinyin: e.target.value }))} placeholder="nǐ hǎo" />
              </Field>
            </div>
            <Field label="Definition (English)">
              <input className={inputCls} style={{ borderColor: BORDER }} value={form.definition_en}
                onChange={e => setForm(f => ({ ...f, definition_en: e.target.value }))} placeholder="Hello" />
            </Field>
            <Field label="Definition (Khmer)">
              <input className={inputCls} style={{ borderColor: BORDER }} value={form.definition_km}
                onChange={e => setForm(f => ({ ...f, definition_km: e.target.value }))} placeholder="ជំរាបសួរ" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="HSK Level">
                <select className={inputCls} style={{ borderColor: BORDER }} value={form.hsk_level}
                  onChange={e => setForm(f => ({ ...f, hsk_level: parseInt(e.target.value) }))}>
                  {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>HSK {l}</option>)}
                </select>
              </Field>
              <Field label="Lesson">
                <select className={inputCls} style={{ borderColor: BORDER }} value={form.lesson_id}
                  onChange={e => setForm(f => ({ ...f, lesson_id: e.target.value }))}>
                  {lessons.map(l => <option key={l.id} value={l.id}>L{l.lesson_number}: {l.title}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2 rounded-xl border text-sm font-semibold text-[#4A4A6A] hover:bg-gray-50 transition-colors"
                style={{ borderColor: BORDER }}>Cancel</button>
              <button onClick={handleSave}
                className="flex-1 py-2 rounded-xl text-white text-sm font-bold hover:brightness-90 transition-all"
                style={{ background: RED_MID }}>
                {modal.mode === "add" ? "Add Word" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION: Users Management
// ════════════════════════════════════════════════════════════════════════════════
function UsersSection() {
  const [users, setUsers] = useState([]);

  const load = useCallback(() => {
    API.get("/admin/users").then(r => setUsers(r.data.users || [])).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try { await API.delete(`/admin/users/${id}`); load(); } catch (e) { console.error(e); }
  };

  const roleBadge = (role) => {
    const isAdmin = role === "admin";
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
        {role}
      </span>
    );
  };

  return (
    <div>
      <Breadcrumb crumbs={["Users", "Management"]} />
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1A1A2E]">User Management</h1>
        <p className="text-sm text-[#9B9BB4]">View and manage all registered learners and administrators.</p>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-[11px] font-bold uppercase tracking-wider text-[#9B9BB4]" style={{ borderColor: BORDER }}>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-4 py-4 text-left">Email</th>
              <th className="px-4 py-4 text-left">Role</th>
              <th className="px-4 py-4 text-left">HSK Level</th>
              <th className="px-4 py-4 text-left">Streak</th>
              <th className="px-4 py-4 text-left">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-[#FAFAFA] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: RED_MID }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-[#1A1A2E]">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[#4A4A6A]">{u.email}</td>
                <td className="px-4 py-4">{roleBadge(u.role)}</td>
                <td className="px-4 py-4"><HskBadge level={u.hsk_level} /></td>
                <td className="px-4 py-4 font-semibold text-[#1A1A2E]">🔥 {u.streak}</td>
                <td className="px-4 py-4 text-[#9B9BB4] text-xs">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={Trash2} color="#DC2626" title="Delete user" onClick={() => handleDelete(u.id, u.name)} />
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-[#9B9BB4]">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN: AdminDashboard (Sidebar Shell)
// ════════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "decks", label: "Decks", icon: BookCopy },
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "vocabulary", label: "Vocabulary", icon: Languages },
  { id: "users", label: "Users", icon: Users },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const SECTION_MAP = {
    dashboard: <DashboardSection />,
    decks: <DecksSection />,
    lessons: <LessonsSection />,
    vocabulary: <VocabularySection />,
    users: <UsersSection />,
  };

  return (
    <div className="min-h-screen flex bg-[#FDF5F5]">
      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside
        className="w-44 flex flex-col shrink-0 border-r"
        style={{ background: SIDEBAR_BG, borderColor: BORDER }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="font-black text-xl leading-none" style={{ color: RED_MID }}>
            Han<span className="text-[#1A1A2E]">Memo</span>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-[#9B9BB4] uppercase mt-0.5">
            Admin Console
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mx-4 mb-3" style={{ background: BORDER }} />

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full
                  ${isActive ? "text-white shadow-sm" : "text-[#4A4A6A] hover:bg-red-50 hover:text-[#C0392B]"}`}
                style={isActive ? { background: RED_MID } : {}}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom: admin profile + logout */}
        <div className="px-3 pb-5 flex flex-col gap-0.5">
          <div className="h-px mb-3" style={{ background: BORDER }} />
          <button
            onClick={() => {}}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#4A4A6A] hover:bg-red-50 hover:text-[#C0392B] transition-all text-left w-full"
          >
            <UserCircle size={16} />
            <div className="flex flex-col leading-tight">
              <span>Admin Profile</span>
              <span className="text-[10px] font-normal text-[#9B9BB4]">{user?.name || "Admin"}</span>
            </div>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#4A4A6A] hover:bg-red-50 hover:text-[#C0392B] transition-all text-left w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b bg-white flex items-center justify-end px-6 gap-4 shrink-0"
          style={{ borderColor: BORDER }}>
          <button className="text-[#9B9BB4] hover:text-[#4A4A6A] transition-colors"><Bell size={18} /></button>
          <button className="text-[#9B9BB4] hover:text-[#4A4A6A] transition-colors"><HelpCircle size={18} /></button>
          {active === "vocabulary" && (
            <button
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-white text-sm font-bold hover:brightness-90 transition-all ml-2"
              style={{ background: RED_MID }}
            >
              <Plus size={14} /> Add New Word
            </button>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {SECTION_MAP[active]}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
