import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import { Plus, Pencil, Trash2, Flame, Loader2 } from "lucide-react";
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

export default function UsersSection() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "learner", hsk_level: 1, streak: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try { setUsers(await adminApi.getUsers()); }
    catch { /* noop */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm({ name: "", email: "", password: "", role: "learner", hsk_level: 1, streak: 0 });
    setModal({ mode: "add" });
  };
  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: "", role: u.role, hsk_level: u.hsk_level, streak: u.streak || 0 });
    setModal({ mode: "edit", user: u });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal.mode === "add") await adminApi.createUser(form);
      else await adminApi.updateUser(modal.user.id, form);
      setModal(null); load();
    } catch (e) {
      alert(e.response?.data?.error || "Error saving user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try { await adminApi.deleteUser(u.id); load(); }
    catch (e) { console.error(e); }
  };

  return (
    <div>
      <Breadcrumb crumbs={["Users", "Management"]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">User Management</h1>
          <p className="text-sm text-[#9B9BB4]">View and manage all registered learners and administrators.</p>
        </div>
        <button onClick={openAdd} style={{ background: RED_MID }} className={btnPrimary}>
          <Plus size={16} /> Add New User
        </button>
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
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1A1A2E]">
                    <Flame size={14} className="text-orange-500" />
                    {u.streak ?? 0}
                  </div>
                </td>
                <td className="px-4 py-4 text-[#9B9BB4] text-xs">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn icon={Pencil} color={RED_MID} title="Edit user" onClick={() => openEdit(u)} />
                    <ActionBtn icon={Trash2} color="#DC2626" title="Delete user" onClick={() => handleDelete(u)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New User" : "Edit User"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Name">
              <input className={inputCls} style={{ borderColor: BORDER }} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
            </Field>
            <Field label="Email">
              <input type="email" className={inputCls} style={{ borderColor: BORDER }} value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
            </Field>
            <Field label={modal.mode === "add" ? "Password" : "Password (leave blank to keep unchanged)"}>
              <input type="password" className={inputCls} style={{ borderColor: BORDER }} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role">
                <select className={inputCls} style={{ borderColor: BORDER }} value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="learner">Learner</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
              <Field label="HSK Level">
                <select className={inputCls} style={{ borderColor: BORDER }} value={form.hsk_level}
                  onChange={e => setForm(f => ({ ...f, hsk_level: parseInt(e.target.value) }))}>
                  {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>HSK {l}</option>)}
                </select>
              </Field>
            </div>
            {modal.mode === "edit" && (
              <Field label="Streak">
                <input type="number" className={inputCls} style={{ borderColor: BORDER }} value={form.streak}
                  onChange={e => setForm(f => ({ ...f, streak: parseInt(e.target.value) || 0 }))} min={0} />
              </Field>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className={btnSecondary} style={{ borderColor: BORDER }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: RED_MID }}
                className="flex-1 py-2 rounded-xl text-white text-sm font-bold hover:brightness-90 transition-all disabled:opacity-60">
                {saving ? "Saving…" : modal.mode === "add" ? "Create User" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
