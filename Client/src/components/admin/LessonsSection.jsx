import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import { ArrowLeft, Plus, Languages, Pencil, Trash2, Loader2 } from "lucide-react";
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
  RED_MID,
  BORDER,
} from "./SharedAdminUI";

export default function LessonsSection({ deckFilter, onBack, onDrillVocab }) {
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
