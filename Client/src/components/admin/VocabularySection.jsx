import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import { ArrowLeft, Plus, Search, ChevronLeft, ChevronRight, MessageSquareText, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Breadcrumb,
  HskBadge,
  Spinner,
  Empty,
  ActionBtn,
  Modal,
  Field,
  btnPrimary,
  btnSecondary,
  inputCls,
  RED,
  RED_MID,
  BORDER,
} from "./SharedAdminUI";

export default function VocabularySection({ lessonFilter, onBack }) {
  const [vocab, setVocab]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [hsk, setHsk]       = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [saving, setSaving] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const LIMIT = 10;

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

  const openAdd  = () => { setModal({ mode: "add" }); };
  const openEdit = (v) => {
    setModal({ mode: "edit", vocab: v,
      form: { lesson_id: v.lesson_id, hanzi: v.hanzi, pinyin: v.pinyin,
               definition_en: v.definition_en || "", definition_km: v.definition_km || "",
               example_cn: v.example_cn || "", example_pinyin: v.example_pinyin || "",
               example_en: v.example_en || "", example_km: v.example_km || "",
               hsk_level: v.hsk_level || 1 } });
  };

  const [addForm, setAddForm] = useState({
    lesson_id: "", hanzi: "", pinyin: "", definition_en: "", definition_km: "",
    example_cn: "", example_pinyin: "", example_en: "", example_km: "", hsk_level: 1,
  });

  useEffect(() => {
    if (modal?.mode === "add") {
      setAddForm({ lesson_id: lessonFilter?.id || allLessons[0]?.id || "",
        hanzi: "", pinyin: "", definition_en: "", definition_km: "",
        example_cn: "", example_pinyin: "", example_en: "", example_km: "",
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
            ) : vocab.map(v => {
              const isExpanded = expandedRow === v.id;
              const hasExample = v.example_cn || v.example_en || v.example_km;
              return (
                <React.Fragment key={v.id}>
                  <tr className="border-b hover:bg-[#FFF8F8] transition-colors" style={{ borderColor: BORDER }}>
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
                        {hasExample && (
                          <button
                            title={isExpanded ? "Hide examples" : "View examples"}
                            onClick={() => setExpandedRow(isExpanded ? null : v.id)}
                            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                            style={{ color: isExpanded ? RED_MID : "#9B9BB4" }}
                          >
                            <MessageSquareText size={15} />
                          </button>
                        )}
                        <ActionBtn icon={Pencil}  color={RED_MID} title="Edit"   onClick={() => openEdit(v)} />
                        <ActionBtn icon={Trash2}  color="#DC2626" title="Delete" onClick={() => handleDelete(v)} />
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ borderColor: BORDER }}>
                      <td colSpan={7} className="px-6 py-4 border-b" style={{ background: "#FFF8F8", borderColor: BORDER }}>
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquareText size={14} style={{ color: RED_MID }} />
                          <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: RED }}>Example Sentence</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {v.example_cn && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-lg font-semibold" style={{ color: RED_MID }}>{v.example_cn}</span>
                              {v.example_pinyin && <span className="text-xs italic text-[#6B6B8A]">{v.example_pinyin}</span>}
                            </div>
                          )}
                          <div className="flex flex-col gap-1 mt-1">
                            {v.example_en && (
                              <div className="flex items-start gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded shrink-0">EN</span>
                                <span className="text-sm text-[#1A1A2E]">{v.example_en}</span>
                              </div>
                            )}
                            {v.example_km && (
                              <div className="flex items-start gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 px-1.5 py-0.5 rounded shrink-0">KM</span>
                                <span className="text-sm text-[#4A4A6A]">{v.example_km}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
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

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Vocabulary Word" : `Edit — ${modal.vocab?.hanzi}`} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-3" style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "4px" }}>
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

            <div className="pt-1">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: BORDER }}>
                <MessageSquareText size={13} style={{ color: RED_MID }} />
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: RED }}>Example Sentence</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Chinese (Hanzi)">
                    <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.example_cn}
                      onChange={e => setActiveForm(f => ({ ...f, example_cn: e.target.value }))} placeholder="我喜欢学中文。" />
                  </Field>
                  <Field label="Pinyin">
                    <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.example_pinyin}
                      onChange={e => setActiveForm(f => ({ ...f, example_pinyin: e.target.value }))} placeholder="Wǒ xǐhuān xué zhōngwén." />
                  </Field>
                </div>
                <Field label="Translation (English)">
                  <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.example_en}
                    onChange={e => setActiveForm(f => ({ ...f, example_en: e.target.value }))} placeholder="I like studying Chinese." />
                </Field>
                <Field label="Translation (Khmer)">
                  <input className={inputCls} style={{ borderColor: BORDER }} value={activeForm.example_km}
                    onChange={e => setActiveForm(f => ({ ...f, example_km: e.target.value }))} placeholder="ខ្ញុំចូលចិត្តរៀនភាសាចិន。" />
                </Field>
              </div>
            </div>

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
