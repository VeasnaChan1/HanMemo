/**
 * AdminDashboard.jsx
 * Full admin console — all data fetched through adminApi service layer.
 * Data hierarchy: Deck (HSK 1-4) → Lessons (many) → Vocabulary (many words)
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../api/adminApi";
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
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const RED     = "#C0392B";
const RED_LT  = "#FFF0EF";
const RED_MID = "#E8453C";
const SB_BG   = "#FFF8F8";
const BORDER  = "#F0D8D8";

// ─── HSK level colours ────────────────────────────────────────────────────────
const HSK_CLR = {
  1: { bg: "#E8F5E9", text: "#2E7D32" },
  2: { bg: "#E3F2FD", text: "#1565C0" },
  3: { bg: "#FFF8E1", text: "#F57F17" },
  4: { bg: "#FCE4EC", text: "#880E4F" },
  5: { bg: "#F3E5F5", text: "#6A1B9A" },
  6: { bg: "#EFEBE9", text: "#4E342E" },
};

// ─── Small shared components ──────────────────────────────────────────────────
function HskBadge({ level }) {
  const c = HSK_CLR[level] || { bg: "#F5F5F5", text: "#555" };
  return (
    <span style={{ background: c.bg, color: c.text }}
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
      HSK {level}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={28} className="animate-spin" style={{ color: RED_MID }} />
    </div>
  );
}

function Empty({ text = "No data found." }) {
  return (
    <tr><td colSpan={99} className="px-6 py-14 text-center text-[#9B9BB4] text-sm">{text}</td></tr>
  );
}

function ActionBtn({ icon: Icon, color = "#555", onClick, title }) {
  return (
    <button title={title} onClick={onClick}
      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" style={{ color }}>
      <Icon size={15} />
    </button>
  );
}

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

function Modal({ title, onClose, children }) {
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

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-red-300 transition";
const btnPrimary = "px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm hover:brightness-90 transition-all flex items-center gap-2";
const btnSecondary = "px-4 py-2 rounded-xl border text-sm font-semibold text-[#4A4A6A] hover:bg-gray-50 transition-colors";

// ════════════════════════════════════════════════════════════════════════════════
// DASHBOARD OVERVIEW
// ════════════════════════════════════════════════════════════════════════════════
function DashboardSection() {
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

// ════════════════════════════════════════════════════════════════════════════════
// DECKS  (click → DrillDown: Lessons for that deck)
// ════════════════════════════════════════════════════════════════════════════════
function DecksSection({ onDrillLesson }) {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", hsk_level: 1, description: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setDecks(await adminApi.getDecks()); }
    catch { /* noop */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ title: "", hsk_level: 1, description: "" }); setModal({ mode: "add" }); };
  const openEdit = (d) => { setForm({ title: d.title, hsk_level: d.hsk_level, description: d.description || "" }); setModal({ mode: "edit", deck: d }); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal.mode === "add") await adminApi.createDeck(form);
      else await adminApi.updateDeck(modal.deck.id, form);
      setModal(null); load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (d) => {
    if (!confirm(`Delete deck "${d.title}" and ALL its lessons and vocabulary?`)) return;
    try { await adminApi.deleteDeck(d.id); load(); }
    catch (e) { console.error(e); }
  };

  const hskRowBg = (lvl) => {
    const map = { 1: "#E8F5E9", 2: "#E3F2FD", 3: "#FFF8E1", 4: "#FCE4EC" };
    return map[lvl] || "#F5F5F5";
  };
  const hskRowText = (lvl) => {
    const map = { 1: "#2E7D32", 2: "#1565C0", 3: "#F57F17", 4: "#880E4F" };
    return map[lvl] || "#555";
  };

  return (
    <div>
      <Breadcrumb crumbs={["Decks", "Management"]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Decks Management</h1>
          <p className="text-sm text-[#9B9BB4]">Curate and manage HSK-aligned study sets. Click a deck to browse its lessons.</p>
        </div>
        <button onClick={openAdd} style={{ background: RED_MID }} className={btnPrimary}>
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
              <th className="px-4 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center"><Loader2 size={24} className="animate-spin mx-auto" style={{ color: RED_MID }} /></td></tr>
            ) : decks.length === 0 ? (
              <Empty text="No decks found. Add your first deck above." />
            ) : decks.map((d) => (
              <tr key={d.id} className="border-b hover:bg-[#FFF8F8] transition-colors cursor-pointer"
                style={{ borderColor: BORDER }}
                onClick={() => onDrillLesson(d)}>
                <td className="px-6 py-4 font-semibold text-[#1A1A2E]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: hskRowBg(d.hsk_level) }}>
                      <BookCopy size={14} style={{ color: hskRowText(d.hsk_level) }} />
                    </div>
                    {d.title}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: hskRowBg(d.hsk_level), color: hskRowText(d.hsk_level) }}>
                    HSK LEVEL {d.hsk_level}
                  </span>
                </td>
                <td className="px-4 py-4 text-[#4A4A6A]">{d.lessonCount ?? "—"} Lessons</td>
                <td className="px-4 py-4 font-semibold" style={{ color: RED_MID }}>
                  {d.wordCount?.toLocaleString() ?? "—"} Words
                </td>
                <td className="px-4 py-4 text-[#9B9BB4]">
                  {d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}
                </td>
                <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={BookOpen} title="View lessons" onClick={() => onDrillLesson(d)} />
                    <ActionBtn icon={Pencil}  color={RED_MID} title="Edit deck"   onClick={() => openEdit(d)} />
                    <ActionBtn icon={Trash2}  color="#DC2626" title="Delete deck" onClick={() => handleDelete(d)} />
                  </div>
                </td>
              </tr>
            ))}
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
              <button onClick={() => setModal(null)} className={btnSecondary} style={{ borderColor: BORDER }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: RED_MID }}
                className="flex-1 py-2 rounded-xl text-white text-sm font-bold hover:brightness-90 transition-all disabled:opacity-60">
                {saving ? "Saving…" : modal.mode === "add" ? "Create Deck" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// LESSONS  — shown when a Deck is selected; click → DrillDown: Vocabulary
// ════════════════════════════════════════════════════════════════════════════════
function LessonsSection({ deckFilter, onBack, onDrillVocab }) {
  const [lessons, setLessons] = useState([]);
  const [allDecks, setAllDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ deck_id: deckFilter?.id || "", title: "", lesson_number: 1 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ls, ds] = await Promise.all([
        adminApi.getLessons(deckFilter?.id),
        adminApi.getDecks(),
      ]);
      setLessons(ls);
      setAllDecks(ds);
    } catch { /* noop */ }
    finally { setLoading(false); }
  }, [deckFilter]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ deck_id: deckFilter?.id || allDecks[0]?.id || "", title: "", lesson_number: (lessons.length + 1) }); setModal({ mode: "add" }); };
  const openEdit = (l) => { setForm({ deck_id: l.deck_id, title: l.title, lesson_number: l.lesson_number }); setModal({ mode: "edit", lesson: l }); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal.mode === "add") await adminApi.createLesson(form);
      else await adminApi.updateLesson(modal.lesson.id, form);
      setModal(null); load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (l) => {
    if (!confirm(`Delete lesson "${l.title}" and ALL its vocabulary?`)) return;
    try { await adminApi.deleteLesson(l.id); load(); }
    catch (e) { console.error(e); }
  };

  const deck = deckFilter;

  return (
    <div>
      <Breadcrumb crumbs={["Decks", deck ? deck.title : "All Lessons", "Lessons"]} />

      {/* Back button + heading */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors text-[#4A4A6A]"
              style={{ borderColor: BORDER }}>
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#1A1A2E]">Lessons Management</h1>
              {deck && <HskBadge level={deck.hsk_level} />}
            </div>
            <p className="text-sm text-[#9B9BB4]">
              {deck ? `${deck.title} — click a lesson to manage its vocabulary.` : "All lessons across every deck."}
            </p>
          </div>
        </div>
        <button onClick={openAdd} style={{ background: RED_MID }} className={btnPrimary}>
          <Plus size={16} /> Add New Lesson
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-[11px] font-bold uppercase tracking-wider text-[#9B9BB4]" style={{ borderColor: BORDER }}>
              <th className="px-6 py-4 text-left w-16">#</th>
              <th className="px-4 py-4 text-left">Title</th>
              {!deck && <th className="px-4 py-4 text-left">Deck</th>}
              {!deck && <th className="px-4 py-4 text-left">HSK</th>}
              <th className="px-4 py-4 text-left">Words</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center"><Loader2 size={24} className="animate-spin mx-auto" style={{ color: RED_MID }} /></td></tr>
            ) : lessons.length === 0 ? (
              <Empty text="No lessons in this deck yet. Add the first one!" />
            ) : lessons.map((l) => (
              <tr key={l.id} className="border-b hover:bg-[#FFF8F8] transition-colors cursor-pointer"
                style={{ borderColor: BORDER }}
                onClick={() => onDrillVocab && onDrillVocab(l)}>
                <td className="px-6 py-4 font-mono text-[#9B9BB4] text-xs font-bold">
                  L{String(l.lesson_number).padStart(2, "0")}
                </td>
                <td className="px-4 py-4 font-semibold text-[#1A1A2E]">{l.title}</td>
                {!deck && <td className="px-4 py-4 text-[#4A4A6A] text-xs">{l.Deck?.title || "—"}</td>}
                {!deck && <td className="px-4 py-4"><HskBadge level={l.Deck?.hsk_level} /></td>}
                <td className="px-4 py-4 font-semibold" style={{ color: RED_MID }}>
                  {(l.wordCount ?? l.Vocabularies?.length ?? 0).toLocaleString()} words
                </td>
                <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={Languages} title="View vocabulary" onClick={() => onDrillVocab && onDrillVocab(l)} />
                    <ActionBtn icon={Pencil}  color={RED_MID} title="Edit lesson"   onClick={() => openEdit(l)} />
                    <ActionBtn icon={Trash2}  color="#DC2626" title="Delete lesson" onClick={() => handleDelete(l)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Lesson" : "Edit Lesson"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Deck">
              <select className={inputCls} style={{ borderColor: BORDER }} value={form.deck_id}
                onChange={e => setForm(f => ({ ...f, deck_id: e.target.value }))}>
                {allDecks.map(d => <option key={d.id} value={d.id}>{d.title} — HSK {d.hsk_level}</option>)}
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
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className={btnSecondary} style={{ borderColor: BORDER }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: RED_MID }}
                className="flex-1 py-2 rounded-xl text-white text-sm font-bold hover:brightness-90 disabled:opacity-60 transition-all">
                {saving ? "Saving…" : modal.mode === "add" ? "Create Lesson" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// VOCABULARY  — shown globally or drilled down from a Lesson
// ════════════════════════════════════════════════════════════════════════════════
function VocabularySection({ lessonFilter, onBack }) {
  const [vocab, setVocab]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [hsk, setHsk]       = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [saving, setSaving] = useState(false);
  const LIMIT = 10;

  const blankForm = () => ({
    lesson_id: lessonFilter?.id || allLessons[0]?.id || "",
    hanzi: "", pinyin: "", definition_en: "", definition_km: "", hsk_level: lessonFilter?.Deck?.hsk_level || 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getVocabulary({
        page, limit: LIMIT,
        hsk, search,
        lessonId: lessonFilter?.id || "",
      });
      setVocab(result.vocabulary);
      setTotal(result.total);
    } catch { /* noop */ }
    finally { setLoading(false); }
  }, [page, hsk, search, lessonFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    adminApi.getLessons().then(setAllLessons).catch(() => {});
  }, []);

  const openAdd  = () => { setModal({ mode: "add" });   /* form set after allLessons loaded */ };
  const openEdit = (v) => {
    setModal({ mode: "edit", vocab: v,
      form: { lesson_id: v.lesson_id, hanzi: v.hanzi, pinyin: v.pinyin,
               definition_en: v.definition_en || "", definition_km: v.definition_km || "",
               hsk_level: v.hsk_level || 1 } });
  };

  const [addForm, setAddForm] = useState({
    lesson_id: "", hanzi: "", pinyin: "", definition_en: "", definition_km: "", hsk_level: 1,
  });

  // Sync lesson when modal opens for add
  useEffect(() => {
    if (modal?.mode === "add") {
      setAddForm({ lesson_id: lessonFilter?.id || allLessons[0]?.id || "",
        hanzi: "", pinyin: "", definition_en: "", definition_km: "",
        hsk_level: lessonFilter?.Deck?.hsk_level || 1 });
    }
  }, [modal?.mode, lessonFilter, allLessons]);

  const handleSave = async () => {
    setSaving(true);
    const payload = modal.mode === "add" ? addForm : modal.form;
    try {
      if (modal.mode === "add") await adminApi.createVocabulary(payload);
      else await adminApi.updateVocabulary(modal.vocab.id, payload);
      setModal(null); load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (v) => {
    if (!confirm(`Delete "${v.hanzi}" (${v.pinyin})?`)) return;
    try { await adminApi.deleteVocabulary(v.id); load(); }
    catch (e) { console.error(e); }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const activeForm  = modal?.mode === "add" ? addForm : modal?.form || {};
  const setActiveForm = modal?.mode === "add"
    ? (fn) => setAddForm(prev => fn(prev))
    : (fn) => setModal(m => ({ ...m, form: fn(m.form) }));

  return (
    <div>
      <Breadcrumb crumbs={lessonFilter
        ? ["Decks", lessonFilter.Deck?.title || "Deck", `L${String(lessonFilter.lesson_number).padStart(2,"0")} ${lessonFilter.title}`, "Vocabulary"]
        : ["Vocabulary", "List"]} />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors text-[#4A4A6A]"
              style={{ borderColor: BORDER }}>
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-[#1A1A2E]">
                {lessonFilter ? lessonFilter.title : "Vocabulary List"}
              </h1>
              {lessonFilter && <HskBadge level={lessonFilter.Deck?.hsk_level} />}
              <span className="text-sm font-semibold text-white px-2 py-0.5 rounded-full"
                style={{ background: RED_MID }}>
                {total.toLocaleString()} Items
              </span>
            </div>
            {lessonFilter && (
              <p className="text-xs text-[#9B9BB4]">
                Lesson {lessonFilter.lesson_number} · {lessonFilter.Deck?.title}
              </p>
            )}
          </div>
        </div>
        <button onClick={openAdd} style={{ background: RED_MID }} className={btnPrimary}>
          <Plus size={16} /> Add Vocabulary
        </button>
      </div>

      {/* Filters row */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BB4]" />
          <input className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200 transition"
            style={{ borderColor: BORDER }}
            placeholder="Search Hanzi, Pinyin or Definitions..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        {!lessonFilter && (
          <select className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200 transition text-[#4A4A6A]"
            style={{ borderColor: BORDER }} value={hsk}
            onChange={e => { setHsk(e.target.value); setPage(1); }}>
            <option value="">All HSK Levels</option>
            {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>HSK {l}</option>)}
          </select>
        )}
      </div>

      {/* Table */}
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
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center"><Loader2 size={24} className="animate-spin mx-auto" style={{ color: RED_MID }} /></td></tr>
            ) : vocab.length === 0 ? (
              <Empty text="No vocabulary found. Try adjusting your filters or add words above." />
            ) : vocab.map(v => (
              <tr key={v.id} className="border-b hover:bg-[#FFF8F8] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-6 py-3 text-xl font-bold" style={{ color: RED_MID }}>{v.hanzi}</td>
                <td className="px-4 py-3 italic text-[#4A4A6A]">{v.pinyin}</td>
                <td className="px-4 py-3 text-[#1A1A2E]">{v.definition_en}</td>
                <td className="px-4 py-3 text-[#4A4A6A]">{v.definition_km || <span className="text-[#ccc]">—</span>}</td>
                <td className="px-4 py-3"><HskBadge level={v.hsk_level} /></td>
                <td className="px-4 py-3 text-[#9B9BB4] text-xs">
                  {v.Lesson ? `L${String(v.Lesson.lesson_number).padStart(2,"0")}: ${v.Lesson.title}` : "—"}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={Pencil}  color={RED_MID} title="Edit"   onClick={() => openEdit(v)} />
                    <ActionBtn icon={Trash2}  color="#DC2626" title="Delete" onClick={() => handleDelete(v)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && total > LIMIT && (
          <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-[#9B9BB4]" style={{ borderColor: BORDER }}>
            <span>
              Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
                const pg = i + 1;
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    className="w-8 h-8 rounded-md text-xs font-bold transition-all"
                    style={page === pg ? { background: RED_MID, color: "#fff" } : { color: "#4A4A6A" }}>
                    {pg}
                  </button>
                );
              })}
              {totalPages > 6 && <span className="text-[#9B9BB4] px-1">…{totalPages}</span>}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Vocabulary Word" : `Edit — ${modal.vocab?.hanzi}`} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hanzi">
                <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.hanzi}
                  onChange={e => setActiveForm(f => ({ ...f, hanzi: e.target.value }))} placeholder="你好" />
              </Field>
              <Field label="Pinyin">
                <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.pinyin}
                  onChange={e => setActiveForm(f => ({ ...f, pinyin: e.target.value }))} placeholder="nǐ hǎo" />
              </Field>
            </div>
            <Field label="Definition (English)">
              <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.definition_en}
                onChange={e => setActiveForm(f => ({ ...f, definition_en: e.target.value }))} placeholder="Hello" />
            </Field>
            <Field label="Definition (Khmer)">
              <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.definition_km}
                onChange={e => setActiveForm(f => ({ ...f, definition_km: e.target.value }))} placeholder="ជំរាបសួរ" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="HSK Level">
                <select className={inputCls} style={{ borderColor: BORDER }} value={activeForm.hsk_level}
                  onChange={e => setActiveForm(f => ({ ...f, hsk_level: parseInt(e.target.value) }))}>
                  {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>HSK {l}</option>)}
                </select>
              </Field>
              <Field label="Lesson">
                <select className={inputCls} style={{ borderColor: BORDER }} value={activeForm.lesson_id}
                  onChange={e => setActiveForm(f => ({ ...f, lesson_id: e.target.value }))}>
                  {allLessons.map(l => (
                    <option key={l.id} value={l.id}>
                      HSK{l.Deck?.hsk_level} · L{String(l.lesson_number).padStart(2,"0")} {l.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className={btnSecondary} style={{ borderColor: BORDER }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: RED_MID }}
                className="flex-1 py-2 rounded-xl text-white text-sm font-bold hover:brightness-90 disabled:opacity-60 transition-all">
                {saving ? "Saving…" : modal.mode === "add" ? "Add Word" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════════════════════════
function UsersSection() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setUsers(await adminApi.getUsers()); }
    catch { /* noop */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (u) => {
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try { await adminApi.deleteUser(u.id); load(); }
    catch (e) { console.error(e); }
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
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center"><Loader2 size={24} className="animate-spin mx-auto" style={{ color: RED_MID }} /></td></tr>
            ) : users.length === 0 ? (
              <Empty text="No users found." />
            ) : users.map(u => (
              <tr key={u.id} className="border-b hover:bg-[#FFF8F8] transition-colors" style={{ borderColor: BORDER }}>
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
                <td className="px-4 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-4"><HskBadge level={u.hsk_level} /></td>
                <td className="px-4 py-4 font-semibold text-[#1A1A2E]">🔥 {u.streak}</td>
                <td className="px-4 py-4 text-[#9B9BB4] text-xs">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={Trash2} color="#DC2626" title="Delete user" onClick={() => handleDelete(u)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SHELL — Sidebar + drill-down navigation state machine
// ════════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { id: "decks",      label: "Decks",      icon: BookCopy        },
  { id: "lessons",    label: "Lessons",    icon: BookOpen        },
  { id: "vocabulary", label: "Vocabulary", icon: Languages       },
  { id: "users",      label: "Users",      icon: Users           },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Top-level nav
  const [tab, setTab] = useState("dashboard");

  // Drill-down state: which deck / lesson is selected
  const [selectedDeck,   setSelectedDeck]   = useState(null); // Deck object
  const [selectedLesson, setSelectedLesson] = useState(null); // Lesson object

  // Redirect non-admin
  useEffect(() => {
    if (user && user.role !== "admin") navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // Switching top-level tab resets drill-down
  const switchTab = (id) => {
    setTab(id);
    setSelectedDeck(null);
    setSelectedLesson(null);
  };

  // Drill from Decks → Lessons
  const handleDrillLesson = (deck) => {
    setSelectedDeck(deck);
    setTab("lessons");
    setSelectedLesson(null);
  };

  // Drill from Lessons → Vocabulary
  const handleDrillVocab = (lesson) => {
    setSelectedLesson(lesson);
    setTab("vocabulary");
  };

  // Back from Lessons → Decks
  const handleBackFromLessons = () => {
    setSelectedDeck(null);
    setTab("decks");
  };

  // Back from Vocabulary → Lessons
  const handleBackFromVocab = () => {
    setSelectedLesson(null);
    setTab("lessons");
  };

  // Render the active section
  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <DashboardSection />;
      case "decks":
        return <DecksSection onDrillLesson={handleDrillLesson} />;
      case "lessons":
        return (
          <LessonsSection
            deckFilter={selectedDeck}
            onBack={selectedDeck ? handleBackFromLessons : null}
            onDrillVocab={handleDrillVocab}
          />
        );
      case "vocabulary":
        return (
          <VocabularySection
            lessonFilter={selectedLesson}
            onBack={selectedLesson ? handleBackFromVocab : null}
          />
        );
      case "users":
        return <UsersSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FDF5F5]">
      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside className="w-44 flex flex-col shrink-0 border-r" style={{ background: SB_BG, borderColor: BORDER }}>
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="font-black text-xl leading-none" style={{ color: RED_MID }}>
            Han<span className="text-[#1A1A2E]">Memo</span>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-[#9B9BB4] uppercase mt-0.5">
            Admin Console
          </div>
        </div>
        <div className="h-px mx-4 mb-3" style={{ background: BORDER }} />

        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => switchTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full
                  ${active ? "text-white shadow-sm" : "text-[#4A4A6A] hover:bg-red-50 hover:text-[#C0392B]"}`}
                style={active ? { background: RED_MID } : {}}>
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 flex flex-col gap-0.5">
          <div className="h-px mb-3" style={{ background: BORDER }} />
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#4A4A6A]">
            <UserCircle size={16} />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold">Admin Profile</span>
              <span className="text-[10px] text-[#9B9BB4]">{user?.name || "Admin"}</span>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#4A4A6A] hover:bg-red-50 hover:text-[#C0392B] transition-all text-left w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-white flex items-center justify-end px-6 gap-4 shrink-0" style={{ borderColor: BORDER }}>
          <button className="text-[#9B9BB4] hover:text-[#4A4A6A] transition-colors"><Bell size={18} /></button>
          <button className="text-[#9B9BB4] hover:text-[#4A4A6A] transition-colors"><HelpCircle size={18} /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
