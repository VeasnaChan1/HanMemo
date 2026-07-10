import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import { BookCopy, BookOpen, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Breadcrumb,
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

export default function DecksSection({ onDrillLesson }) {
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
